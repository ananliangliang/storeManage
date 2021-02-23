import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceGoodsModel from '@/services/goodsModel';
import serviceLocal from '@/services/local';
import serviceReceive from '@/services/receive';
import { ModalForm, ProFormCheckbox, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Cascader, Form, message, TreeSelect } from 'antd';
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
  const [isRFID, setIsRFID] = useState(false);
  const kind = useRef({
    id: '',
    name: '',
  });

  useEffect(() => {
    async function init() {
      if (goodsKind.length === 0) {
        goodsKindInit();
      }
    }
    init();
  }, []);

  useEffect(() => {
    console.warn(goodsKind);
  }, [goodsKind]);

  const sourceRequest = async (param: string) => {
    const res = await serviceGoodsModel.list({ name: param, parentId: kind.current.id });

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
      setIsRFID(false);
    }
  }, [visible]);

  function handlePickKind(e: any, t: any[]) {
    console.log(e, t);
    kind.current = {
      id: e,
      name: t[0],
    };
    setFetchFlag((e) => ++e);
  }

  function handlesetDefaultName(id: string, opt: any) {
    //  类型+ 型号
    console.log(opt);
    formRef.current?.setFieldsValue({
      name: kind.current.name + '-' + opt[0].name,
    });
  }
  function handleFlagChange(e: string[]) {
    console.log(e);
    const flag = e.includes('2');
    if (flag) {
      formRef.current?.setFieldsValue({
        count: 1,
      });
      serviceLocal.getRFID().then((res) => {
        formRef.current?.setFieldsValue({
          signNo: res,
        });
      });
    } else {
      formRef.current?.setFieldsValue({
        signNo: '',
      });
    }
    setIsRFID(flag);
    return e;
  }

  return (
    <ModalForm
      title="入库订单信息"
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 6 }}
      initialValues={{
        flag: ['1'],
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
          count: isRFID ? 1 : values.count,
          goods: {
            modelId: values.modelId,
            signNo: values.signNo,
            name: values.name,
            hlId: values.address[values.address.length - 1],
          },
        };

        if (values.flag.length == 2) {
          data.goods.flag = 3;
        } else {
          data.goods.flag = values.flag[0];
        }
        console.log(data);
        try {
          await serviceReceive.onAddEdit({
            type: 0,
            state: 1,
            accessList: [data],
          });
          onFinish(data);
        } catch (error) {
          console.log(error);
          message.error(error);
          return false;
        }
        return true;
      }}
    >
      <Form.Item label="类型信息">
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
          onChange={handlesetDefaultName}
          request={sourceRequest}
        />
      </Form.Item>
      <ProFormText label="物品名称" name="name" />

      <ProFormCheckbox.Group
        name="flag"
        layout="horizontal"
        label="生成标签ID "
        formItemProps={{
          getValueFromEvent: handleFlagChange,
        }}
        options={[
          {
            value: '1',
            disabled: true,
            label: '生成二维码',
          },
          {
            value: '2',
            label: '生成RFID',
          },
        ]}
      />
      {isRFID && <ProFormText label="RFID" name="signNo" />}
      {!isRFID && (
        <ProFormDigit
          name="count"
          label="入库数量"
          fieldProps={{
            precision: 0,
          }}
        />
      )}
    </ModalForm>
  );
};
export default PutForm;
