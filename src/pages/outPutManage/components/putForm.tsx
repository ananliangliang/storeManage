import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceGoodsModel from '@/services/goodsModel';
import serviceReceive from '@/services/receive';
import { ModalForm, ProFormCheckbox, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Cascader, Form, TreeSelect } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
// import styles from './taskForm.less';

interface PutFormProps {
  visible: boolean;
  onFinish: (data?: any) => void;
  addressTree: DataNode[];
}

const PutForm: FC<PutFormProps> = ({ visible, onFinish, addressTree }) => {
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
            name: values.name,
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
      {/* <ProFormText
        name="name"
        label="任务名称"
        labelCol={{
          span: 6,
        }}
        placeholder="请输入名称"
      /> */}
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
      <ProFormText label="物品名称" name="name" />
      <ProFormDigit
        name="count"
        label="入库数量"
        fieldProps={{
          precision: 0,
        }}
      />
      <ProFormCheckbox.Group
        name="flag"
        layout="horizontal"
        label="生成标签ID "
        options={[
          {
            value: '1',
            label: '生成二维码',
          },
          {
            value: '2',
            label: '生成RFID',
          },
        ]}
      />
      <Form.Item name="address" label="物资位置">
        <Cascader options={addressTree} />
      </Form.Item>
    </ModalForm>
  );
};
export default PutForm;
