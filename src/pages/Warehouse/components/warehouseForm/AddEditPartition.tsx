import { keyFindChild } from '@/models/warehouse';

import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { TypeSelectOptions } from '.';
import { regionOnAddEdit } from '../../service';
//import styles from './AddEditPlace.less'

interface AddEditPlaceProps {
  initialValues?: Store;
  visible: boolean;
  orgNo?: { label: string; value: string }[];
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
}

const AddEditPartition: FC<AddEditPlaceProps> = ({
  initialValues,
  orgNo,
  visible,
  onFinish,
  onClose,
}) => {
  const [title, setTitle] = useState('新增分区');
  const { warehouse, pos } = useModel('warehouse', (state) => state);
  const [ware, setWare] = useState<TypeSelectOptions>([]);
  const [floor, setFloor] = useState<TypeSelectOptions>([]);
  const [form] = useForm();

  useEffect(() => {
    if (pos.warehouse) {
      const res = keyFindChild(warehouse, pos.warehouse);
      console.log(res);
      const ware = res.map((item) => ({
        label: item['mergerName'],
        value: item['id'],
      }));
      setWare(ware);
    }
    if (pos.floor) {
      const res = keyFindChild(warehouse, pos.floor);
      console.log(res);
      const floor = res.map((item) => ({
        label: item['mergerName'],
        value: item['id'],
      }));
      setFloor(floor);
    }
  }, [warehouse]);

  useEffect(() => {
    if (initialValues && initialValues.id) {
      setTitle('修改分区');
    } else {
      setTitle('新增分区');
    }
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  async function handleFinish(data: Store) {
    try {
      data.level = 3;
      const res = await regionOnAddEdit({ ...initialValues, ...data });
      console.log(res);
      onFinish(data);
    } catch (error) {}
  }
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);
  return (
    <ModalForm
      title={title}
      form={form}
      layout="horizontal"
      modalProps={{
        width: 600,
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          onClose();
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProFormSelect
        options={ware}
        required
        name="warehouseId"
        label="库房"
        placeholder="请选择楼层"
      />
      <ProFormSelect
        options={floor}
        required
        name="parentId"
        label="楼层"
        placeholder="请选择楼层"
      />
      <ProFormText name="regionName" required label="名称" placeholder="请输入名称" />
    </ModalForm>
  );
};
export default AddEditPartition;
