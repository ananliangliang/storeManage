import { dict2select } from '@/models/dict';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceGoodsRule from '@/services/goodsRule';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Col, Divider, Modal, Popconfirm, Row } from 'antd';
import { Store } from 'antd/es/form/interface';
import Tree, { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import BreakageForm from './components/breakageForm';
import EarlyWarningForm from './components/earlyWarningForm';
import styles from './goodsInfo.less';
import { listByReginon } from './service/goodsInfo';

interface GoodsInfoProps {}
const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const GoodsInfo: FC<GoodsInfoProps> = (props) => {
  const [goodsState, getDict] = useModel('dict', (state) => [state.dict.goodsState, state.getDict]);
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    value: Store;
  }>({
    visible: false,
    value: {},
  });
  const [warningProp, setWarningProp] = useState<{
    visible: boolean;
    value: Store;
  }>({
    visible: false,
    value: {},
  });

  useEffect(() => {
    if (!goodsState) {
      getDict('goodsState');
    }
  }, [goodsState]);
  const columns = useMemo(() => {
    const state = dict2select(goodsState);
    console.log(state);
    return [
      {
        title: '序号',
        dataIndex: 'id',
        search: false,
      },
      {
        title: '物资名称',
        dataIndex: 'goods',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
      },
      {
        title: '型号规格',
        dataIndex: 'specs',
      },
      {
        title: '入库时间',
        dataIndex: 'wareTime',
        valueType: 'dateRange',
      },
      {
        title: '状态',
        dataIndex: 'state',
        valueEnum: state,
      },
      {
        title: '识别方式',
        dataIndex: 'type',
        valueEnum: typeEnum,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        search: false,
      },
      {
        title: '操作',
        valueType: 'option',
        render(_, record) {
          return (
            <>
              <a
                onClick={() => {
                  // setModalProp({
                  //   visible: true,
                  //   value: { ...record },
                  // });
                  // setTimeout(() => {
                  //   formRef.current?.setFieldsValue(record);
                  // }, 100);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setWarningProp({
                    visible: true,
                    value: { ...record },
                  });
                }}
              >
                预警
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setModalProp({
                    visible: true,
                    value: { goodsList: [{ ...record }] },
                  });
                  // setTimeout(() => {
                  //   formRef.current?.setFieldsValue(record);
                  // }, 100);
                }}
              >
                报损
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
  }, [goodsState]);

  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [curData, setCurData] = useState({});
  const [ruleList, setRuleList] = useState<any[]>([]);

  const treePos = useRef<any>({});

  useEffect(() => {
    async function fetch() {
      const res = await warehouseTreeListAll();
      const { pos, node } = warehouseTreeFormate(res);
      treePos.current = pos;
      setTreeData(node);
      console.warn(node);
      const list = await serviceGoodsRule.list();
      setRuleList(list.data);
    }
    fetch();
  }, []);

  useEffect(() => {
    actionRef.current?.reload();
  }, [curData]);

  const onTreeCheck = async (checked: React.ReactText[], info: any) => {
    console.log(checked, info);
    const data = info.node;
    if (info.selected) {
      setCurData(data);
    }
  };

  // async function handleFinish(res: Store) {
  //   console.log(res);
  //   const type = getText(curData);
  //   if (type === 'goods') {
  //   } else {
  //     init();
  //   }
  //   setModalProp((e) => ({
  //     ...e,
  //     visible: false,
  //   }));
  // }

  function handleDel(id: string | string[]) {
    console.log(id);
  }

  function getList(param: any) {
    param.flg = curData['flg'];
    param.id = curData['id'];
    return listByReginon(param);
  }

  function handleAdd(data: Store) {
    console.log(data);
    setWarningProp({ visible: false, value: {} });
    setModalProp({ visible: false, value: {} });
    actionRef.current?.reload();
  }
  return (
    <div>
      <Row gutter={20} className={styles.row}>
        <Col span={5}>
          <div className={styles.col2}>
            {/* <Spin spinning={loading}> */}
            {treeData.length > 0 && (
              <Tree
                showLine
                treeData={treeData}
                defaultExpandParent
                // defaultExpandAll
                defaultExpandedKeys={['0-0']}
                selectedKeys={[curData['key']]}
                autoExpandParent
                onSelect={onTreeCheck}
              ></Tree>
            )}
            {/* </Spin> */}
          </div>
        </Col>
        <Col span={19}>
          <div className={styles.col}>
            <ProTable<any>
              headerTitle="物资信息"
              actionRef={actionRef}
              tableAlertRender={false}
              rowSelection={{}}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  <Button
                    type="primary"
                    key="add"
                    onClick={() => {
                      console.log(action, selectedRows);
                      if (selectedRows && selectedRows.length > 0) {
                        setModalProp({ visible: true, value: { goodsList: [...selectedRows] } });
                      }
                    }}
                  >
                    批量报损
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
              dateFormatter="string"
              request={getList}
              pagination={{
                pageSize: 10,
              }}
              columns={columns}
              rowKey="id"
            ></ProTable>
          </div>
        </Col>
      </Row>
      <EarlyWarningForm
        {...warningProp}
        addressTree={treeData}
        onFinish={handleAdd}
        onClose={() => {
          setWarningProp({ visible: false, value: {} });
        }}
        ruleList={ruleList}
      />
      <BreakageForm
        {...modalProp}
        addressTree={treeData}
        onFinish={handleAdd}
        onClose={() => {
          setModalProp({ visible: false, value: {} });
        }}
      />
    </div>
  );
};
export default GoodsInfo;
