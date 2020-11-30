import { keyFindChild } from '@/models/warehouse';
import ProForm, {
  DrawerForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Store } from 'antd/es/form/interface';
import React, { FC, useEffect, useRef, useState } from 'react';
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
  const [warehouse, pos, keyFindParent] = useModel('warehouse', (state) => [
    state.warehouse,
    state.pos,
    state.keyFindParent,
  ]);
  const [part, setPart] = useState<any>();
  const [form] = useForm();

  useEffect(() => {
    if (warehouse && pos.partition) {
      const res = keyFindChild(warehouse, pos.partition);
      console.log(res);

      setPart(res);
    }
  }, [warehouse]);

  useEffect(() => {
    if (initialValues && initialValues.id) {
      setTitle('修改货架');
    } else {
      setTitle('新增货架');
    }
    console.warn(initialValues);
    if (form) {
      let hlDetail: any = [];
      if (initialValues?.hlDetail) {
        for (const key in initialValues.hlDetail) {
          if (Object.prototype.hasOwnProperty.call(initialValues.hlDetail, key)) {
            const element = initialValues.hlDetail[key];
            hlDetail.push(element);
          }
        }
      }
      form.setFieldsValue({ ...initialValues, hlDetail });
    }
  }, [initialValues]);

  const warehouseId = useRef();
  function handleChangePrt(value: number, opt: any) {
    const res = keyFindParent(opt.key, 'warehouse');
    warehouseId.current = res['id'];
    console.log(res);
  }

  async function handleFinish(data: Store) {
    try {
      let temp = {};
      data.hlDetail.map((item: any, idx: number) => {
        temp[idx + 1] = item;
      });
      data.level = 4;
      data.hlDetail = temp;
      if (!initialValues?.warehouseId) data.warehouseId = warehouseId.current;
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
    const lines = form.getFieldValue('hlDetail') || [];
    console.log(lines);
    let value = [];
    if (lines.length > v) {
      value = lines.slice(0, v);
    } else {
      value = [...lines, ...new Array(v - lines.length).map((item) => ({}))];
    }

    form.setFieldsValue({ hlDetail: value });
  }
  return (
    <DrawerForm
      title={title}
      form={form}
      layout="horizontal"
      labelAlign="left"
      initialValues={{
        shortName: 'A面',
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) onClose();
      }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProForm.Group>
        <ProFormSelect
          options={part}
          fieldProps={{
            onChange: handleChangePrt,
          }}
          name="orgNo"
          label="分区"
        />
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
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="m" required placeholder="请输入编号" name="regionName" label="名称" />
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
        <ProFormDigit
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
            precision: 0,
          }}
          placeholder="请输入编号"
        />
        <ProFormRadio.Group
          name="sort"
          label="方向"
          width="s"
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

      <Form.List name="hlDetail">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <ProForm.Group>
                <ProFormDigit
                  name={[field.name, 'count']}
                  rules={[
                    {
                      required: true,
                      message: '请输入编号',
                    },
                  ]}
                  width="m"
                  label="列数"
                  fieldProps={{ precision: 0 }}
                  placeholder="请输入编号"
                />
                <ProFormRadio.Group
                  name={[field.name, 'sort']}
                  label="方向"
                  width="s"
                  options={[
                    {
                      label: '从左到右',
                      value: '1',
                    },
                    {
                      label: '从右到左',
                      value: '2',
                    },
                  ]}
                />
              </ProForm.Group>
            ))}
          </>
        )}
      </Form.List>
    </DrawerForm>
  );
};
export default AddEditGoods;
