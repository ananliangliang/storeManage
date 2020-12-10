import React, { FC, useRef } from 'react';
import styles from '../index.less';
import ProTable, { ActionType, ProColumnType } from '@ant-design/pro-table';
import serviceIndex from '@/services';

interface IndexListProps {
  warehouseId?: string;
}
const columns: ProColumnType<any>[] = [
  {
    dataIndex: '',
  },
  {},
];

const IndexList: FC<IndexListProps> = ({ warehouseId }) => {
  const actionRef = useRef<ActionType>();
  function getList(param: any) {
    return serviceIndex.getMassageLog({ ...param, id: warehouseId });
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
