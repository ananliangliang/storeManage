import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Cascader, Form } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect } from 'react';
import { useModel } from 'umi';
import { goodOnAddEdit } from '../service/goodsInfo';

interface EarlyWarningFormProps {
  value: Store;
  visible: boolean;
  onFinish: (data?: Store, ret?: any) => Promise<void | boolean> | void | boolean;
  addressTree: DataNode[];
}

const EditGoodsInfoForm: FC<EarlyWarningFormProps> = ({
  value,
  visible,
  onFinish,
  addressTree,
}) => {
  const [form] = useForm();
  const warehouse = useModel('warehouse', (state) => state.warehouse);

  async function handleFinish(data: Store) {
    console.log(data);
    data.id = value.id;

    data.hlId = data.address[data.address.length - 1];
    const result = await goodOnAddEdit(data);
    onFinish(data, result);
  }
  useEffect(() => {
    console.log(value, warehouse);
    let address: any[] = [];
    if (value.hlId) {
      address = getGoodsAddressIdLink(addressTree, value.hlId);
      console.log(address);
    }
    form.setFieldsValue({
      name: value.name,
      address,
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

export function getGoodsAddressIdLink(
  list: DataNode[],
  id: string,
  idLink: string[] = [],
): string[] {
  const tempLink = idLink.slice();
  tempLink.push('');
  const idx = tempLink.length - 1;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item['value'] == id) {
      tempLink[idx] = id;
      return tempLink;
    } else if (item.children && item.children.length > 0) {
      tempLink[idx] = item['value'];
      const newList = getGoodsAddressIdLink(item.children, id, tempLink);
      if (newList[newList.length - 1] == id) {
        return newList;
      }
    }
  }
  return tempLink;
}
