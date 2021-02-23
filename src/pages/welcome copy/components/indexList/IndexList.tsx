import React, { FC, useEffect, useRef } from 'react';
import styles from '../index.less';
import ProTable, { ActionType, ProColumnType } from '@ant-design/pro-table';
import serviceIndex from '@/services';

interface IndexListProps {
  warehouseId?: string;
  fetchFlag: boolean;
}
const columns: ProColumnType<any>[] = [
  {
    dataIndex: 'date',
    render(node, record) {
      const warn = record?.state.includes('ALARM');
      return <span style={warn ? { color: '#f5222d' } : {}}>{record.date}</span>;
    },
  },
  {
    dataIndex: 'createTime',
  },
];
const IndexList: FC<IndexListProps> = ({ warehouseId, fetchFlag }) => {
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    if (fetchFlag) {
      actionRef.current?.reload();
    }
  }, [fetchFlag, warehouseId]);

  function getList(param: any) {
    if (fetchFlag) {
      return serviceIndex.getMassageLog({ ...param, id: warehouseId });
    } else {
      return {
        data: [],
        total: 0,
      } as any;
    }
  }
  return (
    <div className={styles.box3}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-rili`} />
          出入日志
        </div>
        <ProTable<any>
          tableAlertRender={false}
          search={false}
          tableStyle={{
            height: '300px',
          }}
          actionRef={actionRef}
          pagination={{
            size: 'small',
            pageSize: 6,
          }}
          request={getList}
          toolBarRender={false}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
};
export default IndexList;
