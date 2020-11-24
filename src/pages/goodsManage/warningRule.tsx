import serviceGoodsRule from '@/services/goodsRule';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Divider, Modal, Popconfirm } from 'antd';
import React, { FC } from 'react';
//import styles from './warningRule.less'

interface WarningRuleProps {}

const WarningRule: FC<WarningRuleProps> = (props) => {
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      hideInForm: true,
      search: false,
    },
    {
      title: '规则名称',
      hideInForm: true,
    },
    {
      title: '周期',
      hideInForm: true,
    },
    {
      title: '规则状态',
      hideInForm: true,
    },
    {
      title: '操作',
      hideInForm: true,
      valueType: 'option',
      render(_, record) {
        return (
          <>
            <a
              onClick={() => {
                setModalProp({
                  visible: true,
                  initialValues: {
                    warehouseId: record['warehouseId'],
                    parentId: record['id'],
                  },
                  type: 'goods',
                });
              }}
            >
              查看
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setModalProp({
                  visible: true,
                  initialValues: { ...record },
                  type: 'partition',
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                handleDel(record.id);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        request={serviceGoodsRule.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button type="primary" key="add" onClick={() => {}}>
              <PlusOutlined /> 新增预警
            </Button>,
            <Button
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
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};
export default WarningRule;
