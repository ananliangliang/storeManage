import { dict2select } from '@/models/dict';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceAccess from '@/services/access';

import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import PutForm from './components/putForm';
//import styles from './warningRule.less'

const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const PutManage: FC = () => {
  const [putFormVisible, setPutFormVisible] = useState(false);
  const actionRef = useRef<ActionType>();

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [receiveType, entryType, getDict] = useModel('dict', (state) => [
    state.dict.receiveType,
    state.dict.entryType,
    state.getDict,
  ]);

  const [receive, setReceive] = useState<any>();
  const [entry, setEntry] = useState<any>();

  useEffect(() => {
    async function fetch() {
      const res = await warehouseTreeListAll();
      const { node } = warehouseTreeFormate(res);
      setTreeData(node);
    }
    if (!receiveType) {
      getDict('receiveType');
    }
    if (!entryType) {
      getDict('entryType');
    }
    fetch();
  }, []);

  useEffect(() => {
    setReceive(dict2select(receiveType));
  }, [receiveType]);
  useEffect(() => {
    setEntry(dict2select(entryType));
  }, [entryType]);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
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
      search: false,
      render(_, reocrd) {
        return receive ? receive[reocrd.receive.type] : reocrd.receive.type;
      },
      valueEnum: receive,
    },
    {
      title: '操作类型',
      dataIndex: 'state',
      valueType: 'select',
      render(_, reocrd) {
        return entry ? entry[reocrd.receive.state] : reocrd.receive.state;
      },
      valueEnum: entry,
    },
    {
      title: '物品名称',
      dataIndex: 'goods_goods',
      render(_, record) {
        return record.goods.goods;
      },
    },
    {
      title: '数量',
      dataIndex: 'count',
      search: false,
    },
    {
      title: '种类信息',
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
      valueEnum: typeEnum,
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

  function handleFinish(flag: boolean) {
    setPutFormVisible(false);
    if (flag) {
      actionRef.current?.reload;
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
            <Button
              type="primary"
              key="add"
              onClick={() => {
                setPutFormVisible(true);
              }}
            >
              <PlusOutlined />
              新增
            </Button>,
            <Button
              type="primary"
              key="giveBack"
              onClick={() => {
                // setModalProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined />
              归还
            </Button>,
            <Button
              type="primary"
              key="replenishment"
              onClick={() => {
                // setModalProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined />
              补货
            </Button>,
            <Button key="toLead" type="dashed" onClick={() => {}}>
              <PlusOutlined />
              导入
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
      <PutForm visible={putFormVisible} onFinish={handleFinish} addressTree={treeData} />
    </div>
  );
};
export default PutManage;
