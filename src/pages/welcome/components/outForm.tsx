import serviceReceive from '@/services/receive';
import { ModalForm } from '@ant-design/pro-form';
import { Form, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
// import styles from './taskForm.less';

interface OutFormProps {
  visible: boolean;
  goods?: any[];
  onFinish: (data?: any) => void;
}

const OutForm: FC<OutFormProps> = ({ visible, onFinish, goods = [] }) => {
  const [formList, setFormList] = useState<
    {
      name: string;
      label: string;
      max: number;
      type: number;
      id: number;
    }[]
  >([]);

  useEffect(() => {
    console.log(goods);
    setFormList(
      goods.map((item) => ({
        name: item.id,
        label: item.name,
        max: item.count,
        type: item.type,
        id: item.id,
      })),
    );
  }, [goods]);
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (!visible) {
      formRef.current?.resetFields();
    }
  }, [visible]);

  return (
    <ModalForm
      title="出库订单信息"
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 8 }}
      initialValues={{
        flag: ['1', '2'],
      }}
      modalProps={{
        width: 600,
      }}
      wrapperCol={{ span: 16 }}
      visible={visible}
      onVisibleChange={(visible) => {
        if (!visible) {
          onFinish();
        }
      }}
      onFinish={async (values) => {
        console.log(values);
        const val = formRef.current?.getFieldsValue();
        const goodsList: { id: number; count: number }[] = [];
        for (const key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) {
            const element = val[key];
            goodsList.push({
              id: Number(key),
              count: element ?? 1,
            });
          }
        }
        try {
          await serviceReceive.plGoodsOut(goodsList);
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      {formList.map((item) => (
        <Form.Item label={item.label} required>
          <Form.Item name={item.name} noStyle>
            {item.type != 1 ? <InputNumber precision={0} max={item.max} /> : '1'}
          </Form.Item>
          {item.type != 1 && <span>{item.max > -1 && `当前库存 ${item.max}`}</span>}
        </Form.Item>
      ))}
    </ModalForm>
  );
};

export default OutForm;
