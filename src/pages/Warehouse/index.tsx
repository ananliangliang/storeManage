import React, { FC, useState, useEffect, useRef } from 'react';
import { Row, Col, Tree, Spin, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel, useRequest } from 'umi';
import { DataNode } from 'antd/lib/tree';
import WarehouseForm, { TModalType } from './components/warehouseForm';
import { Store } from 'antd/es/form/interface';
import { getOrgData } from './tools';
import { keyFindObj } from '@/models/warehouse';
import { subEffect } from '@/utils/tools';
import {
  regionBatchRemove,
  regionList,
  regionRemove,
  warehouseBatchRemove,
  warehouseRemove,
} from './service';
import PowerBotton from '@/components/PowerBotton';
import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';

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

  const fetch = useRequest(regionList, {
    manual: true,
    onSuccess: (res, params) => {
      setPage({
        pageNum: res.pageNum,
        total: res.total,
        pageSize: 10,
      });
      console.warn(curData);
      if (curData && curData['key']) {
        res.list.map((item) => {
          item['parentKey'] = curData['key'];
        });
      }
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
        hideInTable: true,
        title: '??????',
      },
      {
        dataIndex: 'mergerName',
        title: '????????????',
      },
      {
        title: '??????',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <PowerBotton
              type="link"
              allowStr="addWarehouse"
              onClick={() => {
                setModalProp({
                  visible: true,
                  initialValues: {},
                  type: 'warehouse',
                });
              }}
            >
              ????????????
            </PowerBotton>
          );
        },
      },
    ];
    const warehouse_columns: ProColumns<any>[] = [
      {
        dataIndex: 'orgName',
        hideInForm: true,
        title: '????????????',
      },
      {
        dataIndex: 'mergerName',
        title: '??????',
      },
      {
        dataIndex: 'address',
        title: '??????',
      },
      {
        title: '??????',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <>
              <PowerBotton
                type="link"
                allowStr="addFloor"
                showDivider
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
                ????????????
              </PowerBotton>
              <PowerBotton
                type="link"
                allowStr="editWarehouse"
                showDivider
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'warehouse',
                  });
                }}
              >
                ??????
              </PowerBotton>
              <PopconfirmPowerBtn
                title="?????????????"
                allowStr="delWarehouse"
                type="link"
                onConfirm={() => {
                  handleDel(record.id);
                }}
              >
                ??????
              </PopconfirmPowerBtn>
            </>
          );
        },
      },
    ];
    const floor_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        hideInTable: true,
        title: '??????ID',
      },
      {
        dataIndex: 'mergerName',
        title: '????????????',
      },
      {
        dataIndex: 'reserved',
        title: '????????????',
      },
      {
        dataIndex: 'mergerName',
        title: '??????',
      },
      {
        title: '??????',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <>
              <PowerBotton
                type="link"
                allowStr="addPartition"
                showDivider
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
                ????????????
              </PowerBotton>
              <PowerBotton
                type="link"
                allowStr="editFloor"
                showDivider
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'floor',
                  });
                }}
              >
                ??????
              </PowerBotton>
              <PopconfirmPowerBtn
                title="?????????????"
                onConfirm={() => {
                  subEffect(
                    () => {
                      handleDel(record.id);
                    },
                    '????????????',
                    '????????????',
                  );
                }}
                allowStr="delFloor"
                type="link"
              >
                ??????
              </PopconfirmPowerBtn>
            </>
          );
        },
      },
    ];
    const partition_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInForm: true,
        hideInTable: true,
        title: '??????ID',
      },
      {
        dataIndex: 'mergerName',
        hideInForm: true,
        title: '??????',
      },
      {
        dataIndex: 'lc',
        hideInForm: true,
        title: '????????????',
      },
      {
        dataIndex: 'kf',
        hideInForm: true,
        title: '??????',
      },
      {
        title: '??????',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <>
              <PowerBotton
                type="link"
                allowStr="addGoods"
                showDivider
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
                ????????????
              </PowerBotton>
              <PowerBotton
                type="link"
                allowStr="editPartition"
                showDivider
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'partition',
                  });
                }}
              >
                ??????
              </PowerBotton>
              <PopconfirmPowerBtn
                title="?????????????"
                onConfirm={() => {
                  subEffect(
                    () => {
                      handleDel(record.id);
                    },
                    '????????????',
                    '????????????',
                  );
                }}
                allowStr="delPartition"
                type="link"
              >
                ??????
              </PopconfirmPowerBtn>
            </>
          );
        },
      },
    ];
    const goods_columns: ProColumns<any>[] = [
      {
        dataIndex: 'id',
        hideInTable: true,
        hideInForm: true,
        title: 'ID',
      },
      {
        dataIndex: 'num',
        hideInForm: true,
        title: '??????',
      },
      {
        dataIndex: 'regionName',
        hideInForm: true,
        title: '?????????',
      },
      {
        dataIndex: 'shortName',
        hideInForm: true,
        title: 'AB???',
      },
      {
        dataIndex: 'fq',
        hideInForm: true,
        title: '??????',
      },
      {
        dataIndex: 'kf',
        hideInForm: true,
        title: '??????',
      },
      {
        title: '??????',
        valueType: 'option',
        render: (text, record, index) => {
          return (
            <>
              <PowerBotton
                type="link"
                allowStr="editGoods"
                showDivider
                onClick={() => {
                  setModalProp({
                    visible: true,
                    initialValues: { ...record },
                    type: 'goods',
                  });
                }}
              >
                ??????
              </PowerBotton>
              <PopconfirmPowerBtn
                title="?????????????"
                onConfirm={() => {
                  subEffect(
                    () => {
                      handleDel(record.id);
                    },
                    '????????????',
                    '????????????',
                  );
                }}
                allowStr="delGoods"
                type="link"
              >
                ??????
              </PopconfirmPowerBtn>
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
        pageSize: 10,
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
      fetch.run({
        filter: {
          parent_id: curData['id'],
        },
        pageNum: page.pageNum,
      });
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
        if (type === 'warehouse') {
          if (typeof id === 'object') {
            await warehouseBatchRemove(id.join(','));
          } else {
            await warehouseRemove(id);
          }
        } else {
          if (typeof id === 'object') {
            await regionBatchRemove(id.join(','));
          } else {
            await regionRemove(id);
          }
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
                  defaultExpandAll
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
              options={{
                reload: () => {
                  const type = getText(curData);
                  if (type == 'goods') {
                    fetch.run({
                      filter: {
                        parent_id: curData['id'],
                      },
                      pageNum: page.pageNum,
                    });
                  } else {
                    init();
                  }
                  // actionRef.current?.reload();
                },
              }}
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
                    <PowerBotton
                      type="primary"
                      key="add"
                      allowStr={'add' + curType.charAt(0).toUpperCase() + curType.slice(1)}
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
                          case 'goods':
                            initialValues['warehouseId'] = curData['warehouseId'];
                            initialValues['parentId'] = curData['id'];
                            initialValues['parentKey'] = curData['key'];
                            break;
                        }
                        setModalProp({
                          visible: true,
                          initialValues,
                          type: curType as any,
                        });
                      }}
                    >
                      <PlusOutlined /> ??????
                    </PowerBotton>,
                    <PowerBotton
                      key="del"
                      type="dashed"
                      allowStr={'del' + curType.charAt(0).toUpperCase() + curType.slice(1)}
                      onClick={() => {
                        if (selectedRowKeys && selectedRowKeys.length > 0) {
                          Modal.confirm({
                            content: `???????????????${selectedRowKeys.length}`,
                            async onOk() {
                              await handleDel(selectedRowKeys as string[]);
                            },
                          });
                        }
                      }}
                    >
                      <DeleteOutlined /> ??????
                    </PowerBotton>,
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
  warehouse: '????????????',
  floor: '????????????',
  partition: '????????????',
  goods: '????????????',
  org: '????????????',
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
        throw '???????????????';
    }
  } else {
    return 'org';
  }
}
