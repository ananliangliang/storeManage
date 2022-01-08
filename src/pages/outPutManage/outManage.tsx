import SearchSelect from '@/components/FormComponents/searchSelect';
import FormModal, { FormModalRef } from '@/components/Modals/FormModal';
import PowerBotton from '@/components/PowerBotton';
// import { warehouseTreeFormate } from '@/models/warehouse';
import serviceAccess from '@/services/access';
import serviceUser from '@/services/user';
import config from '@/config/config';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form } from 'antd';
// import { DataNode } from 'antd/lib/tree';
import React, { FC, useRef, useState } from 'react';
import serviceMessageLog from '../log/services/messageLog';
// import { warehouseTreeListAll } from '../Warehouse/service';
import OutForm from './components/outForm';
//import styles from './warningRule.less'

const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const OutManage: FC = () => {
  const [putFormVisible, setPutFormVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const formModal = useRef<FormModalRef>(null);
  const curUser = useRef({});
  const curList = useRef<any[]>([]);
  const [requestValue, setRequestValue] = useState<{ filter: any }>();
  // const [treeData, setTreeData] = useState<DataNode[]>([]);
  // useEffect(() => {
  //   async function fetch() {
  //     const res = await warehouseTreeListAll();
  //     const { node } = warehouseTreeFormate(res);
  //     setTreeData(node);
  //   }

  //   fetch();
  // }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInTable: true,
      hideInForm: true,
      search: false,
    },
    {
      title: '物品名称',
      dataIndex: 'goods_goods',
      render(_, record) {
        return record.goods.goods;
      },
    },
    {
      title: '定制管理编号',
      dataIndex: 'managementNo',
      search: false,
      render(_, record) {
        return record.goods.managementNo;
      },
    },
    {
      title: '物资类型',
      dataIndex: 'goods_lastModel',
      render(_, record) {
        return record.goods.lastModel;
      },
    },
    {
      title: '借出时间',
      dataIndex: 'receive_time',
      valueType: 'dateRange',
      render(_, record) {
        return record.receive.createTime;
      },
    },

    {
      title: '借出人',
      dataIndex: 'uname',
      render(_, record) {
        if (record.receive.uname) {
          return record.receive.uname;
        }
        // console.log(record);
        return (
          <PowerBotton allowStr="record" type="link" onClick={() => handleRecord(record.id)}>
            补录
          </PowerBotton>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'count',
      search: false,
    },

    {
      title: '识别方式',
      dataIndex: 'goods_type',
      valueType: 'select',
      valueEnum: typeEnum,
      hideInTable: true,
      render(_, record) {
        return typeEnum[record.goods.type];
      },
    },
    {
      title: '库房',
      dataIndex: 'rule',
      render(_, record) {
        return record.goods.kf;
      },
      search: false,
    },
    {
      title: '分区',
      dataIndex: 'rule',
      render(_, record) {
        return record.goods.fq;
      },
      search: false,
    },
    {
      title: '货柜',
      dataIndex: 'rule',
      render(_, record) {
        return record.goods.hj;
      },
      search: false,
    },
    {
      title: '行列',
      render(_, record) {
        return record.goods.hl;
      },
      search: false,
    },
  ];

  function handleFinish(flag: boolean) {
    setPutFormVisible(false);
    if (flag) {
      actionRef.current?.reload;
    }
  }

  function handleRecord(id: string) {
    formModal.current?.show({
      title: '补录',
      async onSubmit(data) {
        const t = curUser.current as any;
        console.log(t);
        await serviceMessageLog.onEditUser({ userId: t.id, userName: t.realName, id });
        actionRef.current?.reload();
      },
    });
  }

  function getList(params = {}) {
    const result: any = params;
    delete result.current;
    delete result.pageSize;
    setRequestValue({ filter: result });
    params['type'] = 1;

    return serviceAccess.list(params);
  }

  const searchUser = async (param: string) => {
    const res = await serviceUser.list({ search: param });
    curList.current = res.data;
    return res.data.map((item: any) => {
      return {
        ...item,
        id: item.id,
        name: item.realName + item.phone,
      };
    });
  };
  console.log(localStorage.getItem('token'));

  function handleSearch(value: number, opt: any) {
    console.log('111', value, opt);
    curUser.current = curList.current.find((item: any) => item.id === value);
    console.log(curUser.current);
  }
  return (
    <div>
      <ProTable<any>
        tableAlertRender={false}
        actionRef={actionRef}
        headerTitle="出库管理"
        pagination={{
          pageSize: 10,
        }}
        request={getList}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton
              allowStr="add"
              type="primary"
              key="add"
              onClick={() => {
                setPutFormVisible(true);
              }}
            >
              <PlusOutlined />
              出库补录
            </PowerBotton>,
            <Button type="primary" key="export">
              <a
                href={`${config.baseUrl}/warehouse/access/out/export?json=${encodeURI(
                  JSON.stringify(requestValue)
                )}&loginToken=${localStorage.getItem('token')}`}
                download
                target="_blank"
              >
                <ExportOutlined /> 导出
              </a>
            </Button>,
          ];
        }}
        columns={columns}
        rowKey="id"
      />
      <OutForm visible={putFormVisible} onFinish={handleFinish} />

      <FormModal ref={formModal}>
        <Form.Item name="userId" label="归还人">
          <SearchSelect request={searchUser} onChange={handleSearch} />
        </Form.Item>
      </FormModal>
    </div>
  );
};
export default OutManage;
