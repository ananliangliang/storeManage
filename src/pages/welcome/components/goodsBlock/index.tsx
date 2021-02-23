import PowerBotton from '@/components/PowerBotton';
import PowerDropBtn from '@/components/PowerBotton/dropBtn';
import { warehouseTreeFormate } from '@/models/warehouse';
import config from '@/config/config';
import localData from '@/localStore';
import serviceLocal from '@/services/local';
import { download } from '@/utils/tools';
import { Button, message, Modal, Pagination, Spin, Table, Upload, Image, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useModel, useRequest } from 'umi';
import QRCode from 'qrcode.react';
import styles from '../style.less';
import { Store } from 'antd/es/form/interface';
import { goodsDel, listByReginon } from '@/pages/goodsManage/service/goodsInfo';
import EarlyWarningForm from '@/pages/goodsManage/components/earlyWarningForm';
import BreakageForm from '@/pages/goodsManage/components/breakageForm';
import GoodsLog from '@/pages/goodsManage/components/GoodsLog';
import RfidForm from '@/pages/goodsManage/components/rfidForm';
import EditGoodsInfoForm from '@/pages/goodsManage/components/editGoodsInfoForm';
import { DataNode } from 'antd/lib/tree';
import { warehouseTreeListAll } from '@/pages/Warehouse/service';
import serviceGoodsRule from '@/services/goodsRule';
import goodsDefault from '@/assets/goodsDefault.jpg';
import PutForm from '@/pages/outPutManage/components/putForm';
import OutForm from '../outForm';

interface IndexProps {
  kfId: number;
  qyId?: number;
  hlId?: number;
}

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
function calculateScrollY(outterWidth: number) {
  return (outterWidth / 1616) * 260;
}

const Index: FC<IndexProps> = ({ kfId, qyId, hlId }) => {
  const auth = useModel('power', (state) => state.curAuth);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [ruleList, setRuleList] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [scrollY, setSrolly] = useState(() => {
    const content = document.querySelector('.ant-layout-content') as Element;
    if (content) {
      calculateScrollY(content.clientWidth);
    }
    return 260;
  });
  const [list, setList] = useState({
    total: 99,
    data: [],
  });
  const [reqParam, setReqParam] = useState<any>({
    current: 1,
  });
  const fetchList = useRequest(listByReginon, {
    manual: true,
    onSuccess(res: any) {
      setList(res);
    },
  });

  const [putFormProp, setPutFormProp] = useState({
    visible: false,
    value: {},
  });
  const [outFormProp, setOutFormProp] = useState({
    visible: false,
    goods: [],
  });

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
    const content = document.querySelector('.ant-layout-content') as Element;

    function resize() {
      setSrolly(calculateScrollY(content.clientWidth));
    }
    content.addEventListener('resize', resize);
    return () => {
      content.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    async function fetch() {
      const res = await warehouseTreeListAll();
      const { node } = warehouseTreeFormate(res);
      setTreeData(node);
      console.warn(node);
      const list = await serviceGoodsRule.list();
      setRuleList(list.data);
    }
    fetch();
  }, []);

  useEffect(() => {
    setReqParam({
      flg: 'warehouse',
      id: kfId,
      current: 1,
    });
  }, [kfId]);

  useEffect(() => {
    if (qyId || hlId) {
      setReqParam({
        flg: 'region',
        id: hlId ?? qyId,
        current: 1,
      });
    }
  }, [qyId, hlId]);

  useEffect(() => {
    fetchList.run(reqParam);
  }, [reqParam]);

  const uploadProp = {
    name: 'excelFile',
    action: config.baseUrl + '/warehouse/file/uploadExcel2',
    withCredentials: true,
    showUploadList: false,
    headers: {
      loginToken: localData.getToken(),
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        // actionRef.current?.reload();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  function handleDownFile() {
    download('/excel/tools.xlsx');
  }

  const columns: ColumnsType<any> = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      render(_, record) {
        return (
          <Image width={30} height={30} src={record.imageUrl ? record.imageUrl : goodsDefault} />
        );
      },
    },
    {
      title: '物资名称',
      dataIndex: 'goods',
    },
    {
      title: '库存',
      dataIndex: 'count',
      render(node, record) {
        return record.type == 1 ? (
          record.count == 0 ? (
            <Tag color="error">离位</Tag>
          ) : (
            <Tag color="success">在位</Tag>
          )
        ) : (
          record.count
        );
      },
    },
    {
      title: '物资编号',
      dataIndex: 'specs',
    },
    {
      title: '操作',
      render(_, record) {
        return (
          <PowerDropBtn text="操作" onClick={(e) => handleMenuClick(e, record)} menus={menus} />
        );
      },
    },
  ];

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
  async function handleDel(id: string | string[]) {
    console.log(id);
    const ids = typeof id === 'object' ? id.join(',') : id;
    await goodsDel(ids);
    // actionRef.current?.reload();
  }

  function handleAdd(data: Store) {
    console.log(data);
    setWarningProp({ visible: false, value: {} });
    setModalProp({ visible: false, value: {} });
    // actionRef.current?.reload();
  }

  function handlePaginChange(current: number) {
    setReqParam((e: any) => ({
      ...e,
      current,
    }));
  }

  function handleOutForm(flag: boolean) {
    setOutFormProp({
      visible: false,
      goods: [],
    });
    if (flag) {
      fetchList.run(reqParam);
    }
  }

  function handlePutForm(flag: boolean) {
    setPutFormProp({
      visible: false,
      value: {},
    });
    if (flag) {
      fetchList.run(reqParam);
    }
  }

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Spin spinning={fetchList.loading}>
      <div className={styles.goodsBlock}>
        <div className={styles.bg}></div>
        <div className={styles.box}>
          <div className={styles.header}>
            <div>物品详情 {}</div>
            <div>
              <a onClick={handleDownFile}>模板下载</a>

              <Upload {...uploadProp}>
                <Button type="primary">导入</Button>
              </Upload>
              <PowerBotton
                type="primary"
                allowStr="export"
                key="export"
                onClick={() => {
                  // download('')
                }}
              >
                导出
              </PowerBotton>
              <PowerBotton
                type="primary"
                allowStr="add"
                key="add"
                onClick={() => {
                  setPutFormProp({
                    visible: true,
                    value: {
                      hlId: reqParam.id,
                    },
                  });
                }}
              >
                入库
              </PowerBotton>
              <PowerBotton
                type="primary"
                allowStr="replenishment"
                key="replenishment"
                onClick={() => {
                  const goods = selectedRowKeys.reduce((all, now) => {
                    const tar = list.data.find((item: any) => item.id == now);
                    if (tar) all.push(tar);
                    return all;
                  }, []);
                  setOutFormProp({
                    visible: true,
                    goods,
                  });
                }}
              >
                出库
              </PowerBotton>
            </div>
          </div>
          <Table
            className={styles.table}
            columns={columns}
            scroll={{
              y: scrollY,
            }}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={false}
            dataSource={list.data}
          />

          <div className={styles.footer}>
            <Pagination
              className={styles.pagin}
              pageSize={10}
              total={list.total}
              onChange={handlePaginChange}
              showQuickJumper
              showSizeChanger={false}
              // current={reqParam.current}
              size="small"
            />
          </div>

          <PutForm {...putFormProp} onFinish={handlePutForm} addressTree={treeData} />
          <OutForm {...outFormProp} onFinish={handleOutForm} />
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
                // actionRef.current?.reload();
              }
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
export default Index;
