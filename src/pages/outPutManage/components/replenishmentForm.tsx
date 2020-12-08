import SearchSelect from '@/components/FormComponents/searchSelect';
import { listByReginon } from '@/pages/goodsManage/service/goodsInfo';
import serviceGoodsRule from '@/services/goodsRule';
import serviceReceive from '@/services/receive';
import serviceUser from '@/services/user';
import { subEffect } from '@/utils/tools';
import { ModalForm, ProFormDatePicker, ProFormDigit } from '@ant-design/pro-form';
import { Cascader, Form, Select } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useState } from 'react';

interface ReplenishmentFormProps {
  visible: boolean;
  onFinish: (data: any) => Promise<void | boolean> | void | boolean;
  addressTree: DataNode[];
}

const ReplenishmentForm: FC<ReplenishmentFormProps> = ({ visible, onFinish, addressTree }) => {
  const [form] = useForm();
  const [goodsList, setGoodsList] = useState<any[]>([]);

  async function handleFinish(data: Store) {
    console.log(data);
    await subEffect(
      async () => {
        await serviceReceive.onAddEdit({
          type: 2,
          state: 2,
          accessList: [
            {
              count: data.count,
              goods: {
                id: data.goodsId,
              },
            },
          ],
        });
        onFinish(data);
      },
      '正在提交',
      '提交成功',
    );
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
      initialValues={{
        time: new Date(),
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          form.resetFields();
          onFinish(false);
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
      {/* <Form.Item name="user" label="入库人">
        <SearchSelect request={searchUser} />
      </Form.Item>
      <ProFormDatePicker label="入库时间" name="time" /> */}
      <Form.Item name="address" label="物资位置">
        <Cascader onChange={handleChooseAddress} options={addressTree} />
      </Form.Item>
      <Form.Item name="goodsId" label="物资名称" required>
        <Select options={goodsList} />
      </Form.Item>
      <ProFormDigit
        name="count"
        label="补货数量"
        fieldProps={{
          precision: 0,
        }}
      />
    </ModalForm>
  );
};
export default ReplenishmentForm;

const searchUser = async (param: string) => {
  const res = await serviceUser.list({ realName: param });
  return res.data.map((item: any) => {
    return {
      id: item.id,
      name: item.realName + item.phone,
    };
  });
};
