import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  ForwardRefRenderFunction,
} from 'react';
import { Modal, Form } from 'antd';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance, useForm } from 'antd/lib/form/Form';
//import styles from './ScheduPlanModal.less'

interface FormModalProps {
  children?: React.ReactNode;
}

export interface FormModalRef {
  show: (param: { title: string; onSubmit: (data: any) => Promise<void> | void }) => void;
  close: () => void;
  update: (date: any) => void;
  form: FormInstance;
}
const FormModal: ForwardRefRenderFunction<FormModalRef, FormModalProps> = (props, ref) => {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const onsubmit = useRef<(data: any) => void>();
  useImperativeHandle(ref, () => ({
    show: ({ title, onSubmit }) => {
      if (!visible) setVisible(true);
      setTitle(title);
      onsubmit.current = onSubmit;
    },
    close: onClose,
    update: (data: any) => {
      if (!visible) setVisible(true);
      form.setFieldsValue(data);
      console.log(form.getFieldsValue());
    },
    form,
  }));
  const onFinish = async () => {
    try {
      // const res = await form.validateFields()
      onsubmit.current && (await onsubmit.current(form.getFieldsValue()));
      onClose();
    } catch (error) {
      console.log(error);
      // message.error(error);
    }
  };
  const onClose = () => {
    if (visible) setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText="确定"
      getContainer={false}
      cancelText="取消"
      onCancel={onClose}
      onOk={onFinish}
    >
      <Form {...DEFAULT_FORM_LAYOUT} name="modal" form={form} onFinish={onFinish}>
        {props.children}
      </Form>
    </Modal>
  );
};
export default forwardRef(FormModal);
