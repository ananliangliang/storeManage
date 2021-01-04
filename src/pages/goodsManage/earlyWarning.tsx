import PowerBotton from '@/components/PowerBotton';
import { warehouseTreeFormate } from '@/models/warehouse';
import serviceGoodsEarlyWarning from '@/services/goodsEarlyWarning';
import serviceGoodsRule from '@/services/goodsRule';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { message, Tooltip, TreeSelect } from 'antd';
import { Store } from 'antd/es/form/interface';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { warehouseTreeListAll } from '../Warehouse/service';
import EarlyWarningForm from './components/earlyWarningForm';
//import styles from './ earlyWarning.less'

interface EarlyWarningProps {}

const handleEnum = new Map([
  [0, '未处理'],
  [1, '已处理'],
]);

const EarlyWarning: FC<EarlyWarningProps> = (props) => {
  const { goodsKind, goodsKindInit } = useModel('goodsKind', (state) => {
    const { goodsKind, init } = state;
    return {
      goodsKind,
      goodsKindInit: init,
    };
  });
  const [treeData, setTreeData] = useState<any[]>([]);
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
  }>({
    visible: false,
    values: {},
  });
  const actionRef = useRef<ActionType>();
  const [ruleList, setRuleList] = useState<any[]>([]);
  const kind = useRef<DataNode[]>([]);

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
  useEffect(() => {
    kind.current = goodsKind;
  }, [goodsKind]);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
      search: false,
    },
    {
      title: '资产编号',
      dataIndex: 'goodsId',
      hideInForm: true,
    },
    {
      title: '类型信息',
      dataIndex: 'type',
      render(_, record) {
        return record.lastModel;
      },
      renderFormItem() {
        return <TreeSelect treeData={kind.current} />;
      },
    },
    {
      title: '物资名称',
      dataIndex: 'goods',
      ellipsis: true,
      render(_, record) {
        const text = textAppend(record.goods, record.specs);
        return <Tooltip title={text}>{text}</Tooltip>;
      },
    },

    {
      title: '位置',
      hideInForm: true,
      // ellipsis: true,
      render(_, record) {
        const text = textAppend(record.kf, record.lc, record.fq, record.hj, record.hl);
        return <Tooltip title={text}>{text}</Tooltip>;
      },
      search: false,
    },
    {
      title: '预警状态',
      dataIndex: 'rule',
      hideInForm: true,
    },
    {
      title: '预警时间',
      dataIndex: 'endCheckTime',
      valueType: 'dateRange',
      render(node, record) {
        return record.endCheckTime;
      },
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'isHandle',
      valueType: 'select',
      valueEnum: handleEnum,
      render(cur, record) {
        if (record.isHandle === 0) {
          return (
            <ModalForm
              modalProps={{
                width: 600,
              }}
              onFinish={async (values) => {
                await serviceGoodsEarlyWarning.handle(record.id, values.remark);
                actionRef.current?.reload();
                console.log(values);
                message.success('提交成功');
                return true;
              }}
              trigger={
                <PowerBotton key="dispose" allowStr="dispose">
                  立即处理
                </PowerBotton>
              }
            >
              <ProFormTextArea label="处理方式" name="remark" />
            </ModalForm>
          );
        }
        return '已处理';
      },
      hideInForm: true,
    },
    {
      title: '处理方式',
      dataIndex: 'remark',
      search: false,
    },
  ];

  // async function handleDel(id: string | string[]) {
  //   await subEffect(async () => {
  //     if (typeof id === 'object') {
  //       await serviceGoodsEarlyWarning.batchRemove(id.join(','));
  //     } else {
  //       await serviceGoodsEarlyWarning.remove(id);
  //     }
  //     actionRef.current?.reload();
  //   });
  // }

  function handleAdd(data: Store) {
    console.log(data);
    setModalProp({ visible: false, values: {} });
    actionRef.current?.reload();
  }

  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={serviceGoodsEarlyWarning.list}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton
              allowStr="add"
              type="primary"
              key="add"
              onClick={() => {
                setModalProp({ visible: true, values: {} });
              }}
            >
              <PlusOutlined /> 新增预警
            </PowerBotton>,
            <ModalForm
              modalProps={{
                width: 600,
              }}
              onFinish={async (values) => {
                if (selectedRowKeys && selectedRowKeys.length > 0) {
                  try {
                    await serviceGoodsEarlyWarning.handle(selectedRowKeys.join(','), values.remark);
                    actionRef.current?.reload();
                    console.log(values);
                    message.success('提交成功');
                    return true;
                  } catch (error) {}
                  return false;
                } else {
                  message.error('尚未选中任意一项');
                  return true;
                }
              }}
              trigger={
                <PowerBotton key="dispose" allowStr="dispose">
                  批量处理
                </PowerBotton>
              }
            >
              <ProFormTextArea label="处理方式" name="remark" />
            </ModalForm>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />

      <EarlyWarningForm
        {...modalProp}
        addressTree={treeData}
        onFinish={handleAdd}
        onClose={() => {
          setModalProp({ visible: false, values: {} });
        }}
        ruleList={ruleList}
      />
    </div>
  );
};
export default EarlyWarning;

function textAppend(...args: string[]) {
  let str = '';
  args.map((item) => {
    if (item) {
      str += item + ' ';
    }
  });
  if (str) {
    return str;
  } else {
    return null;
  }
}
