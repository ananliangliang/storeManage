import React, { SFC, useEffect, useRef, useState, useMemo } from 'react';
import { Popconfirm, Divider, Modal, Tree, Button, message, TreeSelect } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RoleAddEdit, RoleRemove, RoleGet, RoleListAllTree } from '../service/role';
import { FormInstance } from 'antd/lib/form';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { MenuListAllTree } from '../service/menu';
import { subEffect, treeDataFormate } from '@/utils/tools';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { useSelector, useLocation } from 'dva';
//import styles from './Role.less'

interface RoleProps {}

interface curItem {
  parentId: string;
  roleId: string;
  roleName: string;
  list: any[];
  des: string;
  children: curItem[];
}

const handleAdd = async (values: any, roleId?: string) => {
  return await subEffect(async () => {
    values['roleId'] = roleId;
    await RoleAddEdit(values);
  });
};
const handleDel = async (id: string) => {
  return await subEffect(
    async () => {
      await RoleRemove(id);
    },
    '正在删除请稍后',
    '删除成功',
  );
};

const Role: SFC<RoleProps> = props => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [modalVisible, handleModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [role, setRole] = useState([]);
  const btns = useSelector(
    (selector: ConnectState) => selector.menu.func[useLocation().pathname] || [],
  );
  useEffect(() => {
    const init = async () => {
      const [menu, role] = await Promise.all([MenuListAllTree(), RoleListAllTree()]);
      setTreeData(menu);
      setRole(role);
    };
    init();
  }, []);

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
            const res = await Promise.allSettled(ids.map(id => RoleRemove(id)));
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
      const res = await RoleGet(record.roleId);
      handleModalVisible(true);
      setTimeout(() => {
        res.menus = res.menus.map((item: number) => item);
        // .checked = res.menus.map((item: number) => item);
        formRef.current?.setFieldsValue(res);
        console.log(formRef.current?.getFieldValue('menus'));
      }, 10);
      console.log(res);
    }, '正在请求数据请稍后');
  };

  const columns: ProColumns<curItem>[] = [
    {
      title: '父级角色',
      dataIndex: 'parentId',
      hideInTable: true,
      // hideInSearch:true,
      renderFormItem: (item, { onChange, value }) => {
        return (
          <TreeSelect
            showSearch
            allowClear
            treeData={treeDataFormate(role, 'roleId', 'roleName')}
            placeholder="是否需要父级单位"
            treeDefaultExpandAll
            onChange={onChange}
            value={value || undefined}
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
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '功能列表',
      dataIndex: 'menus',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        trigger: 'onCheck',
        valuePropName: 'checkedKeys',
      },
      trigger: 'onCheck',
      valuePropName: 'checkedKeys',

      renderFormItem: (item, { onChange, value }) => (
        <Tree
          defaultExpandAll
          checkStrictly
          treeData={treeDataFormate(treeData, 'menuId', 'menuName')}
          checkable
        />
      ),
    },
    {
      title: '操作',
      key: '3',
      align: 'center',
      valueType: 'option',
      render: (text, record, index) => {
        return [
          btns.includes('edit') && (
            <span>
              <a
                onClick={() => {
                  handleEdit(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
            </span>
          ),
          btns.includes('del') && (
            <span>
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  handleDel(record.roleId);
                  actionRef.current?.reload();
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ),
        ];
      },
    },
  ] as ProColumns<curItem>[];

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };
  return (
    <div>
      {role.length > 0 && (
        <ProTable
          headerTitle="角色管理"
          rowKey="roleId"
          rowSelection={{}}
          actionRef={actionRef}
          dataSource={role}
          defaultExpandAllRows
          columns={columns}
          tableAlertRender={false}
          toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
            return [
              btns.includes('add') && (
                <Button
                  type="primary"
                  onClick={() => {
                    handleModalVisible(true);
                  }}
                >
                  <PlusOutlined /> 添加
                </Button>
              ),
              btns.includes('del') && (
                <Button
                  type="dashed"
                  onClick={() => {
                    handleDels(selectedRowKeys as string[]);
                  }}
                >
                  {' '}
                  <DeleteOutlined /> 删除
                </Button>
              ),
            ];
          }}
        ></ProTable>
      )}
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
          {...DEFAULT_FORM_LAYOUT}
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            value.menus = value.menus.checked;
            console.log(value);
            const success = await handleAdd(value, formRef.current?.getFieldValue('roleId'));
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
