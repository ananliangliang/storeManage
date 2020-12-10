import PowerBotton from '@/components/PowerBotton';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { dict2select } from '@/models/dict';
import serviceGoodsManageGoods from '@/services/goodsManageGoods';
import serviceGoodsManageHandled from '@/services/goodsManageHandled';
import { subEffect } from '@/utils/tools';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
//import styles from './warningRule.less'

interface WarningRuleProps {}
const statusEnum = new Map([
  [1, '未处理'],
  [0, '已处理'],
]);
const ColText = (props: any) => {
  return <div>{props.value} </div>;
};
const Breakage: FC<WarningRuleProps> = (props) => {
  const [manageType, handleType, getDict] = useModel('dict', (state) => [
    state.dict.manageType,
    state.dict.handleType,
    state.getDict,
  ]);
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
  }>({
    visible: false,
    values: {},
  });
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    if (!manageType) {
      getDict('manageType');
    }
    if (!handleType) {
      getDict('handleType');
    }
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'manageId',
      hideInForm: true,
      hideInTable: true,
      search: false,
    },
    {
      title: '报错人员',
      dataIndex: 'userName',
      hideInForm: true,
    },
    {
      title: '发现时间',
      dataIndex: 'report_time',
      valueType: 'dateRange',
      hideInForm: true,
      render(_, record) {
        return record.report_time;
      },
    },
    {
      title: '损坏类型',
      dataIndex: 'damage_type',
      valueType: 'select',
      hideInForm: true,
      valueEnum: dict2select(manageType),
    },
    {
      title: '物资名称',
      dataIndex: 'name',
      renderFormItem(item, config) {
        return <ColText />;
      },
    },
    {
      title: '库房',
      dataIndex: 'kf',
      hideInForm: true,
      search: false,
    },
    {
      title: '分区',
      dataIndex: 'fq',
      hideInForm: true,
      search: false,
    },
    {
      title: '位置',
      search: false,
      hideInForm: true,
      render(node, record) {
        return record.hj + record.hl;
      },
    },
    {
      title: '是否处理',
      dataIndex: 'is_handled',
      hideInForm: true,
      valueEnum: statusEnum,
      render(node, record) {
        return record.is_handled == 1 ? (
          '已处理'
        ) : (
          <PowerBotton allowStr="dispose" type="ghost" onClick={() => handleDispose(record)}>
            立即处理
          </PowerBotton>
        );
      },
    },
    {
      title: '处理方式',
      dataIndex: 'handledType',
      hideInTable: true,
      formItemProps: {
        required: true,
      },
      valueEnum: dict2select(handleType),
    },
    {
      title: '处理时间',
      dataIndex: 'handled_time',
      valueType: 'date',
    },
    {
      title: '处理人',
      dataIndex: 'handleUserName',
      hideInForm: true,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      valueType: 'textarea',
    },
  ];

  function handleDispose(record: any) {
    setModalProp({ visible: true, values: { ...record } });
    setTimeout(() => {
      formRef.current?.setFieldsValue({ name: record.name });
    }, 120);
    console.log(record);
  }

  const onClose = () => {
    setModalProp({ visible: false, values: {} });
    formRef.current?.resetFields();
  };
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        // rowSelection={{}}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        request={serviceGoodsManageGoods.list}
        columns={columns}
        rowKey="manageId"
      />

      <Modal
        title="处理方式"
        visible={modalProp.visible}
        onOk={async () => {
          const value = formRef.current?.getFieldsValue();
          const data = { ...modalProp.values, ...value };
          if (!data.type) {
            data.type = 3;
          }
          await subEffect(async () => {
            await serviceGoodsManageHandled.onAddEdit(data);
            onClose();
            actionRef.current?.reload();
          });
          return true;
        }}
        onCancel={onClose}
        getContainer={false}
      >
        <ProTable
          // headerTitle="角色管理"
          form={
            {
              ...DEFAULT_FORM_LAYOUT,
              layout: 'horizontal',
              submitter: false,
            } as any
          }
          columns={columns}
          dateFormatter="string"
          type="form"
          size="middle"
          footer={() => <span />}
          toolBarRender={false}
          formRef={formRef}
        />
      </Modal>
    </div>
  );
};

export default Breakage;
