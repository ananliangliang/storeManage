import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Cascader, Form } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect } from 'react';
import { goodOnAddEdit } from '../service/goodsInfo';

interface EarlyWarningFormProps {
  value: Store;
  visible: boolean;
  onFinish: (data?: Store) => Promise<void | boolean> | void | boolean;
  addressTree: DataNode[];
}

const EditGoodsInfoForm: FC<EarlyWarningFormProps> = ({
  value,
  visible,
  onFinish,
  addressTree,
}) => {
  const [form] = useForm();

  async function handleFinish(data: Store) {
    console.log(data);
    data.id = value.id;
    data.hlId = data.address[data.address.length - 1];
    await goodOnAddEdit(data);
    onFinish(data);
  }
  useEffect(() => {
    console.log(value);
    form.setFieldsValue({
      name: value.name,
      // address:
    });
  }, [value]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);
  return (
    <ModalForm
      title={'修改物资'}
      form={form}
      layout="horizontal"
      modalProps={{
        width: 680,
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          form.resetFields();
          onFinish();
        }
      }}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProFormText label="物资名称" name="name" />
      <Form.Item name="address" label="物资位置">
        <Cascader options={addressTree} />
      </Form.Item>
    </ModalForm>
  );
};
export default EditGoodsInfoForm;
