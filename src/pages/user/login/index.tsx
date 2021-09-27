import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import logo from '@/assets/image/logo.png';
import serviceAdmin from '@/services/admin';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */

const goto = () => {
  const { query } = history.location;
  const { redirect } = query as {
    redirect: string;
  };
  console.log(redirect);
  // history.replace(redirect || '/');
  window.location.href = redirect || '/';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const intl = useIntl();

  const { user, signin } = useModel('user', (model) => ({
    user: model.user,
    signin: model.signin,
  }));
  console.log(user);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      const res = await serviceAdmin.login(values);
      signin(res);
      goto();
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logo} />
      <div className={styles.main}>
        <ProForm
          initialValues={{
            autoLogin: true,
          }}
          layout="horizontal"
          submitter={{
            render: (_, dom) => dom.pop(),
            searchConfig: {
              submitText: '登录',
            },
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              className: styles.submit,
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            handleSubmit(values);
          }}
        >
          {status === 'error' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误（admin/ant.design)',
              })}
            />
          )}
          <ProFormText
            name="userName"
            fieldProps={{
              size: 'large',
              prefix: (
                <label>
                  <UserOutlined className={styles.prefixIcon} /> 用户名
                </label>
              ),
            }}
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="passWord"
            fieldProps={{
              size: 'large',
              prefix: (
                <label>
                  <LockOutlined className={styles.prefixIcon} /> 密码
                </label>
              ),
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
        </ProForm>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
