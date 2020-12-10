import SearchSelect from '@/components/FormComponents/searchSelect';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import serviceGoodsModel from '@/services/goodsModel';
import serviceGoodsPreliminary from '@/services/goodsPreliminary';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './taskForm.less';

interface TaskFormProps {
  visible: boolean;
  onFinish: (data?: any) => void;
  value: Store;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const TaskForm: FC<TaskFormProps> = ({ visible, onFinish, value }) => {
  const formRef = useRef<FormInstance>();
  const [title, setTitle] = useState('新增任务');
  const [defopt, setDefOpt] = useState<{ id: string; name: string }[][]>([]);

  useEffect(() => {
    if (value.id) {
      setTitle('修改任务');
      async function getData(id: string) {
        const res: any = await serviceGoodsPreliminary.get(id);
        const opt: any = [];
        const models: string[] = [];
        res.models.map((item: any) => {
          models.push(item.id);
          opt.push([
            {
              id: item.id,
              name: item.goods + item.specs,
            },
          ]);
        });
        setDefOpt(opt);
        formRef.current?.setFieldsValue({
          name: value.name,
          models,
        });
      }
      getData(value.id);
    } else {
      setTitle('新增任务');
      formRef.current?.setFieldsValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!visible) {
      formRef.current?.resetFields();
    }
  }, [visible]);

  return (
    <DrawerForm
      title={title}
      formRef={formRef}
      layout="horizontal"
      {...DEFAULT_FORM_LAYOUT}
      visible={visible}
      onVisibleChange={(visible) => {
        if (!visible) {
          onFinish();
        }
      }}
      onFinish={async (values) => {
        // 不返回不会关闭弹框
        const data = { ...value, ...values };
        console.log(data);
        data.models = data.models.map((item: any) => ({
          id: item,
        }));
        await serviceGoodsPreliminary.onAddEdit(data);
        onFinish(data);
      }}
    >
      <ProFormText
        name="name"
        label="任务名称"
        labelCol={{
          span: 4,
        }}
        placeholder="请输入名称"
      />
      <Form.List name="models">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '物资类型' : ''}
                required={false}
                key={field.key}
              >
                <Form.Item {...field} noStyle>
                  <SearchSelect
                    className={styles.inline}
                    placeholder="请搜索物资名称"
                    defaultOpt={defopt[index]}
                    request={sourceRequest}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined className={styles.del} onClick={() => remove(field.name)} />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加物资
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </DrawerForm>
  );
};
export default TaskForm;

const sourceRequest = async (param: string) => {
  const res = await serviceGoodsModel.list({ name: param });

  return res.data.map((item: any) => {
    return {
      id: item.id,
      name: item.goods + ' ' + item.specs,
    };
  });
};
