import { DEFAULT_FORM_LAYOUT } from '@/const';
import serviceGoodsRule from '@/services/goodsRule';
import { subEffect } from '@/utils/tools';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import StatusSwitch from '@/components/statusSwitch/statusSwitch';
import PowerBotton from '@/components/PowerBotton';
import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';
import { useModel } from 'umi';
import DrawerRuleGoods from './components/drawerRuleGoods';
import EarlyWarningForm from './components/earlyWarningForm';
import { warehouseTreeFormate } from '@/models/warehouse';
import { warehouseTreeListAll } from '../Warehouse/service';
//import styles from './warningRule.less'

interface WarningRuleProps {}
const statusEnum = new Map([
  [1, '开启'],
  [0, '禁用'],
]);

const WarningRule: FC<WarningRuleProps> = (props) => {
  const { goodsKind, goodsKindInit } = useModel('goodsKind', (state) => {
    const { goodsKind, init } = state;
    return {
      goodsKind,
      goodsKindInit: init,
    };
  });
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
  }>({
    visible: false,
    values: {},
  });
  const [modalWarningProp, setModalWarningProp] = useState<{
    visible: boolean;
    values: Store;
  }>({
    visible: false,
    values: {},
  });

  const [ruleList, setRuleList] = useState<any[]>([]);

  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const auth = useModel('power', (state) => state.curAuth);
  const [treeData, setTreeData] = useState<any[]>([]);

  const [ruleGoodsProp, setRuleGoodsProp] = useState<{
    visible: boolean;
    data: Store;
  }>({
    visible: false,
    data: {},
  });

  useEffect(() => {
    async function fetch() {
      const res = await warehouseTreeListAll();
      const { node } = warehouseTreeFormate(res);

      setTreeData(node);
      console.warn(node);
    }
    fetch();
  }, []);

  useEffect(() => {
    async function init() {
      if (goodsKind.length === 0) {
        goodsKindInit();
      }
      const list = await serviceGoodsRule.list();
      setRuleList(list.data);
    }
    init();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
      search: false,
    },
    {
      title: '规则名称',
      dataIndex: 'rule',
    },
    {
      title: '周期',
      dataIndex: 'cycle',
      valueType: 'digit',
      render(val, record) {
        return `${(record.cycle / 86400).toFixed(2)}天`;
      },
      formItemProps: {
        formatter: (value: any) => `${value}天`,
        parser: (value: any) => value.replace('天', ''),
      } as any,
      search: false,
    },
    {
      title: '规则状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: statusEnum,
      render(text, record) {
        return (
          <StatusSwitch
            disabled={!auth['changeState']}
            checked={record.state == 1}
            onChange={(flag) => switchStatus(record, flag)}
          />
        );
      },
    },
    {
      title: '操作',
      hideInForm: true,
      valueType: 'option',
      render(_, record) {
        return (
          <>
            <PowerBotton
              key="edit"
              allowStr="edit"
              type="link"
              showDivider
              onClick={() => {
                setModalProp({
                  visible: true,
                  values: { ...record },
                });
                setTimeout(() => {
                  formRef.current?.setFieldsValue({ ...record, cycle: record.cycle / 86400 });
                }, 100);
              }}
            >
              编辑
            </PowerBotton>
            <PowerBotton
              key="seeRuleGoods"
              allowStr="edit"
              type="link"
              showDivider
              onClick={() => {
                setRuleGoodsProp({
                  visible: true,
                  data: { ...record },
                });
              }}
            >
              查看关联物资
            </PowerBotton>

            <PopconfirmPowerBtn
              allowStr="del"
              title="确认删除?"
              type="link"
              onConfirm={() => {
                handleDel(record.id);
              }}
            >
              <a>删除</a>
            </PopconfirmPowerBtn>
          </>
        );
      },
    },
  ];

  async function handleDel(id: string | string[]) {
    await subEffect(async () => {
      if (typeof id === 'object') {
        await serviceGoodsRule.batchRemove(id.join(','));
      } else {
        await serviceGoodsRule.remove(id);
      }
      actionRef.current?.reload();
    });
  }

  async function switchStatus(data: any, flag: boolean) {
    await serviceGoodsRule.onAddEdit({ ...data, state: flag ? 1 : 0 });
    data.state = flag ? 1 : 0;
  }

  const onClose = () => {
    setModalProp({ visible: false, values: {} });
    formRef.current?.resetFields();
  };
  function handleClose() {
    setRuleGoodsProp({
      visible: false,
      data: {},
    });
  }

  function handleAdd(data: Store) {
    console.log(data);
    setModalWarningProp({ visible: false, values: {} });
    actionRef.current?.reload();
  }

  const submitLock = useRef(false);
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        rowSelection={{}}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        request={serviceGoodsRule.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton
              allowStr="add"
              type="primary"
              key="add"
              onClick={() => {
                setModalWarningProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined /> 新增预警
            </PowerBotton>,
            <PowerBotton
              type="primary"
              allowStr="add"
              key="add"
              onClick={() => {
                setModalProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined /> 新增规则
            </PowerBotton>,
            <PowerBotton
              key="del"
              allowStr="del"
              type="dashed"
              onClick={() => {
                if (selectedRowKeys && selectedRowKeys.length > 0) {
                  Modal.confirm({
                    content: `是否删除该${selectedRowKeys.length}`,
                    async onOk() {
                      await handleDel(selectedRowKeys as string[]);
                    },
                  });
                }
              }}
            >
              <DeleteOutlined /> 删除
            </PowerBotton>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />

      <DrawerRuleGoods {...ruleGoodsProp} onClose={handleClose} />
      <EarlyWarningForm
        {...modalWarningProp}
        addressTree={treeData}
        onFinish={handleAdd}
        onClose={() => {
          setModalWarningProp({ visible: false, values: {} });
        }}
        ruleList={ruleList}
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
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            console.log(value);
            if (submitLock.current) return;
            submitLock.current = true;
            value.cycle = value.cycle * 86400;
            const data = { ...modalProp.values, ...value };
            if (!data.type) {
              data.type = 3;
            }
            await subEffect(async () => {
              await serviceGoodsRule.onAddEdit(data);
              onClose();
              actionRef.current?.reload();
            });
            submitLock.current = false;
          }}
        />
      </Modal>
    </div>
  );
};
export default WarningRule;
