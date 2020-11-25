import ProForm, {
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useForm } from 'antd/es/form/Form';
import { Store } from 'antd/es/form/interface';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { regionOnAddEdit } from '../../service';
//import styles from './AddEditPlace.less'

interface AddEditPlaceProps {
  initialValues?: Store;
  visible: boolean;
  orgNo?: { label: string; value: string }[];
  onFinish: (data: Store) => Promise<void | boolean> | void | boolean;
  onClose: () => void;
}

const AddEditGoods: FC<AddEditPlaceProps> = ({
  initialValues,
  orgNo,
  visible,
  onFinish,
  onClose,
}) => {
  const [title, setTitle] = useState('新增货架');
  const warehouse = useModel('warehouse', (state) => state);
  const [child, setChild] = useState<any[]>([]);
  const [form] = useForm();
  useEffect(() => {
    if (initialValues && initialValues.id) {
      setTitle('修改货架');
    } else {
      setTitle('新增货架');
    }
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);
  async function handleFinish(data: Store) {
    try {
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

  function handleLine(e: React.FocusEvent<HTMLInputElement>) {
    console.log(e.target.value);
    const v = Number(e.target.value);
    setChild((e) => {
      if (e.length > v) {
        return e.slice(0, v);
      } else {
        return [...e, ...new Array(v - e.length).map((item) => ({}))];
      }
    });
  }
  return (
    <DrawerForm
      title={title}
      form={form}
      initialValues={{
        shortName: 'A面',
      }}
      onVisibleChange={(e) => {
        e === false ?? onClose();
      }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProForm.Group>
        <ProFormSelect options={orgNo} width="s" name="orgNo" label="分区" />
        <ProFormText
          name="num"
          rules={[
            {
              required: true,
              message: '请输入编号',
            },
          ]}
          width="s"
          label="编号"
          placeholder="请输入编号"
        />
        <ProFormRadio.Group
          name="shortName"
          label="AB面"
          width="s"
          options={[
            {
              label: 'A面',
              value: 'A面',
            },
            {
              label: 'B面',
              value: 'B面',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="reserved"
          rules={[
            {
              required: true,
              message: '请输入编号',
            },
          ]}
          width="m"
          label="行数"
          fieldProps={{
            onBlur: handleLine,
          }}
          placeholder="请输入编号"
        />
        <ProFormRadio.Group
          name="sort"
          label="方向"
          width="m"
          options={[
            {
              label: '从上到下',
              value: '1',
            },
            {
              label: '从下到上',
              value: '2',
            },
          ]}
        />
      </ProForm.Group>
      {/* <Form.List
        name="names"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 passengers'));
              }
            },
          },
        ]}
      >
{(fields, { add, remove }, { errors }) => (
  <>
  {fields.map((field, index) => (

  )}
  </>
)}
      </Form.List> */}
    </DrawerForm>
  );
};
export default AddEditGoods;
