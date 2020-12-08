import { dict2select } from '@/models/dict';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceGoodsRule from '@/services/goodsRule';
import { DeleteOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Col, message, Modal, Row } from 'antd';
import { Store } from 'antd/es/form/interface';
import Tree, { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import BreakageForm from './components/breakageForm';
import EarlyWarningForm from './components/earlyWarningForm';
import styles from './goodsInfo.less';
import { listByReginon } from './service/goodsInfo';
import QRCode from 'qrcode.react';
import serviceLocal from '@/services/local';
import PowerDropBtn from '@/components/PowerBotton/dropBtn';
import PowerBotton from '@/components/PowerBotton';
import RfidForm from './components/rfidForm';

interface GoodsInfoProps {}
const typeEnum = new Map([
  ['1', 'RFID'],
  ['2', '二维码'],
]);

const menus = [
  {
    allowStr: 'code',
    key: 'code',
    text: '打印二维码',
  },
  {
    allowStr: 'rfid',
    key: 'rfid',
    text: '更换RFID',
  },
  {
    allowStr: 'warning',
    key: 'warning',
    text: '添加预警',
  },
  {
    allowStr: 'mod',
    key: 'mod',
    text: '报损',
  },
  {
    allowStr: 'del',
    key: 'del',
    text: '删除',
  },
];

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
  const [RfidProp, setRfidProp] = useState<{
    visible: boolean;
    goods: Store;
  }>({
    visible: false,
    goods: {},
  });

  useEffect(() => {
    if (!goodsState) {
      getDict('goodsState');
    }
  }, [goodsState]);
  const columns = useMemo(() => {
    const state = dict2select(goodsState);

    return [
      {
        title: '序号',
        dataIndex: 'id',
        search: false,
      },
      {
        title: '物资名称',
        dataIndex: 'name',
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
        render(node, record) {
          return record.wareTime;
        },
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
            <PowerDropBtn text="操作" onClick={(e) => handleMenuClick(e, record)} menus={menus} />
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

  function handleMenuClick(event: any, record: any) {
    switch (event.key) {
      case 'code':
        Modal.confirm({
          title: '二维码',
          icon: null,
          content: (
            <QRCode
              value={JSON.stringify({
                code_no: record.codeNo,
              })} //value参数为生成二维码的链接
              size={200} //二维码的宽高尺寸
              fgColor="#000000" //二维码的颜色
            />
          ),
          okText: '打印二维码',
          async onOk() {
            await serviceLocal.pointERCode([
              {
                Qrcode: JSON.stringify({
                  code_no: record.codeNo,
                }),
                Label: record.name,
              },
            ]);
          },
        });
        break;
      case 'rfid':
        setRfidProp({ visible: true, goods: record });
        break;
      case 'warning':
        setWarningProp({
          visible: true,
          value: { ...record },
        });
        break;
      case 'mod':
        setModalProp({
          visible: true,
          value: { goodsList: [{ ...record }] },
        });
        break;
      case 'del':
        Modal.confirm({
          content: '确定要删除吗',
          async onOk() {
            await handleDel(record.id);
          },
        });
        break;
    }
  }

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
                  <PowerBotton
                    type="primary"
                    key="code"
                    allowStr="code"
                    onClick={async () => {
                      if (selectedRows && selectedRows.length > 0) {
                        const list = selectedRows.map((item) => ({
                          Qrcode: item.codeNo,
                          Label: item.name,
                        }));
                        await serviceLocal.pointERCode(list);
                      } else {
                        message.warn('尚未勾选物资');
                      }
                    }}
                  >
                    批量打印二维码
                  </PowerBotton>,
                  <PowerBotton
                    type="primary"
                    key="add"
                    allowStr="mod"
                    onClick={() => {
                      console.log(action, selectedRows);
                      if (selectedRows && selectedRows.length > 0) {
                        setModalProp({ visible: true, value: { goodsList: [...selectedRows] } });
                      }
                    }}
                  >
                    批量报损
                  </PowerBotton>,
                  <PowerBotton
                    key="del"
                    allowStr="del"
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
                  </PowerBotton>,
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
      <RfidForm
        {...RfidProp}
        onFinish={() => {
          setRfidProp({ visible: false, goods: {} });
        }}
      />
    </div>
  );
};
export default GoodsInfo;
