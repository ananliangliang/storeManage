import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';
import serviceGoodsEarlyWarning from '@/services/goodsEarlyWarning';
import serviceUserProduct from '@/services/userProduct';
import { subEffect } from '@/utils/tools';
import { DeleteOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Drawer, Modal } from 'antd';
import { Store } from 'antd/es/form/interface';
import React, { FC, useEffect, useMemo, useRef } from 'react';
//import styles from './productConfig.less'

interface DrawerRuleGoodsProps {
  visible: boolean;
  onClose: () => void;
  data: Store;
  width?: string | number;
}

const DrawerRuleGoods: FC<DrawerRuleGoodsProps> = ({
  visible,
  onClose,
  data = {},
  width = 900,
}) => {
  const actionRef = useRef<ActionType>();
  const columns = useMemo(() => {
    return [
      {
        title: '物资名称',
        dataIndex: 'goods',
      },
      {
        title: '物资位置',
        dataIndex: 'keyId',
      },
      {
        title: '预警时间',
        dataIndex: 'endCheckTime',
      },
      {
        title: '操作',
        valueType: 'option',
        render(_, record) {
          return (
            <PopconfirmPowerBtn
              title="确认删除?"
              allowStr="cancel"
              onConfirm={() => {
                handleDel(record.id);
              }}
            >
              取消预警
            </PopconfirmPowerBtn>
          );
        },
      },
    ] as ProColumns<any>[];
  }, []);

  useEffect(() => {
    if (data.id) {
      actionRef.current?.reload();
    }
  }, [data.id]);

  function getList(params: any) {
    if (data.id) {
      params.ruleId = data.id;
      return serviceGoodsEarlyWarning.list(params);
    }
    throw '';
  }

  async function handleDel(id: string | string[]) {
    await subEffect(async () => {
      if (typeof id === 'object') {
        await serviceUserProduct.batchRemove(id.join(','));
      } else {
        await serviceUserProduct.remove(id);
      }
      actionRef.current?.reload();
    });
  }
  return (
    <Drawer title="产品配置" width={width} onClose={onClose} visible={visible}>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        headerTitle={data.name}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <Button
              key="del"
              type="dashed"
              onClick={() => {
                if (selectedRowKeys && selectedRowKeys.length > 0) {
                  Modal.confirm({
                    content: `是否取消${selectedRowKeys.length}条数据`,
                    async onOk() {
                      await handleDel(selectedRowKeys as string[]);
                    },
                  });
                }
              }}
            >
              <DeleteOutlined /> 批量取消
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
    </Drawer>
  );
};

export default DrawerRuleGoods;
