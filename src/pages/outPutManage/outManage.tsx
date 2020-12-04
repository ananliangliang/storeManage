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
import OutForm from './components/outForm';
import PutForm from './components/putForm';
//import styles from './warningRule.less'

const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const OutManage: FC = () => {
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
      title: '借出人',
      dataIndex: '',
      render(_, record) {
        return record.receive.uname;
      },
    },
    {
      title: '借出时间',
      dataIndex: 'receive_time',
      valueType: 'dateRange',
      render(_, record) {
        return record.receive.createTime;
      },
    },
    {
      title: '物资类型',
      dataIndex: 'goods_lastModel',
      render(_, record) {
        return record.goods.lastModel;
      },
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

  function getList(params = {}) {
    params['type'] = 2;
    return serviceAccess.list(params);
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
        request={getList}
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
              出库补录
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
      <OutForm visible={putFormVisible} onFinish={handleFinish} />
    </div>
  );
};
export default OutManage;
