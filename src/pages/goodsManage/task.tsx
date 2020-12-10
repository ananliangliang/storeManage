import PowerBotton from '@/components/PowerBotton';
import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';
import serviceGoodsPreliminary from '@/services/goodsPreliminary';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Divider, Popconfirm, Button, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import React, { FC, useRef, useState } from 'react';
import TaskForm from './components/taskForm';
//import styles from './task.less'

interface TaskProps {}

const Task: FC<TaskProps> = (props) => {
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    value: Store;
  }>({
    visible: false,
    value: {},
  });

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      hideInForm: true,
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render(_, record) {
        return record.createTime;
      },
    },
    {
      title: '物资信息',
      dataIndex: 'modelsName',
      hideInForm: true,
      search: false,
    },
    {
      title: '操作',
      hideInForm: true,
      valueType: 'option',
      render(_, record) {
        return (
          <>
            <PowerBotton
              type="link"
              showDivider
              allowStr="edit"
              onClick={() => {
                setModalProp({
                  visible: true,
                  value: { ...record },
                });
              }}
            >
              编辑
            </PowerBotton>
            <PopconfirmPowerBtn
              type="link"
              allowStr="del"
              title="确认删除?"
              onConfirm={() => {
                handleDel(record.id);
              }}
            >
              删除
            </PopconfirmPowerBtn>
          </>
        );
      },
    },
  ];

  async function handleDel(id: string | string[]) {
    console.log(id);
    if (typeof id === 'object') {
      await serviceGoodsPreliminary.batchRemove(id.join(','));
    } else {
      await serviceGoodsPreliminary.remove(id);
    }
    actionRef.current?.reload();
  }
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={serviceGoodsPreliminary.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton
              type="primary"
              allowStr="add"
              key="add"
              onClick={() => {
                setModalProp({ visible: true, value: {} });
              }}
            >
              <PlusOutlined /> 新增任务
            </PowerBotton>,
            <PowerBotton
              allowStr="del"
              key="del"
              type="dashed"
              onClick={() => {
                if (selectedRowKeys && selectedRowKeys.length > 0) {
                  Modal.confirm({
                    content: `是否删除该${selectedRowKeys.length}`,
                    async onOk() {
                      await handleDel(selectedRowKeys as string[]);
                    },
                  });
                }
              }}
            >
              <DeleteOutlined /> 删除
            </PowerBotton>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
      <TaskForm
        {...modalProp}
        onFinish={(val) => {
          if (val) {
            actionRef.current?.reload();
          }
          setModalProp({ visible: false, value: {} });
        }}
      />
    </div>
  );
};
export default Task;
