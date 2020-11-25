import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Store } from 'antd/es/form/interface';
import { useForm } from 'antd/lib/form/Form';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { warehouseOnAddEdit } from '../../service';
import { getOrgData } from '../../tools';
//import styles from './AddEdit.less'

interface AddEditProps {
  initialValues?: Store;
  visible: boolean;
  onFinish: (data: Store) => Promise<boolean | void> | boolean | void;
  onClose: () => void;
}

const AddEditWarehouse: FC<AddEditProps> = ({ initialValues, visible, onFinish, onClose }) => {
  const [title, setTitle] = useState('新增库房');
  const warehouse = useModel('warehouse', (state) => state.warehouse);
  const [org, setOrg] = useState<{ label: string; value: string }[]>([]);
  const [form] = useForm();

  useEffect(() => {
    const list = getOrgData(warehouse);
    const org = list.map((item) => ({
      label: item.mergerName,
      value: item.id,
    }));
    setOrg(org);
  }, [warehouse]);
  useEffect(() => {
    if (initialValues && initialValues.id) {
      setTitle('修改库房');
    } else {
      setTitle('新增库房');
    }
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);
  async function handleFinish(data: Store) {
    try {
      const res = await warehouseOnAddEdit({ ...initialValues, ...data });
      console.log(res);
      onFinish(data);
    } catch (error) {}
  }
  return (
    <ModalForm
      title={title}
      layout="horizontal"
      form={form}
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
      // initialValues={initialValues}
      onFinish={handleFinish}
    >
      <ProFormSelect
        options={org}
        rules={[
          {
            required: true,
            message: '请选择组织',
          },
        ]}
        name="orgNo"
        label="组织"
      />

      <ProFormText name="regionName" label="分区名称" placeholder="请输入分区名称" />
      <ProFormText
        name="shortName"
        rules={[
          {
            required: true,
            message: '请输入名称',
          },
        ]}
        label="简称"
        placeholder="请输入名称"
      />
      <ProFormText
        name="num"
        rules={[
          {
            required: true,
            message: '请输入编号',
          },
        ]}
        label="编号"
        placeholder="请输入编号"
      />
      <ProFormText
        name="address"
        rules={[
          {
            required: true,
            message: '请输入地址',
          },
        ]}
        label="地址"
        placeholder="请输入地址"
      />
    </ModalForm>
  );
};
export default AddEditWarehouse;
