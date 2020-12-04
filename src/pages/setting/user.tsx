import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { Badge, Button, Divider, Modal } from 'antd';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Store } from 'antd/es/form/interface';
import { DataNode } from 'antd/lib/tree';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect } from '@/utils/tools';
import serviceUser from '@/services/user';
import StatusSwitch from '@/components/statusSwitch/statusSwitch';
import UserAuth from './components/userAuth';
import serviceCommon from '@/services/common';
import serviceRole from '@/services/role';
import UserConfig from './components/userConfig';

interface IndexProps {}

const usedEmun = new Map([
  [true, '启用'],
  [false, '禁用'],
]) as any;

const User: FC<IndexProps> = (props) => {
  const { goodsKind } = useModel('goodsKind', (state) => state);
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
  const [depTree, setDepTree] = useState<any>([]);
  const [userAuthProp, setUserAuthProp] = useState({
    visible: false,
    user: {},
  });
  const [userConfigProp, setUserConfigProp] = useState({
    visible: false,
    user: {},
  });

  const [role, setRole] = useState<any[]>([]);

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const fetch = async () => {
      const res: any = await serviceCommon.departmentListAllTree();
      setDepTree(res.depTree);
      const role = await serviceRole.list({
        pageSize: 0,
      });
      setRole(role.data);
    };
    fetch();
  }, []);

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
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
        title: '所属组织',
        hideInForm: true,
        search: false,
        render(node, record) {
          return record?.userProduct?.orgName || '未分配';
        },
      },
      {
        title: '所属部门',
        hideInForm: true,
        search: false,
        render(node, record) {
          return record?.userProduct?.depName || '未分配';
        },
      },
      {
        title: '角色',
        hideInForm: true,
        search: false,
        render(node, record) {
          if (record?.userProduct?.roleList) {
            return record.userProduct.roleList.map((item: any) => item.roleName).join(',');
          }
          return '未分配';
        },
      },
      {
        title: '是否认证',
        dataIndex: 'auth',
        hideInForm: true,
        render(node, record) {
          switch (record.auth) {
            case '0':
              return <Badge status="default" text="未认证" />;
            case '1':
              return <Badge status="success" text="已认证" />;
            case '2':
              return (
                <Badge status="warning">
                  <a onClick={() => handleAuth(record)}> 待认证</a>
                </Badge>
              );
          }
          return null;
        },
        valueEnum: {
          2: { text: '待认证', status: 'warning' },
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
                  setUserConfigProp({
                    visible: true,
                    user: { ...record },
                  });
                  // setUserProductProp({
                  //   visible: true,
                  //   user: { ...record },
                  // });
                }}
              >
                配置
              </a>
            </>
          );
        },
      },
    ];
  }, []);

  function handleAuth(record: any) {
    setUserAuthProp({
      user: record,
      visible: true,
    });
  }

  useEffect(() => {
    kind.current = goodsKind;
  }, [goodsKind]);

  async function switchStatus(data: any, flag: boolean) {
    await serviceUser.onAddEdit({ ...data, used: flag });
    data.state = flag ? 1 : 0;
  }

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

  function handleAuthFinish(flag: boolean) {
    setUserAuthProp({
      visible: false,
      user: {},
    });
    if (flag) {
      actionRef.current?.reload();
    }
  }

  function handleConfigFinish(flag: boolean) {
    setUserConfigProp({
      visible: false,
      user: {},
    });
    if (flag) {
      actionRef.current?.reload();
    }
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
      />

      {/* <UserProduct {...userProductProp} onClose={handleCloseUserProduct} /> */}
      <UserAuth {...userAuthProp} onFinish={handleAuthFinish} />
      <UserConfig
        {...userConfigProp}
        roleTree={role}
        onFinish={handleConfigFinish}
        orgTree={depTree}
      />

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
