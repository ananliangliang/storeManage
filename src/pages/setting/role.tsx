import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Popconfirm, Divider, Modal, Tree, Button, message, TreeSelect } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';
import { removeEmptyChildren, subEffect, treeDataFormate } from '@/utils/tools';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import serviceMenu from '@/services/menu';
import serviceRole from '@/services/role';
import { FormTree } from '@/components/FormComponents/FormTree';
//import styles from './Role.less'

interface RoleProps {}

interface curItem {
  parentId: string;
  id: string;
  roleName: string;
  list: any[];
  des: string;
  children: curItem[];
}

const handleAdd = async (values: any, roleId?: string) => {
  return await subEffect(async () => {
    values['roleId'] = roleId;
    await serviceRole.onAddEdit(values);
  });
};
const handleDel = async (id: string) => {
  return await subEffect(
    async () => {
      await serviceRole.remove(id);
    },
    '正在删除请稍后',
    '删除成功',
  );
};

const Role: FC<RoleProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [modalVisible, handleModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [role, setRole] = useState<any[]>([]);
  const roleTree = useMemo(() => {
    return treeDataFormate(treeData, 'id', 'menuName');
  }, [treeData]);
  useEffect(() => {
    const init = async () => {
      const [menu, role]: any = await Promise.all([
        serviceMenu.list({
          pageSize: 0,
        }),
        serviceRole.list({
          pageSize: 0,
        }),
        // RoleListAllTree(),
      ]);
      setTreeData(menu.data);
      removeEmptyChildren(role.data);
      setRole(role.data);
    };
    init();
  }, []);

  const columns: ProColumns<curItem>[] = useMemo(() => {
    return [
      {
        title: '父级角色',
        dataIndex: 'parentId',
        hideInTable: true,
        renderFormItem: (item, config) => {
          return (
            <TreeSelect
              showSearch
              allowClear
              treeData={treeDataFormate(role, 'id', 'roleName')}
              placeholder="是否需要父级单位"
              treeDefaultExpandAll
            />
          );
        },
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'des',
        width: '50%',
        align: 'center',
        search: false,
        valueType: 'textarea',
      },
      {
        title: '功能列表',
        dataIndex: 'menus',
        hideInTable: true,
        search: false,
        formItemProps: {
          trigger: 'onCheck',
          valuePropName: 'checkedKeys',
        },
        renderFormItem: () => {
          return <FormTree treeData={roleTree} />;
        },
      },
      {
        title: '操作',
        key: '3',
        align: 'center',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <>
              <a
                onClick={() => {
                  handleEdit(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <span>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={() => {
                    handleDel(record.id);
                    actionRef.current?.reload();
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            </>
          );
        },
      },
    ] as ProColumns<curItem>[];
  }, [role, roleTree]);

  const handleDels = (ids: string[]) => {
    if (ids.length == 0) {
      message.warn('起码勾选其中一项');
      return;
    }
    Modal.confirm({
      title: '确定要删除吗',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        await subEffect(
          async () => {
            const res = await serviceRole.batchRemove(ids.join(','));
            console.log(res);
            actionRef.current?.reload();
          },
          '正在删除请稍后',
          '删除成功',
        );
      },
    });
  };

  const handleEdit = async (record: curItem) => {
    await subEffect(async () => {
      console.log(record);
      const res: any = await serviceRole.get(record.id);
      handleModalVisible(true);
      setTimeout(() => {
        res.menus = res.list.map((item: number) => item);
        res.menus = {
          checked: res.menus,
        };
        // .checked = res.menus.map((item: number) => item);
        if (res.parentId == 0) {
          delete res.parentId;
        }
        formRef.current?.setFieldsValue(res);
        console.log(formRef.current?.getFieldValue('menus'));
      }, 120);
      console.log(res);
    }, '正在请求数据请稍后');
  };

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };
  return (
    <div>
      <ProTable
        headerTitle="角色管理"
        rowKey="id"
        rowSelection={{}}
        actionRef={actionRef}
        dataSource={role}
        defaultExpandAllRows
        columns={columns}
        tableAlertRender={false}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> 添加
            </Button>,
            <Button
              key="del"
              type="dashed"
              onClick={() => {
                handleDels(selectedRowKeys as string[]);
              }}
            >
              <DeleteOutlined /> 删除
            </Button>,
          ];
        }}
      ></ProTable>
      <Modal
        title="角色管理"
        visible={modalVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose
        getContainer={false}
      >
        <ProTable
          headerTitle="角色管理"
          form={{
            labelCol: {
              span: 6,
            },
            wrapperCol: {
              span: 18,
            },
            layout: 'horizontal',
          }}
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            value.menus = value.menus.checked;
            console.log(value, formRef.current?.getFieldValue('id'));
            if (!Object.getOwnPropertyDescriptor(value, 'parentId')) value.parentId = 0;
            const success = await handleAdd(value, formRef.current?.getFieldValue('id'));
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      </Modal>
    </div>
  );
};
export default Role;
