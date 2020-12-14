import { ModalForm } from '@ant-design/pro-form';
import { useForm } from 'antd/es/form/Form';
import { Store } from 'antd/es/form/interface';
import { Form, TreeSelect } from 'antd';
import React, { FC, useEffect, useMemo } from 'react';
import { treeDataFormate } from '@/utils/tools';
import serviceUser from '@/services/user';
import { FormTree } from '@/components/FormComponents/FormTree';
//import styles from './userAuth.less'

interface UserConfigProps {
  onFinish: (flag: any) => void;
  visible: boolean;
  orgTree: any;
  roleTree: any;
  user: any;
}

const UserConfig: FC<UserConfigProps> = ({ onFinish, visible, user = {}, orgTree, roleTree }) => {
  const [form] = useForm();
  async function handleFinish(data: Store) {
    console.log(data);
    let checked: number[] = [];
    if (data.roleList?.checked) {
      checked = data.roleList?.checked.map((item: number) => ({ id: item }));
    } else {
      checked = data.roleList.map((item: number) => ({ id: item }));
    }
    try {
      await serviceUser.onAddEdit({
        id: user.id,
        userProduct: {
          userProductId: user.userProduct.userProductId,
          depId: data.depId,
          roleList: checked,
        },
      });

      onFinish(data);
    } catch (error) {
      console.log(error);
      return;
    }
  }
  const org = useMemo(() => {
    return treeDataFormate(orgTree, 'id', 'depName');
  }, [orgTree]);
  const role = useMemo(() => {
    return treeDataFormate(roleTree, 'id', 'roleName');
  }, [roleTree]);
  useEffect(() => {
    form.setFieldsValue({
      depId: user?.userProduct?.depId,
      roleList: user?.userProduct?.roleList?.map((item: any) => item.id),
    });
  }, [user]);
  return (
    <ModalForm
      title="用户配置"
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
      <Form.Item label="部门" name="depId">
        <TreeSelect treeData={org} placeholder="请选择部门" />
      </Form.Item>
      <Form.Item label="权限" name="roleList">
        <FormTree treeData={role} />
      </Form.Item>
    </ModalForm>
  );
};
export default UserConfig;
