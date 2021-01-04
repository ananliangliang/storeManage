import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceGoodsModel from '@/services/goodsModel';
import serviceGoodsPreliminary from '@/services/goodsPreliminary';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { Button, Form, Input, InputNumber, Space, Spin } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useRequest } from 'umi';
import styles from './taskForm.less';

interface TaskFormProps {
  visible: boolean;
  onFinish: (data?: any) => void;
  value: Store;
}

const TaskForm: FC<TaskFormProps> = ({ visible, onFinish, value }) => {
  const formRef = useRef<FormInstance>();
  const [title, setTitle] = useState('新增任务');
  const [defopt, setDefOpt] = useState<{ id: string; name: string }[][]>([]);
  const { loading, run } = useRequest(serviceGoodsPreliminary.get, {
    manual: true,
    onSuccess(res) {
      const opt: any = [];
      res.models.map((item: any) => {
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
        models: res.models,
      });
    },
  });

  useEffect(() => {
    if (value.id) {
      setTitle('修改任务');
      run(value.id);
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
      // {...DEFAULT_FORM_LAYOUT}
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
        // data.models = data.models.map((item: any) => ({
        //   id: item.id,

        // }));
        await serviceGoodsPreliminary.onAddEdit(data);
        onFinish(data);
      }}
    >
      <Spin spinning={loading}>
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
                <Space
                  key={field.key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    className={styles.select}
                    label="物资种类"
                    name={[field.name, 'id']}
                    fieldKey={[field.fieldKey, 'id']}
                  >
                    <SearchSelect
                      className={styles.inline}
                      placeholder="请搜索物资类型"
                      defaultOpt={defopt[index]}
                      request={sourceRequest}
                    />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="数量"
                    name={[field.name, 'preliminaryCount']}
                    fieldKey={[field.fieldKey, 'preliminaryCount']}
                  >
                    <InputNumber placeholder="请输入数量" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="组合名称"
                    name={[field.name, 'preliminarySet']}
                    fieldKey={[field.fieldKey, 'preliminarySet']}
                  >
                    <Input placeholder="组合名称" />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className={styles.del}
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Space>
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
      </Spin>
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
