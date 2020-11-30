import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceGoodsModel from '@/services/goodsModel';
import serviceGoodsRule from '@/services/goodsRule';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Cascader, Form, Select } from 'antd';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { listByReginon } from '../service/goodsInfo';
//import styles from './earlyWarningForm.less'
import Field from '@ant-design/pro-field';

interface EarlyWarningFormProps {
  value?: Store;
  visible: boolean;
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
  ruleList: any[];
  addressTree: DataNode[];
}

const EarlyWarningForm: FC<EarlyWarningFormProps> = ({
  value,
  visible,
  onFinish,
  ruleList,
  onClose,
  addressTree,
}) => {
  const [form] = useForm();
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [type, setType] = useState('');

  const rule = useMemo(() => {
    return ruleList.map((item) => ({
      label: item.rule,
      value: item.id,
    }));
  }, [ruleList]);

  useEffect(() => {
    console.log(value);
    if (value && value.id) {
      setType('lockGoods');
    }
  }, [value]);

  async function handleFinish(data: Store) {
    console.log(data);
    await serviceGoodsRule.onAddEdit(data);
    onFinish(data);
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setType('');
    }
  }, [visible]);

  function handleCheckType(e: any) {
    console.log(e);
    const { value } = e.target;

    setType(value);
    return value;
  }

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
      title={'新增预警'}
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
      {type != 'lockGoods' && (
        <ProFormRadio.Group
          label="预警类型"
          name="type"
          getValueFromEvent={handleCheckType}
          options={[
            {
              label: '种类',
              value: '0',
            },
            {
              label: '物品',
              value: '1',
            },
          ]}
        />
      )}
      {type === '0' && (
        <>
          <Form.Item name="goodsId" label="物资名称" required>
            <SearchSelect request={sourceRequest} />
          </Form.Item>
        </>
      )}

      {type === '1' && (
        <>
          <Form.Item name="address" label="物资位置">
            <Cascader onChange={handleChooseAddress} options={addressTree} />
          </Form.Item>
          <Form.Item name="goodsId" label="物资名称" required>
            <Select options={goodsList} />
          </Form.Item>
        </>
      )}

      {type === 'lockGoods' && value && (
        <Form.Item label="物资名称">{value.goods + value.specs}</Form.Item>
      )}

      {type !== '' && (
        <>
          <ProFormSelect
            name="ruleId"
            label="预警规则"
            required
            options={rule}
            placeholder="请选择规则"
          />
          <ProFormDatePicker
            label="起始时间"
            required
            name="endCheckTime"
            placeholder="请选择时间"
          />
        </>
      )}
    </ModalForm>
  );
};
export default EarlyWarningForm;

const sourceRequest = async (param: string) => {
  const res = await serviceGoodsModel.list({ name: param });

  return res.data.map((item: any) => {
    return {
      id: item.id,
      name: item.goods + ' ' + item.specs,
    };
  });
};
