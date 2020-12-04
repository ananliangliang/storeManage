import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceGoodsModel from '@/services/goodsModel';
import serviceReceive from '@/services/receive';
import serviceUser from '@/services/user';
import { ModalForm, ProFormDatePicker, ProFormDigit } from '@ant-design/pro-form';
import { Form, TreeSelect } from 'antd';
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

  const sourceRequest = async (param: string) => {
    const res = await serviceGoodsModel.list({ name: param, parentId: goodsKindId.current });

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

  return (
    <ModalForm
      title="入库订单信息"
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
        const data: any = {
          count: values.count,
          goods: {
            modelId: values.modelId,
            hlId: values.address[values.address.length - 1],
          },
        };

        if (values.flag.length == 2) {
          data.goods.flag = 3;
        } else {
          data.goods.flag = values.flag[0];
        }
        await serviceReceive.onAddEdit({
          type: 0,
          state: 1,
          accessList: [data],
        });
        onFinish(data);
      }}
    >
      <Form.Item name="user" label="入库人">
        <SearchSelect request={searchUser} />
      </Form.Item>
      <ProFormDatePicker label="入库时间" name="time" />
      <Form.Item label="种类信息">
        <TreeSelect
          treeData={goodsKind}
          onChange={handlePickKind}
          allowClear
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '请选择物资型号',
          },
        ]}
        name="modelId"
        label="物资型号"
      >
        <SearchSelect
          // className={styles.inline}
          placeholder="请搜索物资名称"
          fetchFlag={fetchFlag}
          request={sourceRequest}
        />
      </Form.Item>
      <ProFormDigit
        name="count"
        label="入库数量"
        fieldProps={{
          precision: 0,
        }}
      />
    </ModalForm>
  );
};

export default OutForm;

const searchUser = async (param: string) => {
  const res = await serviceUser.list({ realName: param });
  return res.data.map((item: any) => {
    return {
      id: item.id,
      name: item.realName + item.phone,
    };
  });
};
