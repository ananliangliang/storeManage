import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { Divider, Modal, TreeSelect } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Store } from 'antd/es/form/interface';
import { DataNode } from 'antd/lib/tree';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { removeEmptyChildren, subEffect, treeDataFormate } from '@/utils/tools';
import serviceCommon from '@/services/common';
import DepartBtn from './components/departBtn';
import PowerBotton from '@/components/PowerBotton';
import PopconfirmPowerBtn from '@/components/PowerBotton/PopconfirmPowerBtn';

interface IndexProps {}

const Department: FC<IndexProps> = (props) => {
  const { goodsKind, init } = useModel('goodsKind', (state) => state);
  const kind = useRef<DataNode[]>([]);
  const formRef = useRef<FormInstance>();
  const [dataSource, setDataSource] = useState<any>([]);
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
    columns: ProColumns<any>[];
  }>({
    visible: false,
    values: {},
    columns: [],
  });

  const treeData = useMemo(() => {
    const data = treeDataFormate(dataSource, 'id', 'depName');
    console.log(data);
    return data;
  }, [dataSource]);

  const columns: ProColumns<any>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInTable: true,
      search: false,
    },
    {
      title: '父名称',
      hideInTable: true,
      dataIndex: 'parentId',
      renderFormItem() {
        return <TreeSelect treeData={treeData} />;
      },
    },
    {
      title: '名称',
      dataIndex: 'dep_name',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '名称',
      dataIndex: 'depName',
      search: false,
    },
    {
      title: '简称',
      dataIndex: 'abbr',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
          <>
            <Divider type="vertical" />
            <PowerBotton
              allowStr="edit"
              type="link"
              showDivider
              onClick={() => {
                setModalProp({
                  visible: true,
                  values: { ...record },
                  columns: [...columns],
                });
                setTimeout(() => {
                  console.log(record);
                  formRef.current?.setFieldsValue(record);
                }, 10);
              }}
            >
              编辑
            </PowerBotton>
            <PopconfirmPowerBtn
              title="确认删除?"
              allowStr="del"
              type="link"
              showDivider
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
  const actionRef = useRef<ActionType>();
  const [depMenu, setDepMenu] = useState<any>([]);

  useEffect(() => {
    if (goodsKind.length == 0) {
      init();
    }
    async function fetch() {
      const depMenu = await serviceCommon.departmentGetOrgAll();
      setDepMenu(depMenu);
      fetchList();
    }

    fetch();
  }, []);

  async function fetchList() {
    const res = await serviceCommon.departmentList();
    removeEmptyChildren(res.data);
    setDataSource(res.data);
  }

  useEffect(() => {
    kind.current = goodsKind;
  }, [goodsKind]);
  async function handleDel(id: string | string[]) {
    if (typeof id === 'object') {
      await serviceCommon.departmentBatchRemove(id.join(','));
    } else {
      await serviceCommon.departmentRemove(id);
    }
    fetchList();
  }

  const selectData = useRef({});

  const onClose = () => {
    setModalProp({ visible: false, values: {}, columns: [] });
    formRef.current?.resetFields();
  };

  function handleAdd(type: string) {
    if (type == 'goods') {
      setModalProp({ visible: true, values: {}, columns: [...columns] });
    } else {
      setModalProp({ visible: true, values: {}, columns: columns.slice(1, 3) });
    }
  }

  const submitLock = useRef(false);

  function handleCheck(e: any) {
    selectData.current = e;
    fetchList();
  }

  return (
    <div>
      <ProTable<any>
        actionRef={actionRef}
        tableAlertRender={false}
        search={false}
        headerTitle={<DepartBtn btnList={depMenu} onClick={handleCheck} />}
        rowSelection={{}}
        // beforeSearchSubmit = {handleBeforeSearch}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
        }}
        // request={getList}
        toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
          return [
            <PowerBotton allowStr="add" type="primary" key="add" onClick={() => handleAdd('goods')}>
              <PlusOutlined /> 添加
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
      ></ProTable>

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
              await serviceCommon.departmentOnAddEdit(data);
              onClose();
              if (data.type == 3) {
                init();
              } else {
                // actionRef.current?.reload();
              }
              fetchList();
            });
            submitLock.current = false;
          }}
        />
      </Modal>
    </div>
  );
};
export default Department;
