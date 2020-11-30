import { DEFAULT_FORM_LAYOUT } from '@/const';
import serviceUserProduct from '@/services/userProduct';
import { subEffect } from '@/utils/tools';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Divider, Drawer, Modal, Popconfirm } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
//import styles from './productConfig.less'

interface UserProductProps {
  visible: boolean;
  onClose: () => void;
  user: Store;
  width?: string | number;
}

const UserProduct: FC<UserProductProps> = ({ visible, onClose, user = {}, width = 800 }) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
  }>({
    visible: false,
    values: {},
  });

  const columns = useMemo(() => {
    return [
      {
        title: '标记',
        dataIndex: 'ident',
      },
      {
        title: 'keyId',
        dataIndex: 'keyId',
      },
      {
        title: 'keysecret',
        dataIndex: 'keysecret',
      },
      {
        title: '操作',
        valueType: 'option',
        render(_, record) {
          return (
            <>
              <a
                onClick={() => {
                  setModalProp({
                    visible: true,
                    values: { ...record },
                  });
                  setTimeout(() => {
                    formRef.current?.setFieldsValue(record);
                  }, 100);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  handleDel(record.id);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </>
          );
        },
      },
    ] as ProColumns<any>[];
  }, []);

  useEffect(() => {
    if (user.id) {
      actionRef.current?.reload();
    }
  }, [user.id]);

  function getList(params: any) {
    if (user.id) {
      params.uid = user.id;
      return serviceUserProduct.list(params);
    }
    throw '';
  }

  async function handleDel(id: string | string[]) {
    await subEffect(async () => {
      if (typeof id === 'object') {
        await serviceUserProduct.batchRemove(id.join(','));
      } else {
        await serviceUserProduct.remove(id);
      }
      actionRef.current?.reload();
    });
  }

  const submitLock = useRef(false);

  const modalClose = () => {
    setModalProp({ visible: false, values: {} });
    formRef.current?.resetFields();
  };
  return (
    <Drawer title="产品配置" width={width} onClose={onClose} visible={visible}>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        headerTitle={user.name}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button
              type="primary"
              key="add"
              onClick={() => {
                setModalProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined /> 添加
            </Button>,
            <Button
              key="del"
              type="dashed"
              onClick={() => {
                if (selectedRowKeys && selectedRowKeys.length > 0) {
                  Modal.confirm({
                    content: `是否删除该${selectedRowKeys.length}`,
                    async onOk() {
                      await handleDel(selectedRowKeys as string[]);
                    },
                  });
                }
              }}
            >
              <DeleteOutlined /> 删除
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={modalProp.values?.id ? '修改' : '新增'}
        visible={modalProp.visible}
        footer={null}
        onCancel={modalClose}
        getContainer={false}
      >
        <ProTable
          // headerTitle="角色管理"
          form={{
            ...DEFAULT_FORM_LAYOUT,
            layout: 'horizontal',
          }}
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            console.log(value);
            if (submitLock.current) return;
            submitLock.current = true;
            const data = { ...modalProp.values, ...value };
            data.ident = user.ident;
            await subEffect(async () => {
              await serviceUserProduct.onAddEdit(data);
              modalClose();
              actionRef.current?.reload();
            });
            submitLock.current = false;
          }}
        />
      </Modal>
    </Drawer>
  );
};

export default UserProduct;
