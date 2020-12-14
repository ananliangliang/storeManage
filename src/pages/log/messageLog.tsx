import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { FC, useRef } from 'react';
import serviceMessageLog from './services/messageLog';
//import styles from './commonLog.less'

interface MessageLogProps {}

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
    title: '人员姓名',
  },
  {
    dataIndex: 'date',
    search: false,
    title: '信息',
  },
];

const MessageLog: FC<MessageLogProps> = (props) => {
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
        headerTitle="消息日志"
        request={serviceMessageLog.list}
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
export default MessageLog;
