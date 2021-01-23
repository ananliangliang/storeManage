import SearchSelect from '@/components/FormComponents/searchSelect';
import FormModal, { FormModalRef } from '@/components/Modals/FormModal';
import PowerBotton from '@/components/PowerBotton';
import serviceUser from '@/services/user';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Form } from 'antd';

import React, { FC, useRef } from 'react';
import serviceMessageLog from './services/messageLog';
//import styles from './commonLog.less'

interface MessageLogProps {}

const MessageLog: FC<MessageLogProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const formModal = useRef<FormModalRef>(null);
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
    {
      valueType: 'option',
      title: '操作',
      render(node, record) {
        return (
          !record.userId && (
            <PowerBotton allowStr="record" type="link" onClick={() => handleRecord(record.id)}>
              补录
            </PowerBotton>
          )
        );
      },
    },
  ];

  function handleRecord(id: string) {
    formModal.current?.show({
      title: '补录',
      async onSubmit(data) {
        const t = curUser.current as any;
        await serviceMessageLog.onEditUser({ userId: t.id, userName: t.realName, id });
        curUser.current = {};
        curList.current = [];
        actionRef.current?.reload();
      },
    });
  }

  const curUser = useRef({});
  const curList = useRef<any[]>([]);

  function handleSearch(value: number, opt: any) {
    console.log(value, opt);
    curUser.current = curList.current.find((item) => item.id == value);
    console.log(curUser.current);
  }
  const searchUser = async (param: string) => {
    const res = await serviceUser.list({ search: param });
    curList.current = res.data;
    return res.data.map((item: any) => {
      return {
        ...item,
        id: item.id,
        name: item.realName + item.phone,
      };
    });
  };

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
        rowKey="id"
      />
      <FormModal ref={formModal}>
        <Form.Item name="userId" label="归还人">
          <SearchSelect request={searchUser} onChange={handleSearch} />
        </Form.Item>
      </FormModal>
    </>
  );
};
export default MessageLog;
