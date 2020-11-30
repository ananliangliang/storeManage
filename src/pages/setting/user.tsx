import React, { FC, useState, useEffect, useRef } from 'react';
import { Button, Divider, Popconfirm, Modal } from 'antd';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Store } from 'antd/es/form/interface';
import { DataNode } from 'antd/lib/tree';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect } from '@/utils/tools';
import serviceCommon from '@/services/common';
import serviceUser from '@/services/user';
import StatusSwitch from '@/components/statusSwitch/statusSwitch';
import UserProduct from './components/userProduct';

interface IndexProps {}

const usedEmun = new Map([
  [true, '启用'],
  [false, '禁用'],
]) as any;

const User: FC<IndexProps> = (props) => {
  const { goodsKind, init } = useModel('goodsKind', (state) => state);
  const kind = useRef<DataNode[]>([]);
  const formRef = useRef<FormInstance>();
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
    columns: ProColumns<any>[];
  }>({
    visible: false,
    values: {},
    columns: [],
  });

  const [userProductProp, setUserProductProp] = useState({
    visible: false,
    user: {},
  });
  const [columns] = useState<ProColumns<any>[]>([
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '人员姓名',
      dataIndex: 'realName',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '是否认证',
      dataIndex: 'auth',
      hideInForm: true,
      valueEnum: {
        1: { text: '已认证', status: 'Success' },
        0: { text: '未认证', status: 'Default' },
      },
    },
    {
      title: '是否启用',
      dataIndex: 'used',
      valueEnum: usedEmun,
      render(text, record) {
        return (
          <StatusSwitch checked={record.used} onChange={(flag) => switchStatus(record, flag)} />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
          <>
            <a
              onClick={() => {
                setModalProp({
                  visible: true,
                  values: { ...record },
                  columns: [...columns],
                });
                setTimeout(() => {
                  console.log(record);
                  formRef.current?.setFieldsValue(record);
                }, 10);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setUserProductProp({
                  visible: true,
                  user: { ...record },
                });
              }}
            >
              配置
            </a>
          </>
        );
      },
    },
  ]);
  const actionRef = useRef<ActionType>();

  useEffect(() => {}, []);

  useEffect(() => {
    kind.current = goodsKind;
  }, [goodsKind]);

  async function switchStatus(data: any, flag: boolean) {
    await serviceUser.onAddEdit({ ...data, used: flag });
    data.state = flag ? 1 : 0;
  }

  const selectData = useRef({});

  async function getList(params: any): Promise<RequestData<any>> {
    // params.parent_id = selectData.current?.['id'];
    return await serviceUser.list(params);
  }

  const onClose = () => {
    setModalProp({ visible: false, values: {}, columns: [] });
    formRef.current?.resetFields();
  };

  function handleAdd(type: string) {
    if (type == 'goods') {
      setModalProp({ visible: true, values: {}, columns: [...columns] });
    } else {
      setModalProp({ visible: true, values: {}, columns: columns.slice(1, 3) });
    }
  }

  function handleCloseUserProduct() {
    setUserProductProp({
      visible: false,
      user: {},
    });
  }

  const submitLock = useRef(false);

  return (
    <div>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        headerTitle="人员管理"
        // rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button type="primary" key="add" onClick={() => handleAdd('goods')}>
              <PlusOutlined /> 添加
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      ></ProTable>

      <UserProduct {...userProductProp} onClose={handleCloseUserProduct} />

      <Modal
        title={modalProp.values?.id ? '修改' : '新增'}
        visible={modalProp.visible}
        footer={null}
        onCancel={onClose}
        getContainer={false}
      >
        <ProTable
          // headerTitle="角色管理"
          form={{
            ...DEFAULT_FORM_LAYOUT,
            layout: 'horizontal',
            initialValues: {
              used: true,
            },
          }}
          columns={modalProp.columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            console.log(value);
            if (submitLock.current) return;
            submitLock.current = true;
            const data = { ...modalProp.values, ...value };
            await subEffect(async () => {
              await serviceUser.onAddEdit(data);
              onClose();
              actionRef.current?.reload();
            });
            submitLock.current = false;
          }}
        />
      </Modal>
    </div>
  );
};
export default User;
