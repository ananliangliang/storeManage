import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import React, { FC } from 'react';
import serviceGoodsModel from '../../services/goodsModel';
//import styles from './ earlyWarning.less'

interface EarlyWarningProps {}

const EarlyWarning: FC<EarlyWarningProps> = (props) => {
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '资产编号',
      dataIndex: 'goodsId',
      hideInForm: true,
    },
    {
      title: '种类信息',
      dataIndex: 'type',
      hideInForm: true,
    },
    {
      title: '物资名称',
      dataIndex: 'goods',
      ellipsis: true,
      hideInForm: true,
      render(_, record) {
        return record.goods + record.specs;
      },
    },
    {
      title: '位置',
      hideInForm: true,
      ellipsis: true,
      render(_, record) {
        return record.kf + record.lc + record.fq + record.hj + record.hl;
      },
      search: false,
    },
    {
      title: '预警状态',
      dataIndex: 'rule',
      hideInForm: true,
    },
    {
      title: '预警时间',
      dataIndex: 'endCheckTime',
      hideInForm: true,
    },
    {
      title: '状态',
      hideInForm: true,
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
