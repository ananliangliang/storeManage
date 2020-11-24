import React, { FC, useState, useEffect, useRef } from 'react';
import { Row, Col, Tree, Button, Divider, Popconfirm, Spin, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel, useRequest } from 'umi';
import { DataNode } from 'antd/lib/tree';
import { RespWarehouse } from '@/services/warehouseI';
import serviceRegion from '@/services/region';
import WarehouseForm, { TModalType } from './components/warehouseForm';
import { Store } from 'antd/es/form/interface';
import { getOrgData } from './tools';
import serviceWarehouse from '@/services/warehouse';
import { keyFindObj } from '@/models/warehouse';
import { subEffect } from '@/utils/tools';

interface IndexProps {}

const Index: FC<IndexProps> = (props) => {
  const { warehouse, init, loading } = useModel('warehouse', (state) => state);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [modalProp, setModalProp] = useState<{
    type: TModalType;
    visible: boolean;
    initialValues: Store;
  }>({
    type: 'warehouse',
    visible: false,
    initialValues: {},
  });
  const [columns, setColumns] = useState<ProColumns<any>[]>(() => {
    return getColumns({});
  });
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [curData, setCurData] = useState({});

  const fetch = useRequest(serviceRegion.list, {
    manual: true,
    onSuccess: (res, params) => {
      setPage({
        pageNum: res.pageNum,
        total: res.total,
        pageSize: 10,
      });
      setDataSource(res.list);
    },
  });
  const [page, setPage] = useState({
    pageNum: 1,
    total: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (warehouse.length == 0) {
      init();
    }
  }, []);

  useEffect(() => {
    setTreeData(warehouse);
    if (!curData['key'] && warehouse[0]) {
      setDataSource(getOrgData(warehouse));
    } else if (curData['key']) {
      // const arr = curData['key']
      console.log(keyFindObj(warehouse, curData['key']));
      getColumnsAndData(keyFindObj(warehouse, curData['key']));
    }
  }, [warehouse]);

  function getColumns(obj: Object) {
    const org_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        title: '编号',
      },
      {
        dataIndex: 'mergerName',
        title: '组织名称',
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
                    initialValues: {},
                    type: 'warehouse',
                  });
                }}
              >
                添加库房
              </a>
            </>
          );
        },
      },
    ];
    const warehouse_columns: ProColumns<any>[] = [
      {
        dataIndex: 'orgName',
        hideInForm: true,
        title: '所属组织',
      },
      {
        dataIndex: 'mergerName',
        title: '名称',
      },
      {
        dataIndex: 'address',
        title: '地址',
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
                    initialValues: {
                      warehouseId: record.id,
                    },
                    type: 'floor',
                  });
                }}
              >
                添加楼层
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'warehouse',
                  });
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
    ];
    const floor_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        title: '组织ID',
      },
      {
        dataIndex: 'mergerName',
        title: '楼层名称',
      },
      {
        dataIndex: 'reserved',
        title: '所在楼层',
      },
      {
        dataIndex: 'mergerName',
        title: '层数',
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
                    initialValues: {
                      warehouseId: record.warehouseId,
                      parentId: record.id,
                    },
                    type: 'partition',
                  });
                }}
              >
                添加分区
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'floor',
                  });
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  subEffect(
                    () => {
                      handleDel(record.id);
                    },
                    '正在请求',
                    '删除成功',
                  );
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </>
          );
        },
      },
    ];
    const partition_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        title: '编号ID',
      },
      {
        dataIndex: 'mergerName',
        hideInForm: true,
        title: '名称',
      },
      {
        dataIndex: 'lc',
        hideInForm: true,
        title: '所在楼层',
      },
      {
        dataIndex: 'kf',
        hideInForm: true,
        title: '库房',
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
                    initialValues: {
                      warehouseId: record['warehouseId'],
                      parentId: record['id'],
                    },
                    type: 'goods',
                  });
                }}
              >
                添加货架
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'partition',
                  });
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
    ];

    const goods_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        title: 'ID',
      },
      {
        dataIndex: 'num',
        hideInForm: true,
        title: '编号',
      },
      {
        dataIndex: 'regionName',
        hideInForm: true,
        title: '货架名',
      },
      {
        dataIndex: 'shortName',
        hideInForm: true,
        title: 'AB面',
      },
      {
        dataIndex: 'fq',
        hideInForm: true,
        title: '分区',
      },
      {
        dataIndex: 'kf',
        hideInForm: true,
        title: '库房',
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
                    initialValues: { ...record },
                    type: 'partition',
                  });
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
    ];

    // const goods_columns: ProColumns<any>[] = [];
    const type = getText(obj);
    switch (type) {
      case 'goods':
        return goods_columns;
      case 'partition':
        return partition_columns;
      case 'floor':
        return floor_columns;
      case 'warehouse':
        return warehouse_columns;
      case 'org':
        return org_columns;
      default:
        return org_columns;
    }
  }

  async function getColumnsAndData(data: any) {
    setColumns(getColumns(data));
    console.log(data);
    const newList = data.children.map((item: any) => {
      const newItem = { ...item };
      console.log(newItem);
      delete newItem.children;
      return newItem;
    });
    if (data.level == 3) {
      fetch.run({
        filter: {
          parent_id: data.id,
        },
        pageNum: 1,
      });
    } else {
      console.log(newList);
      setDataSource(newList);
      setPage({
        pageNum: 1,
        total: newList.length,
        pageSize: newList.length,
      });
    }
  }

  const onTreeCheck = async (checked: React.ReactText[], info: any) => {
    console.log(checked, info);
    const data = info.node;
    if (info.selected) {
      setCurData(data);
      getColumnsAndData(data);
    } else {
      setColumns(getColumns({}));
      setCurData({});
      setDataSource(getOrgData(treeData));
    }
  };

  async function handleFinish(res: Store) {
    console.log(res);
    const type = getText(curData);
    if (type === 'goods') {
    } else {
      init();
    }
    setModalProp((e) => ({
      ...e,
      visible: false,
    }));
  }

  const curType = getText(curData);

  function handleDel(id: string | string[]) {
    console.log(id);
    setCurData((curData) => {
      async function ff(curData: any) {
        const type = getText(curData);
        console.log(type);
        const serve = type === 'warehouse' ? serviceWarehouse : serviceRegion;
        if (typeof id === 'object') {
          await serve.batchRemove(id.join(','));
        } else {
          await serve.remove(id);
        }
        if (type === 'goods') {
          fetch.run({
            filter: {
              parent_id: curData['id'],
            },
            pageNum: page.pageNum,
          });
        } else {
          init();
        }
      }
      ff(curData);
      return curData;
    });
  }

  useEffect(() => {
    const type = getText(curData);
    if (type == 'goods') {
      fetch.run({
        filter: {
          parent_id: curData['id'],
        },
        pageNum: page.pageNum,
      });
    }
  }, [page.pageNum]);

  return (
    <div>
      <Row gutter={20} className={styles.row}>
        <Col span={6}>
          <div className={styles.col2}>
            <Spin spinning={loading}>
              {treeData.length > 0 && (
                <Tree
                  showLine
                  treeData={treeData}
                  defaultExpandParent
                  // defaultExpandAll
                  defaultExpandedKeys={['0-0']}
                  autoExpandParent
                  onSelect={onTreeCheck}
                ></Tree>
              )}
            </Spin>
          </div>
          {props.children}
        </Col>
        <Col span={18}>
          <div className={styles.col}>
            <ProTable<any>
              search={false}
              headerTitle={TITLE_TEXT[curType]}
              loading={fetch.loading}
              actionRef={actionRef}
              tableAlertRender={false}
              rowSelection={{}}
              pagination={{
                ...page,
                showSizeChanger: false,
                onChange: (page: number, pageSize: any) => {
                  setPage((e) => ({
                    ...e,
                    pageNum: page,
                  }));
                },
              }}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return (
                  curData['flg'] && [
                    <Button
                      type="primary"
                      key="add"
                      onClick={() => {
                        console.log(curData);
                        const initialValues = {};
                        switch (curType) {
                          case 'warehouse':
                            initialValues['orgNo'] = curData['id'];
                            break;
                          case 'floor':
                            initialValues['warehouseId'] = curData['id'];
                            break;
                          case 'partition':
                            initialValues['warehouseId'] = curData['warehouseId'];
                            initialValues['parentId'] = curData['id'];
                            break;
                        }
                        setModalProp({
                          visible: true,
                          initialValues,
                          type: curType as any,
                        });
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
                  ]
                );
              }}
              dataSource={dataSource}
              columns={columns}
              rowKey="id"
            ></ProTable>
          </div>
        </Col>
      </Row>
      <WarehouseForm
        {...modalProp}
        onClose={() => {
          setModalProp((e) => ({ ...e, visible: false }));
        }}
        onFinish={handleFinish}
      />
    </div>
  );
};
export default Index;

const TITLE_TEXT = {
  warehouse: '库房管理',
  floor: '楼层管理',
  partition: '片区管理',
  goods: '货架管理',
  org: '所有组织',
};

function getText(data: any) {
  if (data.flg) {
    switch (data.flg) {
      case 'org':
        return 'warehouse';
      case 'warehouse':
        return 'floor';
      case 'region':
        if (data.level == 2) {
          return 'partition';
        } else if (data.level == 3) {
          return 'goods';
        }
      default:
        throw '错误的数据';
    }
  } else {
    return 'org';
  }
}
