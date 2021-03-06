import SearchSelect from '@/components/FormComponents/searchSelect';
import { getGoodsAddressIdLink } from '@/pages/goodsManage/components/editGoodsInfoForm';
import serviceGoodsModel from '@/services/goodsModel';
import serviceLocal from '@/services/local';
import serviceReceive from '@/services/receive';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-form';
import { Cascader, Form, message, TreeSelect } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
// import styles from './taskForm.less';

interface PutFormProps {
  visible: boolean;
  onFinish: (data?: any, ret?: any) => void;
  addressTree: DataNode[];
  value?: Store;
}

const PutForm: FC<PutFormProps> = ({ visible, onFinish, addressTree, value }) => {
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
    console.log(value);
    if (value && value.hlId) {
      let address: any[] = [];
      if (value.hlId) {
        address = getGoodsAddressIdLink(addressTree, value.hlId);
        console.log(address);
      }
      formRef.current?.setFieldsValue({
        address,
      });
    }
  }, [value]);

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
    //  ??????+ ??????
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
      title="??????????????????"
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
            managementNo: values.managementNo,
            testNo: values.testNo,
            testDate: values?.thisAndNextTestDate?.[0],
            nextTestDate: values?.thisAndNextTestDate?.[1],
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
          const ret = await serviceReceive.onAddEdit({
            type: 0,
            state: 1,
            accessList: [data],
          });
          onFinish(data, ret);
        } catch (error) {
          console.log(error);
          message.error(error);
          return false;
        }
        return true;
      }}
    >
      {/* <ProFormText
        name="name"
        label="????????????"
        labelCol={{
          span: 6,
        }}
        placeholder="???????????????"
      /> */}
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
          fetchFlag={fetchFlag}
          onChange={handlesetDefaultName}
          request={sourceRequest}
        />
      </Form.Item>
      <ProFormText label="????????????" name="name" />
      <ProFormText label="??????????????????" name="managementNo" />
      <ProFormText label="????????????" name="testNo" />
      <ProFormDateRangePicker label="????????????" name="thisAndNextTestDate" />

      <ProFormCheckbox.Group
        name="flag"
        layout="horizontal"
        label="????????????ID "
        formItemProps={{
          getValueFromEvent: handleFlagChange,
        }}
        options={[
          {
            value: '1',
            disabled: true,
            label: '???????????????',
          },
          {
            value: '2',
            label: '??????RFID',
          },
        ]}
      />
      {isRFID && <ProFormText label="RFID" name="signNo" />}
      {!isRFID && (
        <ProFormDigit
          name="count"
          label="????????????"
          fieldProps={{
            precision: 0,
          }}
        />
      )}
      <Form.Item
        name="address"
        rules={[
          {
            required: true,
            message: '?????????????????????',
          },
        ]}
        label="????????????"
      >
        <Cascader options={addressTree} />
      </Form.Item>
    </ModalForm>
  );
};
export default PutForm;
