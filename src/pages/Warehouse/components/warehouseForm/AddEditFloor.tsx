import { keyFindChild } from '@/models/warehouse';
import serviceRegion from '@/services/region';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { TypeSelectOptions } from '.';
//import styles from './AddEditPlace.less'

interface AddEditPlaceProps {
  initialValues?: Store;
  visible: boolean;
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
}

const AddEditFloor: FC<AddEditPlaceProps> = ({ initialValues, visible, onFinish, onClose }) => {
  const [title, setTitle] = useState('新增楼层');
  const { warehouse, pos } = useModel('warehouse', (state) => state);
  const [ware, setWare] = useState<TypeSelectOptions>([]);
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
  }, [warehouse]);

  useEffect(() => {
    if (initialValues && initialValues.id) {
      setTitle('修改楼层');
    } else {
      setTitle('新增楼层');
    }
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  async function handleFinish(data: Store) {
    try {
      data.level = 2;
      const res = await serviceRegion.onAddEdit({ ...initialValues, ...data });
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
          form.resetFields();
          onClose();
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProFormSelect options={ware} name="warehouseId" label="所属库房" />
      <ProFormText name="mergerName" label="全名称" placeholder="请输入名称" />
      <ProFormDigit
        name="reserved"
        label="所在层数"
        fieldProps={{ precision: 0 }}
        placeholder="请输入楼层"
      />
      <ProFormText name="regionName" label="楼层名" placeholder="请输入名称" />
    </ModalForm>
  );
};
export default AddEditFloor;
