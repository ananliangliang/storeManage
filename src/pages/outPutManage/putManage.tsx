import PowerBotton from '@/components/PowerBotton';
import config from '@/config/config';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceAccess from '@/services/access';

import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Upload } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import GiveBackForm from './components/giveBackForm';
import PutForm from './components/putForm';
import ReplenishmentForm from './components/replenishmentForm';
//import styles from './warningRule.less'

const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const stateEmnu = new Map([
  [0, '归还'],
  [1, '新增'],
  [2, '补货'],
]);
const typeEmnu = new Map([
  [0, '初始化'],
  [1, '出库'],
  [2, '入库'],
]);

const PutManage: FC = () => {
  const [putFormVisible, setPutFormVisible] = useState(false);
  const [giveBackVisible, setGiveBackVisible] = useState(false);
  const [replenishment, setReplenishment] = useState(false);

  const actionRef = useRef<ActionType>();

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const auth = useModel('power', (state) => state.curAuth);

  useEffect(() => {
    async function fetch() {
      const res = await warehouseTreeListAll();
      const { node } = warehouseTreeFormate(res);
      setTreeData(node);
    }

    fetch();
  }, []);

  const uploadProp = {
    name: 'excelFile',
    action: config.baseUrl + '/warehouse/file/uploadExcel2',
    withCredentials: true,
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        actionRef.current?.reload();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        search: false,
        hideInTable: true,
      },
      {
        title: '操作人',
        dataIndex: '',
        render(_, record) {
          return record.receive.uname;
        },
      },
      {
        title: '操作时间',
        dataIndex: 'receive_time',
        valueType: 'dateRange',
        render(_, record) {
          return record.receive.createTime;
        },
      },
      {
        title: '状态',
        dataIndex: 'type',
        valueType: 'select',
        hideInTable: true,
        search: false,
        render(_, reocrd) {
          return typeEmnu.get(reocrd.receive.type);
        },
        valueEnum: typeEmnu,
      },
      {
        title: '操作类型',
        dataIndex: 'state',
        valueType: 'select',
        render(_, reocrd) {
          return stateEmnu.get(reocrd.receive.state);
        },
        valueEnum: stateEmnu,
      },
      {
        title: '物品名称',
        dataIndex: 'goods_goods',
        render(_, record) {
          return record.goods.name;
        },
      },
      {
        title: '数量',
        dataIndex: 'count',
        search: false,
      },
      {
        title: '类型信息',
        dataIndex: 'goods_lastModel',
        render(_, record) {
          return record.goods.lastModel;
        },
      },
      {
        title: '品牌',
        render(_, record) {
          return record.goods.brand;
        },
        search: false,
      },
      {
        title: '规格型号',
        search: false,
        render(_, record) {
          return record.goods.specs;
        },
      },
      {
        title: '识别方式',
        dataIndex: 'goods_type',
        valueType: 'select',
        hideInTable: true,
        valueEnum: typeEnum,
        search: false,
        render(_, record) {
          return typeEnum[record.goods.type];
        },
      },
      {
        title: '库房',
        dataIndex: 'rule',
        render(_, record) {
          return record.goods.kf;
        },
        search: false,
      },
      {
        title: '分区',
        dataIndex: 'rule',
        render(_, record) {
          return record.goods.fq;
        },
        search: false,
      },
      {
        title: '货柜',
        dataIndex: 'rule',
        render(_, record) {
          return record.goods.hj;
        },
        search: false,
      },
      {
        title: '行列',
        render(_, record) {
          return record.goods.hl;
        },
        search: false,
      },
    ];
  }, []);

  function handleFinish(flag: boolean) {
    setPutFormVisible(false);
    console.log(flag);
    if (flag) {
      actionRef.current?.reload();
    }
  }

  function handleGiveBackFinish(flag: boolean) {
    setGiveBackVisible(false);
    console.log(flag);
    if (flag) {
      actionRef.current?.reload();
    }
  }

  function handleReplenishmentFinish(flag: boolean) {
    setReplenishment(false);
    if (flag) {
      actionRef.current?.reload();
    }
  }
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        actionRef={actionRef}
        headerTitle="入库管理"
        pagination={{
          pageSize: 10,
        }}
        request={serviceAccess.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton
              type="primary"
              allowStr="add"
              key="add"
              onClick={() => {
                setPutFormVisible(true);
              }}
            >
              <PlusOutlined />
              新增
            </PowerBotton>,
            <PowerBotton
              type="primary"
              allowStr="giveBack"
              key="giveBack"
              onClick={() => {
                setGiveBackVisible(true);
              }}
            >
              <PlusOutlined />
              归还
            </PowerBotton>,
            <PowerBotton
              type="primary"
              allowStr="replenishment"
              key="replenishment"
              onClick={() => {
                // setModalProp({ visible: true, values: {} });
                setReplenishment(true);
              }}
            >
              <PlusOutlined />
              补货
            </PowerBotton>,
            auth['import'] && (
              <Upload {...uploadProp}>
                <Button icon={<PlusOutlined />}>导入</Button>
              </Upload>
            ),
          ];
        }}
        columns={columns}
        rowKey="id"
      />
      <PutForm visible={putFormVisible} onFinish={handleFinish} addressTree={treeData} />
      <GiveBackForm visible={giveBackVisible} onFinish={handleGiveBackFinish} />
      <ReplenishmentForm
        visible={replenishment}
        addressTree={treeData}
        onFinish={handleReplenishmentFinish}
      />
    </div>
  );
};
export default PutManage;
