import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { FC, useRef } from 'react';
import serviceCommonLog from './services/commonLog';
//import styles from './commonLog.less'

interface CommonLogProps {}

const columns: ProColumns<any>[] = [
  {
    title: '时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    render(node, record) {
      return record.createTime;
    },
  },
  {
    dataIndex: 'userName',
    title: '操作人',
  },
  {
    dataIndex: 'coName',
    search: false,
    title: '所属单位',
  },
  {
    dataIndex: 'description',
    title: '动作',
  },
  // {
  //   dataIndex: 'parameter',
  //   title: '参数',
  //   search: false,
  // },
  {
    dataIndex: 'msg',
    title: '结果',
    search: false,
  },
];

const CommonLog: FC<CommonLogProps> = (props) => {
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable<any>
        tableAlertRender={false}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        actionRef={actionRef}
        headerTitle="系统日志"
        request={serviceCommonLog.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            // <PowerBotton
            //   allowStr="add"
            //   type="primary"
            //   key="add"
            //   onClick={() => {
            //     setModalProp({ visible: true, values: {} });
            //   }}
            // >
            //   <PlusOutlined /> 新增预警
            // </PowerBotton>,
          ];
        }}
        columns={columns}
        rowKey="logId"
      />
    </>
  );
};
export default CommonLog;
