import { ModalForm, ProFormCheckbox, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { useForm } from 'antd/es/form/Form';
import { Store } from 'antd/es/form/interface';
import { Form, Image } from 'antd';
import React, { FC, useEffect } from 'react';
import { post } from '@/utils/request';
//import styles from './userAuth.less'

interface UserAuthProps {
  onFinish: (flag: any) => void;
  visible: boolean;
  user: any;
  isDetail?: boolean;
}

const UserAuth: FC<UserAuthProps> = ({ onFinish, visible, user = {}, isDetail }) => {
  const [form] = useForm();
  async function handleFinish(data: Store) {
    console.log(data);
    if (!isDetail) {
      await post(
        '/auth/AuthPass',
        {
          uid: user.id,
          ...data,
        },
        true,
      );
    }
    onFinish(data);
  }
  useEffect(() => {
    form.setFieldsValue({
      idcard: user.idcard,
    });
  }, [user]);
  return (
    <ModalForm
      title="身份认证"
      form={form}
      layout="horizontal"
      modalProps={{
        width: 600,
      }}
      initialValues={{
        auth: 1,
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          form.resetFields();
          onFinish(false);
        }
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onFinish={handleFinish}
    >
      <Form.Item label="身份证">
        <Image width="300" src={user.idcardUrl} />
      </Form.Item>
      <Form.Item label="姓名">{user.realName}</Form.Item>
      <ProFormText label="身份证号" name="idcard" disabled={isDetail} />
      {!isDetail && (
        <ProFormRadio.Group
          label="评审结果"
          name="auth"
          options={[
            {
              value: '1',
              label: '通过',
            },
            {
              value: '0',
              label: '驳回',
            },
          ]}
        />
      )}
    </ModalForm>
  );
};
export default UserAuth;
