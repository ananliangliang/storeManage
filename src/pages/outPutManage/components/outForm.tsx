import serviceGoodsModel from '@/services/goodsModel';
import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceReceive from '@/services/receive';
import serviceUser from '@/services/user';
import { ModalForm, ProFormDatePicker } from '@ant-design/pro-form';
import { Form, InputNumber, message, TreeSelect } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
// import styles from './taskForm.less';

interface OutFormProps {
  visible: boolean;
  onFinish: (data?: any) => void;
}

const OutForm: FC<OutFormProps> = ({ visible, onFinish }) => {
  const { goodsKind, goodsKindInit } = useModel('goodsKind', (state) => {
    const { goodsKind, init } = state;
    return {
      goodsKind,
      goodsKindInit: init,
    };
  });
  const [curCount, setCurCount] = useState(-1);
  const [fetchFlag, setFetchFlag] = useState(0);
  const goodsKindId = useRef();

  useEffect(() => {
    async function init() {
      if (goodsKind.length === 0) {
        goodsKindInit();
      }
    }
    init();
  }, []);
  const curSearchList = useRef<any[]>([]);

  const sourceRequest = async (param: string) => {
    const res = await serviceGoodsModel.list({ name: param, parentId: goodsKindId.current });
    curSearchList.current = res.data;
    return res.data.map((item: any) => {
      return {
        id: item.id,
        name: item.goods + ' ' + item.specs,
      };
    });
  };

  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (!visible) {
      formRef.current?.resetFields();
    }
  }, [visible]);

  function handlePickKind(e: any) {
    console.log(e);
    goodsKindId.current = e;
    setFetchFlag((e) => ++e);
  }

  function handleChnage(e: number) {
    console.log(e);
    const tar = curSearchList.current.find((item) => item.id == e);
    console.log(tar);
    setCurCount(tar.count);
    if (tar && tar.type == 1) {
      formRef.current?.setFieldsValue({
        count: 1,
      });
    } else {
      formRef.current?.setFieldsValue({
        count: null,
      });
    }
  }

  return (
    <ModalForm
      title="??????????????????"
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 6 }}
      initialValues={{
        flag: ['1', '2'],
      }}
      modalProps={{
        width: 600,
      }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onVisibleChange={(visible) => {
        if (!visible) {
          onFinish();
        }
      }}
      onFinish={async (values) => {
        console.log(values);
        const tar = curSearchList.current.find((item) => item.id == values.modelId);
        if (tar.count < values.count) {
          message.error('???????????????' + tar.count);
          formRef.current?.setFieldsValue({
            count: tar.count,
          });
          return;
        }
        const data: any = {
          count: values.count,
          goods: {
            id: values.modelId,
          },
        };
        await serviceReceive.onAddEdit({
          type: 1,
          state: 0,
          accessList: [data],
        });
        onFinish(data);
      }}
    >
      {/* <Form.Item name="user" label="?????????">
        <SearchSelect request={searchUser} />
      </Form.Item>
      <ProFormDatePicker label="????????????" name="time" /> */}
      <Form.Item label="????????????">
        <TreeSelect
          treeData={goodsKind}
          onChange={handlePickKind}
          showSearch
          allowClear
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '?????????????????????',
          },
        ]}
        name="modelId"
        label="????????????"
      >
        <SearchSelect
          // className={styles.inline}
          placeholder="?????????????????????"
          onChange={handleChnage}
          fetchFlag={fetchFlag}
          request={sourceRequest}
        />
      </Form.Item>
      <Form.Item label="????????????" name="count">
        <InputNumber precision={0} /> {curCount > -1 && `???????????? ${curCount}`}
      </Form.Item>
    </ModalForm>
  );
};

export default OutForm;
