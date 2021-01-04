import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Drawer } from 'antd';
import { Store } from 'antd/es/form/interface';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { goodGetHistory } from '../service/goodsInfo';
//import styles from './GoodsLog.less'

interface GoodsLogProps {
  visible: boolean;
  onFinish: () => void;
  goods: Store;
}

const GoodsLog: FC<GoodsLogProps> = ({ visible, goods = {}, onFinish }) => {
  const actionRef = useRef<ActionType>();
  const columns = useMemo(() => {
    return [
      {
        title: '物资名称',
        dataIndex: 'name',
      },
      {
        title: '操作人',
        dataIndex: 'uname',
        render(node, record) {
          return record.uname || '未知';
        },
      },
      {
        title: '动作',
        dataIndex: 'content',
      },
      {
        title: '时间',
        dataIndex: 'time',
      },
    ] as ProColumns<any>[];
  }, []);

  useEffect(() => {
    if (goods.id) {
      actionRef.current?.reload();
    }
  }, [goods.id]);

  function getList(params: any) {
    if (goods.id) {
      // params.id = goods.id;

      // return serviceGoodsRule.getGoodsList(params);
      return goodGetHistory({ id: goods.id });
    }
    throw '';
  }
  return (
    <Drawer title="物资日志" destroyOnClose width={1000} onClose={onFinish} visible={visible}>
      <ProTable
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        headerTitle={goods.name}
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        columns={columns}
        rowKey="id"
      />
    </Drawer>
  );
};
export default GoodsLog;
