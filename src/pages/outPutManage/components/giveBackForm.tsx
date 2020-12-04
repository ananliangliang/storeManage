import SearchSelect from '@/components/FormComponents/searchSelect';
import serviceAccess from '@/services/access';
import serviceReceive from '@/services/receive';
import serviceUser from '@/services/user';
import { subEffect } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Drawer, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { FC, useEffect, useRef, useState } from 'react';

interface GiveBackFormProps {
  visible: boolean;
  onFinish: (data: any) => Promise<void | boolean> | void | boolean;
  width?: number;
}

const columns: ProColumns<any>[] = [
  {
    title: '种类名称',
    dataIndex: 'goods',
    render(node, record) {
      return record.goods.goods;
    },
  },
  {
    title: '物品位置',
    dataIndex: '',
    render(_, rec) {
      const record = rec.goods;
      return textAppend(record.kf, record.lc, record.fq, record.hj, record.hl);
    },
  },
];

const GiveBackForm: FC<GiveBackFormProps> = ({ visible, onFinish, width = 800 }) => {
  const [form] = useForm();
  const actionRef = useRef<ActionType>();
  const [user, setUser] = useState<any>({});

  async function handleFinish(data: any) {
    console.log(data);
    await subEffect(
      async () => {
        await serviceReceive.onAddEdit({
          type: 2,
          state: 0,
          accessList: data,
        });
        actionRef.current?.reload();
      },
      '正在提交',
      '提交成功',
    );
  }

  useEffect(() => {
    if (user.id) {
      actionRef.current?.reload();
    }
  }, [user]);
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  async function getList() {
    if (user.id) {
      return await serviceAccess.list({
        isBorrowList: true,
        uid: user.id,
        type: '999',
        goods_type: 2,
      });
    }
    return {
      data: [],
      total: 0,
    };
  }

  function handleSearch(value: number, opt: any) {
    console.log(value, opt);
    setUser(opt[0]);
  }

  return (
    <Drawer
      title="归还物资"
      width={width}
      onClose={(e) => {
        onFinish(false);
      }}
      visible={visible}
    >
      <Form.Item name="user" label="归还人">
        <SearchSelect request={searchUser} onChange={handleSearch} />
      </Form.Item>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        headerTitle="相关物资"
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          console.log(selectedRowKeys);
          return [
            <Button
              type="primary"
              key="add"
              onClick={() => {
                // setPutFormVisible(true);
                handleFinish(selectedRows);
              }}
            >
              <PlusOutlined />
              归还
            </Button>,
          ];
        }}
        rowSelection={{}}
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        columns={columns}
        rowKey="goodsId"
      />
    </Drawer>
  );
};
export default GiveBackForm;

const searchUser = async (param: string) => {
  const res = await serviceUser.list({ search: param });
  return res.data.map((item: any) => {
    return {
      id: item.id,
      name: item.realName + item.phone,
    };
  });
};

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
