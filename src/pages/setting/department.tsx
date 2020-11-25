import React, { FC, useState, useEffect, useRef } from 'react';
import { Row, Col, Tree, Button, Divider, Popconfirm, Spin, Modal } from 'antd';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './department.less';
import { useModel } from 'umi';
import { Store } from 'antd/es/form/interface';
import { DataNode, EventDataNode } from 'antd/lib/tree';
import RightMenu from '@/components/rightMenu';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect } from '@/utils/tools';
import serviceCommon from '@/services/common';

interface IndexProps {}

const TreeBtn = [
  {
    key: 'add',
    text: '添加',
  },
  {
    key: 'edit',
    text: '修改',
  },
  {
    key: 'remove',
    text: '删除',
  },
];

const Department: FC<IndexProps> = (props) => {
  const { goodsKind, init, loading } = useModel('goodsKind', (state) => state);
  const kind = useRef<DataNode[]>([]);
  const formRef = useRef<FormInstance>();
  const [menuPos, setMenuPos] = useState({
    x: -9999,
    y: -9999,
    data: {},
  });
  const [modalProp, setModalProp] = useState<{
    visible: boolean;
    values: Store;
    columns: ProColumns<any>[];
  }>({
    visible: false,
    values: {},
    columns: [],
  });
  const [columns] = useState<ProColumns<any>[]>([
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '项目标识',
      dataIndex: 'ident',
    },
    {
      title: '名称',
      dataIndex: 'depName',
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
            <a
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
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                handleDel(record.id);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ]);
  const actionRef = useRef<ActionType>();
  const [curData, setCurData] = useState({});

  useEffect(() => {
    if (goodsKind.length == 0) {
      init();
    }
  }, []);

  useEffect(() => {
    kind.current = goodsKind;
  }, [goodsKind]);
  async function handleDel(id: string | string[]) {
    console.log(id);

    if (typeof id === 'object') {
      await serviceCommon.departmentBatchRemove(id.join(','));
    } else {
      await serviceCommon.departmentRemove(id);
    }
    actionRef.current?.reload();
  }

  const selectData = useRef({});

  const onTreeCheck = async (checked: React.ReactText[], info: any) => {
    console.log(checked, info);
    const data = info.node;

    if (info.selected) {
      setCurData(data);
      selectData.current = { ...data };
      actionRef.current?.reload();
    }
  };

  function handleTreeRight(info: {
    event: React.MouseEvent<Element, MouseEvent>;
    node: EventDataNode;
  }) {
    const { pageX, pageY } = info.event;
    console.log(pageX, pageY);
    setMenuPos({
      x: pageX,
      y: pageY,
      data: info.node,
    });
  }

  function handleMenuClick(e: any) {
    console.log(e);
    console.log(menuPos);
    switch (e.key) {
      case 'add':
        handleAdd('type');
        break;
      case 'edit':
        setModalProp({ visible: true, values: menuPos.data, columns: columns.slice(1, 3) });
        setTimeout(() => {
          formRef.current?.setFieldsValue(menuPos.data);
        }, 20);
        break;
      case 'remove':
        Modal.confirm({
          content: '确定删除改种类吗?',
          async onOk() {
            await serviceCommon.departmentRemove(menuPos.data['id']);
            if (curData['id'] === menuPos.data['id']) {
              // 刷新列表
            }
            init();
          },
        });
        break;
    }
  }

  async function getList(params: any): Promise<RequestData<any>> {
    params.parentId = selectData.current?.['id'];
    return await serviceCommon.departmentList(params);
  }

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

  return (
    <div>
      <Row gutter={20} className={styles.row}>
        <Col span={6}>
          <div className={styles.col2}>
            <Spin spinning={loading}>
              {goodsKind.length > 0 && (
                <Tree
                  showLine
                  treeData={goodsKind}
                  defaultExpandParent
                  defaultExpandedKeys={['0-0']}
                  selectedKeys={[curData['key']]}
                  onRightClick={handleTreeRight}
                  draggable
                  onDrop={(e) => {
                    console.log(e);
                  }}
                  autoExpandParent
                  onSelect={onTreeCheck}
                />
              )}
            </Spin>
          </div>
          {props.children}
        </Col>
        <Col span={18}>
          <div className={styles.col}>
            <ProTable<any>
              actionRef={actionRef}
              tableAlertRender={false}
              rowSelection={{}}
              pagination={{
                pageSize: 10,
              }}
              request={getList}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  <Button type="primary" key="add" onClick={() => handleAdd('goods')}>
                    <PlusOutlined /> 添加
                  </Button>,
                  <Button
                    key="del"
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
                  </Button>,
                ];
              }}
              columns={columns}
              rowKey="id"
            ></ProTable>
          </div>
        </Col>
      </Row>
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
                actionRef.current?.reload();
              }
            });
            submitLock.current = false;
          }}
        />
      </Modal>
      <RightMenu btns={TreeBtn} pos={menuPos} onClick={handleMenuClick} closeType="click" />
    </div>
  );
};
export default Department;
