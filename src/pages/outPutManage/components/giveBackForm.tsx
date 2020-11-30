import { listByReginon } from '@/pages/goodsManage/service/goodsInfo';
import serviceGoodsRule from '@/services/goodsRule';
import { ModalForm, ProFormDigit } from '@ant-design/pro-form';
import { Cascader, Form, Select } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useState } from 'react';

interface GiveBackFormProps {
  value?: Store;
  visible: boolean;
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
  addressTree: DataNode[];
}

const GiveBackForm: FC<GiveBackFormProps> = ({
  value,
  visible,
  onFinish,
  onClose,
  addressTree,
}) => {
  const [form] = useForm();
  const [goodsList, setGoodsList] = useState<any[]>([]);

  async function handleFinish(data: Store) {
    console.log(data);
    await serviceGoodsRule.onAddEdit(data);
    onFinish(data);
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  async function handleChooseAddress(value: any, option?: any[]) {
    console.log(value, option);
    form.setFieldsValue({ goodsId: '' });
    if (option && option.length > 0) {
      const last = option[option.length - 1];
      const res = await listByReginon({
        flg: last.flg,
        id: last.id,
        pageNum: 20,
      });

      setGoodsList(
        res.data.map((item: any) => ({
          label: item.goods + item.specs,
          value: item.id,
        })),
      );
    }
  }
  return (
    <ModalForm
      title="补货表单"
      form={form}
      layout="horizontal"
      modalProps={{
        width: 600,
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          form.resetFields();
          onClose();
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
      <Form.Item name="address" label="物资位置">
        <Cascader onChange={handleChooseAddress} options={addressTree} />
      </Form.Item>
      <Form.Item name="goodsId" label="物资名称" required>
        <Select options={goodsList} />
      </Form.Item>
      <ProFormDigit
        name="count"
        label="入库数量"
        fieldProps={{
          precision: 0,
        }}
      />
    </ModalForm>
  );
};
export default GiveBackForm;
