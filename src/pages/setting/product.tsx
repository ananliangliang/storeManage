import { ImgUpload } from '@/components/ImgUpload';
import PowerBotton from '@/components/PowerBotton';
import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import serviceCommon from '@/services/common';
import { deepClone, subEffect } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Image, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';

import React, { FC, useMemo, useRef, useState } from 'react';
import ProductConfig from './components/productConfig';
//import styles from './product.less'

interface ProductProps {}

const baseColumns: ProColumns<any>[] = [
  {
    title: '编号',
    dataIndex: 'id',
    hideInTable: true,
    hideInForm: true,
    search: false,
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    search: false,
  },
  {
    title: '标识',
    dataIndex: 'ident',
    search: false,
  },
  {
    title: '默认角色',
    dataIndex: 'defaultRole',
    search: false,
  },
  {
    title: '默认图片',
    dataIndex: 'defaultPicture',
    search: false,
    formItemProps: {
      valuePropName: 'imgSrc',
    },
    renderFormItem() {
      return <ImgUpload />;
    },
    render(_, record) {
      return <Image src={record.defaultPicture} width={100} height={100} />;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInForm: true,
    search: false,
  },
];

const Product: FC<ProductProps> = (props) => {
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
    columns: ProColumns[];
  }>({
    visible: false,
    values: {},
    columns: [],
  });

  const [configProp, setConfigProp] = useState({
    visible: false,
    product: {},
  });

  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      ...baseColumns,
      {
        title: '操作',
        hideInForm: true,
        valueType: 'option',
        render(_, record) {
          return (
            <>
              <PowerBotton
                allowStr="config"
                showDivider
                type="link"
                onClick={() => {
                  setConfigProp({
                    visible: true,
                    product: { ...record },
                  });
                }}
              >
                配置
              </PowerBotton>
              <PowerBotton
                type="link"
                allowStr="edit"
                showDivider
                onClick={() => {
                  const col = deepClone(baseColumns);
                  const tar = col.find(
                    (item: any) => item.dataIndex === 'ident',
                  ) as ProColumns<any>;
                  tar.fieldProps = {
                    disabled: true,
                  };
                  setModalProp({
                    visible: true,
                    values: { ...record },
                    columns: col,
                  });
                  setTimeout(() => {
                    formRef.current?.setFieldsValue(record);
                  }, 100);
                }}
              >
                编辑
              </PowerBotton>
              <PopconfirmPowerBtn
                title="确认删除?"
                allowStr="del"
                type="link"
                onConfirm={() => {
                  handleDel(record.id);
                }}
              >
                删除
              </PopconfirmPowerBtn>
            </>
          );
        },
      },
    ];
  }, []);

  async function handleDel(id: string | string[]) {
    await subEffect(async () => {
      if (typeof id === 'object') {
        await serviceCommon.productBatchRemove(id.join(','));
      } else {
        await serviceCommon.productRemove(id);
      }
      actionRef.current?.reload();
    });
  }

  const submitLock = useRef(false);

  const onClose = () => {
    setModalProp((e) => ({ ...e, visible: false, values: {} }));
    formRef.current?.resetFields();
  };

  function handleCloseConfig() {
    setConfigProp({
      visible: false,
      product: {},
    });
  }

  return (
    <div>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        pagination={{
          pageSize: 10,
        }}
        request={serviceCommon.productList}
        toolBarRender={() => {
          return [
            <PowerBotton
              allowStr="add"
              type="primary"
              key="add"
              onClick={() => {
                setModalProp((e) => ({ columns: baseColumns.slice(0), visible: true, values: {} }));
              }}
            >
              <PlusOutlined /> 添加
            </PowerBotton>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={modalProp.values?.id ? '修改' : '新增'}
        visible={modalProp.visible}
        footer={null}
        onCancel={onClose}
        getContainer={false}
      >
        <ProTable
          // headerTitle="角色管理"
          form={{
            ...DEFAULT_FORM_LAYOUT,
            layout: 'horizontal',
          }}
          columns={modalProp.columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            console.log(value);
            if (submitLock.current) return;
            submitLock.current = true;
            const data = { ...modalProp.values, ...value };
            if (!data.type) {
              data.type = 3;
            }
            await subEffect(async () => {
              await serviceCommon.productOnAddEdit(data);
              onClose();
              actionRef.current?.reload();
            });
            submitLock.current = false;
          }}
        />
      </Modal>
      <ProductConfig {...configProp} onClose={handleCloseConfig} />
    </div>
  );
};
export default Product;
