import serviceGoodsManage from '@/services/goodsManage';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Cascader, Form, Select } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { listByReginon } from '../service/goodsInfo';
import styles from './breakageForm.less';

interface BreakageFormProps {
  value?: Store;
  visible: boolean;
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
  addressTree: DataNode[];
}

const BreakageForm: FC<BreakageFormProps> = ({
  value = {},
  visible,
  onFinish,
  onClose,
  addressTree,
}) => {
  const [manageType, getDict] = useModel('dict', (state) => [state.dict.manageType, state.getDict]);
  const formRef = useRef<FormInstance>();
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [type, setType] = useState('');

  const [breakType, setBreakType] = useState<any>({});
  useEffect(() => {
    if (!manageType) {
      getDict('manageType');
    }
  }, []);

  useEffect(() => {
    if (manageType) {
      const map = new Map();
      manageType.map((item) => {
        map.set(item.id, item.name);
      }),
        setBreakType(map);
    }
  }, [manageType]);
  useEffect(() => {
    console.log(value);
    if (value && value.goodsList) {
      setType('lockGoods');
    }
  }, [value]);

  async function handleFinish(data: Store) {
    if (value) {
      data.goodsList = value.goodsList.map((item: any) => ({ id: item.id }));
    }
    try {
      await serviceGoodsManage.onAddEdit(data);
      onFinish(data);
    } catch (e) {}
    return;
  }

  useEffect(() => {
    if (!visible) {
      formRef.current?.resetFields();
      setType('');
    }
  }, [visible]);

  async function handleChooseAddress(value: any, option?: any[]) {
    console.log(value, option);
    formRef.current?.setFieldsValue({ goodsId: '' });
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
      title={'新增报损'}
      formRef={formRef}
      layout="horizontal"
      modalProps={{
        width: 600,
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          formRef.current?.resetFields();
          onClose();
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
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

      {type === 'lockGoods' && value.goodsList && (
        <>
          {value.goodsList.map((item: any, idx: any) => (
            <div className="ant-row ant-form-item" key={item.id}>
              <div className="ant-col ant-col-6 ant-form-item-label">
                {idx == 0 ? '物资名称' : ''}
              </div>
              <div className="ant-col ant-col-18 ant-form-item-control">
                <div className="ant-form-item-control-input">{item.goods + item.specs}</div>
              </div>
            </div>
          ))}
        </>
      )}
      <ProFormSelect
        name="damageType"
        valueEnum={breakType}
        label="报损状态"
        required
        placeholder="请选择"
      />
    </ModalForm>
  );
};
export default BreakageForm;
