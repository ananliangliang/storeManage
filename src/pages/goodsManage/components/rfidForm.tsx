import serviceLocal from '@/services/local';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef } from 'react';
import { goodsChangeRFID } from '../service/goodsInfo';
//import styles from './rfidForm.less'

interface RfidFormProps {
  visible: boolean;
  onFinish: (flag?: boolean) => void;
  goods: any;
}

const RfidForm: FC<RfidFormProps> = ({ visible, onFinish, goods }) => {
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    if (visible) {
      fetchRfid();
    }
  }, [visible]);
  function fetchRfid() {
    setTimeout(async () => {
      try {
        const res = await serviceLocal.getRFID();
        console.log(res);
        formRef.current?.setFieldsValue({ signNo: res });
      } catch (error) {
        message.error('错误的访问 检查设备是否连接');
      }
    }, 100);
  }

  async function handleFinish(data: Store) {
    goodsChangeRFID(goods.id, data.signNo);
    onFinish();
    return;
  }

  return (
    <ModalForm
      formRef={formRef}
      title="RFID更换"
      modalProps={{
        width: '500px',
      }}
      onVisibleChange={(e) => {
        console.log(e);
        if (e === false) {
          formRef.current?.resetFields();
          onFinish();
        }
      }}
      visible={visible}
      onFinish={handleFinish}
    >
      <ProFormText name="signNo" label="RFID" />
    </ModalForm>
  );
};
export default RfidForm;
