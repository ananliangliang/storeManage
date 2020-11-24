import serviceGoodsModel from '@/services/goodsModel';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { FC } from 'react';
//import styles from './ earlyWarning.less'

interface EarlyWarningProps {}

const EarlyWarning: FC<EarlyWarningProps> = (props) => {
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      hideInForm: true,
      search: false,
    },
    {
      title: '资产编号',
      hideInForm: true,
    },
    {
      title: '种类信息',
      hideInForm: true,
    },
    {
      title: '物资名称',
      hideInForm: true,
    },
    {
      title: '位置',
      hideInForm: true,
      search: false,
    },
    {
      title: '预警状态',
      hideInForm: true,
    },
    {
      title: '预警时间',
      hideInForm: true,
    },
    {
      title: '状态',
      hideInForm: true,
      search: false,
    },
    {
      title: '备注',
      hideInForm: true,
      search: false,
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
        request={serviceGoodsModel.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button type="primary" key="add" onClick={() => {}}>
              <PlusOutlined /> 新增预警
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};
export default EarlyWarning;
