import { dict2select } from '@/models/dict';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceGoodsRule from '@/services/goodsRule';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Col, message, Modal, Row, Tooltip } from 'antd';
import { Store } from 'antd/es/form/interface';
import Tree, { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useModel, useLocation } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import BreakageForm from './components/breakageForm';
import EarlyWarningForm from './components/earlyWarningForm';
import styles from './goodsInfo.less';
import { goodsDel, listByReginon } from './service/goodsInfo';
import GoodsQRCode from '@/components/goodsQRCode';
import serviceLocal from '@/services/local';
import PowerDropBtn from '@/components/PowerBotton/dropBtn';
import PowerBotton from '@/components/PowerBotton';
import RfidForm from './components/rfidForm';
import EditGoodsInfoForm from './components/editGoodsInfoForm';
import { FormInstance } from 'antd/lib/form';
import GoodsLog from './components/GoodsLog';
import config from '@/config/config';

interface GoodsInfoProps {}
const typeEnum = new Map([
  ['1', 'RFID'],
  ['2', '二维码'],
]);

const reignEnum = new Map([
  [0, '离位'],
  [1, '在位'],
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
    allowStr: 'log',
    key: 'log',
    text: '历史记录',
  },
  {
    allowStr: 'edit',
    key: 'edit',
    text: '编辑',
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
  const [user] = useModel('user', (state) => [state.user]);
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
  const [goodsLogProp, setGoodsLogProp] = useState<{
    visible: boolean;
    goods: Store;
  }>({
    visible: false,
    goods: {},
  });

  const [editProp, setEditProp] = useState<{
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
    return [
      {
        title: '序号',
        dataIndex: 'id',
        search: false,
        hideInTable: true,
      },
      {
        title: '物资名称',
        dataIndex: 'name',
        fixed: 'left'
      },
      {
        title: '在位情况',
        dataIndex: 'reign',
        hideInForm: true,
        hideInTable: true,
        valueType: 'select',
        valueEnum: reignEnum,
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
        title: '库存',
        dataIndex: 'count',
        search: false,
        render(node, record) {
          return record.type == 1 ? (record.count == 0 ? '离位' : '在位') : record.count;
        },
      },
      {
        title: '单位',
        dataIndex: 'unit',
        search: false,
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
        render(node, record) {
          return (
            <Tooltip trigger="hover" title={'RFID:' + record.signNo}>
              {typeEnum.get(record.type)}
            </Tooltip>
          );
        },
      },

      {
        title: '库房',
        dataIndex: 'kf',
        hideInForm: true,
        search: false,
      },
      {
        title: '分区',
        dataIndex: 'fq',
        hideInForm: true,
        search: false,
      },
      {
        title: '位置',
        search: false,
        hideInForm: true,
        valueType: 'textarea',
        render(node, record) {
          return record.hj + record.hl;
        },
      },
      {
        title: '定制管理编号',
        dataIndex: 'managementNo',
      },
      {
        title: '检测编号',
        dataIndex: 'testNo',
      },
      {
        title: '本次试验时间',
        dataIndex: 'testDate',
      },
      {
        title: '下次试验时间',
        dataIndex: 'nextTestDate',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },

      {
        title: '操作',
        valueType: 'option',
        width: 120,
        fixed: 'right',
        render(_, record) {
          return (
            <PowerDropBtn text="操作" onClick={(e) => handleMenuClick(e, record)} menus={menus} />
          );
        },
      },
    ] as ProColumns<any>[];
  }, [goodsState]);

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [curData, setCurData] = useState({});
  const [ruleList, setRuleList] = useState<any[]>([]);
  const location = useLocation();
  const treePos = useRef<any>({});

  function handleMenuClick(event: any, record: any) {
    switch (event.key) {
      case 'code':
        Modal.confirm({
          title: '二维码',
          icon: null,
          width: 1200,
          content: <GoodsQRCode codeNo={record.codeNo} name={record.name} />,
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
      case 'log':
        setGoodsLogProp({ visible: true, goods: record });
        break;
      case 'edit':
        setEditProp({ visible: true, value: record });
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
    const filter = location['query'];
    if (filter) {
      if (formRef.current) {
        formRef.current?.setFieldsValue(filter);
        formRef.current?.submit();
      } else {
        setTimeout(() => {
          formRef.current?.setFieldsValue(filter);
          formRef.current?.submit();
        }, 10000);
      }
    }
    fetch();
  }, [location]);

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

  async function handleDel(id: string | string[]) {
    console.log(id);
    const ids = typeof id === 'object' ? id.join(',') : id;
    await goodsDel(ids);
    actionRef.current?.reload();
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
              formRef={formRef}
              rowSelection={{}}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  <PowerBotton
                    type="primary"
                    key="code"
                    allowStr="code"
                    onClick={async () => {
                      if (selectedRows && selectedRows.length > 0) {
                        console.log(selectedRows);
                        const list = selectedRows.map((item) => ({
                          Qrcode: JSON.stringify({
                            code_no: item.codeNo,
                          }),
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
                  <Button key="export" type="primary">
                    <a
                      href={`${config.baseUrl}/warehouse/index/export?flg=org&id=${user?.department?.id}`}
                      download
                      target="_blank"
                    >
                      <ExportOutlined /> 导出
                    </a>
                  </Button>,
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
              scroll={{
                x: 1600
              }}
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
      <GoodsLog
        {...goodsLogProp}
        onFinish={() => {
          setGoodsLogProp({ visible: false, goods: {} });
        }}
      />
      <RfidForm
        {...RfidProp}
        onFinish={() => {
          setRfidProp({ visible: false, goods: {} });
        }}
      />
      <EditGoodsInfoForm
        {...editProp}
        addressTree={treeData}
        onFinish={(flag) => {
          setEditProp({ visible: false, value: {} });
          if (flag) {
            actionRef.current?.reload();
          }
        }}
      />
    </div>
  );
};
export default GoodsInfo;
