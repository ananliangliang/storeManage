import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col, Tree, Button, Divider, Modal, TreeSelect, Avatar, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { companyListAllTree } from '../service/company';
import styles from './Department.less';
import { PlusOutlined } from '@ant-design/icons';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import Form, { FormInstance } from 'antd/lib/form';
import { subEffect, treeDataFormate } from '@/utils/tools';
import {
  getUserList2,
  userAddEdit,
  editLoginAuthority,
  insertUserRole,
  userRemove,
} from '@/services/user';
import FormModal, { FormModalRef } from '@/components/Modals/FormModal';
import { RoleListAllTree } from '../service/role';
import { ConnectState } from '@/models/connect';
import { useSelector, useLocation } from 'dva';
import defaultAvatar from '@/assets/image/defaultAvatar.jpeg';

interface UserProps {}
type orgType = { [coId: string]: comItem[] };
interface comItem {
  children: comItem[];
  coName: string;
  coId: string;
  sort: number;
  parentId: string;
}

interface Icurrent {
  phone: number;
  createTime: Date;
  name: string;
  /**
   * 账号
   *
   * @type {string}
   * @memberof Icurrent
   */
  userName: string;
  userId: string;
  coId: string;
  roles: { roleId: string; roleName: string }[];
  headPic: string;
  used: boolean;
}

const formate = (com: comItem[]) => {
  const tree: orgType = {};
  loop(com);
  return tree;
  function loop(cur: comItem[]) {
    cur.map((item) => {
      if (item.children.length == 0) {
        delete item.children;
        if (tree[item.parentId]) {
          tree[item.parentId].push(item);
        } else {
          tree[item.parentId] = [item];
        }
      } else {
        loop(item.children);
      }
    });
  }
};

const User: FC<UserProps> = (props) => {
  const [com, setCom] = useState<any[]>([]);
  const [modalVisible, handleModalVisible] = useState(false);
  const [role, setRole] = useState<any[]>([]);
  const btn = useSelector(
    (selector: ConnectState) => selector.menu.func[useLocation().pathname] || [],
  );
  const selectRows = useRef<string[]>([]);
  const treeCheck = useRef<any>({});
  const formModal = useRef<FormModalRef>(null);

  const actionRef = useRef<ActionType>();
  const orgData = useRef<orgType>({});
  const formRef = useRef<FormInstance>();
  const searchRef = useRef<FormInstance>();
  useEffect(() => {
    init();
    console.log(btn);
  }, []);

  const onAccredit = async (d: any) => {
    await subEffect(async () => {
      console.log(formModal.current?.form.getFieldsValue());
      d.roles = d.roles.checked;
      if (selectRows.current.length > 0) {
        await Promise.allSettled(
          selectRows.current.map((item) => insertUserRole({ ...d, userId: item })),
        );
      } else {
        await insertUserRole(d);
      }
      actionRef.current?.reload();
      selectRows.current = [];
    });
  };

  const init = async (currentId?: string) => {
    const [com, role] = await Promise.all([companyListAllTree(), RoleListAllTree()]);
    const parrent: comItem[] = [
      {
        coName: '全部',
        coId: '0',
        children: com,
        sort: 0,
        parentId: '0',
      },
    ];
    setRole(role);
    setCom(treeDataFormate(parrent, 'coId', 'coName'));
    orgData.current = formate(com);

    // setDataSource(orgData.current[currentId || 0])
  };

  const handleAdd = async (record: Icurrent) => {
    return await subEffect(async () => {
      record.userId = formRef.current?.getFieldValue('userId');
      console.log(record);
      const res = await userAddEdit(record);
      return res;
    });
  };

  const columns: ProColumns<Icurrent>[] = [
    {
      title: '所属单位',
      dataIndex: 'coId',
      rules: [
        {
          required: true,
          message: '请选择所属单位',
        },
      ],
      hideInSearch: true,
      renderFormItem: (item, { onChange, value }) => {
        return (
          <TreeSelect
            showSearch
            allowClear
            placeholder="请选择所属单位"
            treeDefaultExpandAll
            onChange={onChange}
            treeData={com}
            value={value || undefined}
          ></TreeSelect>
        );
      },
      render: (_, record) => {
        return record['coName'];
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      required: true,
      rules: [{ message: '请填写姓名', required: true }],
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      required: true,
      hideInSearch: true,
      rules: [{ message: '请填写用户名', required: true }],
    },
    {
      title: '电话',
      dataIndex: 'phone',
      required: true,
      rules: [{ message: '请填写电话', required: true }],
    },
    {
      title: '头像',
      dataIndex: 'headPic',
      hideInSearch: true,
      hideInForm: true,
      render: (ava) => {
        return <Avatar size="large" src={ava ? ava : defaultAvatar} />;
      },
      // renderFormItem: (item, { onChange, value }) => {
      //   return
      // }
      // renderFormItem
    },
    {
      title: '角色',
      render: (_, record, index) => {
        return record.roles ? record.roles.map((item) => item.roleName).join(',') : '';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
          <>
            {btn.includes('edit') && (
              <>
                <a
                  onClick={() => {
                    handleModalVisible(true);
                    setTimeout(() => {
                      formRef.current?.setFieldsValue(record);
                    }, 10);
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
              </>
            )}
            {btn.includes('addRole') && (
              <>
                <a
                  onClick={() => {
                    if (formModal.current) {
                      formModal.current?.show({
                        title: '授权',
                        onSubmit: onAccredit,
                      });
                      formModal.current.form.setFieldsValue({
                        roles: { checked: record.roles.map((item) => item.roleId) },
                        userId: record.userId,
                      });
                      setTimeout(() => {
                        console.log(formModal.current?.form.getFieldsValue());
                      }, 10);
                    }
                  }}
                >
                  授权
                </a>
                <Divider type="vertical" />
              </>
            )}
            {btn.includes('editLoginAuthority') && (
              <a
                onClick={async () => {
                  await editLoginAuthority({ userId: record.userId, used: !record.used ? 1 : 0 });
                  actionRef.current?.reload();
                }}
              >
                {record.used ? '禁用' : '启用'}{' '}
              </a>
            )}
            {btn.includes('del') && (
              <span>
                <Popconfirm
                  title="确认删除?"
                  onConfirm={async () => {
                    await userRemove(record.userId);
                    actionRef.current?.reload();
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          </>
        );
      },
    },
  ];
  const onTreeCheck = (checked: React.ReactText[], info: any) => {
    if (checked[0]) {
      treeCheck.current = { id: checked[0], name: info.node.title };
    } else {
      treeCheck.current = {};
    }
    searchRef.current?.resetFields();
    actionRef.current?.reload();
  };

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };

  const handleGetUser = (param: any = {}) => {
    const trueData = searchRef.current?.getFieldsValue();
    for (const key in trueData) {
      if (trueData.hasOwnProperty(key)) {
        const element = trueData[key];
        param[key] = element;
      }
    }
    if (treeCheck.current.id != 0) {
      param.coId = treeCheck.current.id;
    }

    return getUserList2(param);
  };
  const roleTree = useMemo(() => {
    return treeDataFormate(role, 'roleId', 'roleName');
  }, [role]);
  return (
    <div>
      <Row gutter={8} className={styles.row}>
        <Col span={6}>
          <div className={styles.col2}>
            {com.length > 0 && (
              <Tree
                showLine
                treeData={com}
                defaultExpandedKeys={['0']}
                onSelect={onTreeCheck}
              ></Tree>
            )}
          </div>
        </Col>
        <Col span={18}>
          <div className={styles.col}>
            <ProTable<Icurrent>
              headerTitle="人员管理"
              actionRef={actionRef}
              tableAlertRender={false}
              rowSelection={{}}
              formRef={searchRef}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  btn.includes('add') && (
                    <Button
                      type="primary"
                      onClick={() => {
                        handleModalVisible(true);
                        setTimeout(() => {
                          formRef.current?.setFieldsValue({ coId: treeCheck.current.id - 0 });
                        });
                      }}
                    >
                      <PlusOutlined /> 添加
                    </Button>
                  ),
                  btn.includes('addRole') && (
                    <Button
                      onClick={() => {
                        if (formModal.current) {
                          formModal.current?.show({
                            title: '授权',
                            onSubmit: onAccredit,
                          });
                          selectRows.current = selectedRowKeys as string[];
                          formModal.current.form.setFieldsValue({
                            // roles: { checked: record.roles.map(item => item.roleId) },
                            // userId: record.userId,
                          });
                          setTimeout(() => {
                            console.log(formModal.current?.form.getFieldsValue());
                          }, 10);
                        }
                      }}
                    >
                      批量授权
                    </Button>
                  ),
                ];
              }}
              postData={(d: any) => {
                console.log(d);
                return d;
              }}
              request={handleGetUser}
              columns={columns}
              rowKey="userId"
            ></ProTable>
          </div>
        </Col>
      </Row>
      <Modal
        title="人员管理"
        visible={modalVisible}
        footer={null}
        onCancel={onClose}
        getContainer={false}
      >
        <ProTable
          {...DEFAULT_FORM_LAYOUT}
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              actionRef.current?.reload();
            }
          }}
          rowKey="key"
        ></ProTable>
      </Modal>

      <FormModal ref={formModal}>
        <Form.Item style={{ display: 'none' }} name="userId">
          <span></span>
        </Form.Item>
        {roleTree.length > 0 && (
          <Form.Item name="roles" trigger="onCheck" valuePropName="checkedKeys">
            <Tree checkable checkStrictly defaultExpandAll treeData={roleTree} />
          </Form.Item>
        )}
      </FormModal>
    </div>
  );
};
export default User;
