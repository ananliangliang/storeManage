import React, { SFC, useState, useEffect, useRef } from 'react';
import { Row, Col, Tree, Button, Divider, Popconfirm, Modal, TreeSelect, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { companyListAllTree, companyAddEdit, companyRemove } from '../service/company';
import styles from './Department.less';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect, treeDataFormate, deepClone } from '@/utils/tools';
import { useSelector, useLocation } from 'dva';
import { ConnectState } from '@/models/connect';

interface DepartmentProps {}
type orgType = { [coId: string]: currentItem[] };
interface currentItem {
  children: currentItem[];
  coName: string;
  coId: string;
  sort: number;
  parentId: string;
}

const formate = (com: currentItem[]) => {
  const tree: orgType = {};
  loop(com);
  return tree;
  function loop(cur: currentItem[]) {
    cur.map((item) => {
      if (item.children.length == 0) {
        delete item.children;
        if (tree[item.parentId]) {
          tree[item.parentId].push(item);
        } else {
          tree[item.parentId] = [item];
        }
      } else {
        if (tree[item.parentId]) {
          tree[item.parentId].push(item);
        } else {
          tree[item.parentId] = [item];
        }
        loop(item.children);
        // delete item.children;
      }
    });
  }
};

const Department: SFC<DepartmentProps> = (props) => {
  const [dataSource, setDataSource] = useState<currentItem[]>([]);
  const [com, setCom] = useState<any[]>([]);
  const [modalVisible, handleModalVisible] = useState(false);
  const [treeCheck, setTreeCheck] = useState<any>({});
  const btns = useSelector(
    (selector: ConnectState) => selector.menu.func[useLocation().pathname] || [],
  );
  const orgData = useRef<orgType>({});
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    init();
  }, []);
  const init = async (currentId?: string) => {
    const com = await companyListAllTree();
    console.log(com);

    const parrent: currentItem[] = [
      {
        coName: '全部',
        coId: '0',
        children: com,
        sort: 0,
        parentId: '',
      },
    ];
    orgData.current = formate(parrent);
    setCom(treeDataFormate(parrent, 'coId', 'coName'));
    console.log(orgData.current);
    const res = deepClone(orgData.current[currentId || 0]) as currentItem[];
    res.forEach((item) => {
      delete item.children;
    });
    setDataSource(res);
  };
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
            const res = await Promise.allSettled(ids.map((id) => companyRemove(id)));
            console.log(res);
            init();
          },
          '正在删除请稍后',
          '删除成功',
        );
      },
    });
  };

  const handleAdd = async (record: currentItem) => {
    return await subEffect(async () => {
      record.coId = formRef.current?.getFieldValue('coId');
      const res = await companyAddEdit(record);
      console.log(res);
      return res;
    });
  };

  const handleDel = async (id: string) => {
    await subEffect(
      async () => {
        const res = await companyRemove(id);
        console.log(res);
        init();
      },
      '正在删除请稍后',
      '删除成功',
    );
  };

  const columns: ProColumns<currentItem>[] = [
    {
      title: '父级单位',
      dataIndex: 'parentId',
      renderFormItem: (item, { onChange, value }) => {
        return (
          <TreeSelect
            showSearch
            allowClear
            treeData={com}
            placeholder="是否需要父级单位"
            treeDefaultExpandAll
            onChange={onChange}
            value={value || undefined}
          ></TreeSelect>
        );
      },
      render: (text, record, index) => {
        return treeCheck.name == '全部' ? '' : treeCheck.name;
      },
    },
    {
      title: '单位名称',
      dataIndex: 'coName',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
          <>
            {btns.includes('add') && (
              <>
                <a
                  onClick={() => {
                    handleModalVisible(true);
                    setTimeout(() => {
                      formRef.current?.setFieldsValue({ parentId: record.coId });
                    });
                  }}
                >
                  添加下级部门
                </a>
                <Divider type="vertical" />
              </>
            )}
            {btns.includes('edit') && (
              <>
                <a
                  onClick={() => {
                    // handleEdit(record , recordid)
                    handleModalVisible(true);
                    setTimeout(() => {
                      console.log(record);
                      formRef.current?.setFieldsValue(record);
                    }, 10);
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
              </>
            )}
            {btns.includes('del') && (
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  handleDel(record.coId);
                  actionRef.current?.reload();
                }}
              >
                <a>删除</a>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];
  const onTreeCheck = (checked: React.ReactText[], info: any) => {
    console.log(orgData.current);
    console.log(info);
    if (checked[0]) {
      setTreeCheck({ id: checked[0], name: info.node.title });
    } else {
      setTreeCheck({});
    }
    const temp = checked[0] ? orgData.current[checked[0]] : orgData.current['0'];
    if (temp && temp.length > 0) {
      const res = deepClone(
        checked[0] ? orgData.current[checked[0]] : orgData.current['0'],
      ) as currentItem[];
      console.log(res);
      res.forEach((item) => {
        delete item.children;
      });
      setDataSource(res);
    } else {
      setDataSource([]);
    }
  };

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };
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
            <ProTable<currentItem>
              search={false}
              headerTitle="部门管理"
              actionRef={actionRef}
              tableAlertRender={false}
              rowSelection={{}}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  btns.includes('add') && (
                    <Button
                      type="primary"
                      onClick={() => {
                        handleModalVisible(true);
                        setTimeout(() => {
                          if (treeCheck.id) {
                            formRef.current?.setFieldsValue({ parentId: treeCheck.id - 0 });
                          } else {
                            formRef.current?.setFieldsValue({ parentId: undefined });
                          }
                        });
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
              dataSource={dataSource}
              columns={columns}
              rowKey="coId"
              pagination={false}
            />
          </div>
        </Col>
      </Row>
      <Modal
        title="部门管理"
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
              if (actionRef.current) {
                init(treeCheck.id);
              }
            }
          }}
          rowKey="key"
        />
      </Modal>
    </div>
  );
};
export default Department;
