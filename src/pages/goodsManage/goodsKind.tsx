import React, { FC, useState, useEffect, useRef } from 'react';
import { Row, Col, Tree, Button, Divider, Popconfirm, Spin, Modal, Image, TreeSelect } from 'antd';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './goodsKind.less';
import { useModel } from 'umi';
import { Store } from 'antd/es/form/interface';
import { DataNode, EventDataNode } from 'antd/lib/tree';
import RightMenu from '@/components/rightMenu';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { ImgUpload } from '@/components/ImgUpload';
import { subEffect } from '@/utils/tools';
import serviceGoodsModel from '../../services/goodsModel';
// import { TreeNode } from 'antd/lib/tree-select';
const typeEnum = new Map([
  [1, 'RFID'],
  [2, '二维码'],
]);

const { TreeNode } = Tree;
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

const GoodsKind: FC<IndexProps> = (props) => {
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
      title: '序号',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'parentId',
      search: false,
      render(_, record) {
        return record.lastModel;
      },
      renderFormItem(item, config) {
        return <TreeSelect treeData={kind.current} treeDefaultExpandAll />;
      },
    },
    {
      title: '名称',
      dataIndex: 'goods',
    },
    {
      title: '描述',
      dataIndex: 'des',
    },
    {
      title: '规格',
      dataIndex: 'specs',
      search: false,
    },
    {
      title: '识别方式',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: typeEnum,
    },
    {
      title: '数量',
      dataIndex: 'count',
      search: false,
      hideInForm: true,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      search: false,
      render(_, record) {
        return <Image width={120} src={record.imageUrl} />;
      },
      formItemProps: {
        // trigger: '',
      },
      renderFormItem(url: any, record) {
        return <ImgUpload />;
      },
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
      await serviceGoodsModel.batchRemove(id.join(','));
    } else {
      await serviceGoodsModel.remove(id);
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
            await serviceGoodsModel.remove(menuPos.data['id']);
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
    return await serviceGoodsModel.list(params);
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
              await serviceGoodsModel.onAddEdit(data);
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
export default GoodsKind;