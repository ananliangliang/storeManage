import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { TreeSelect, Modal, Row, Col, message, Input, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import styles from './Menu.less';
import FormModal, { FormModalRef } from '@/components/Modals/FormModal';
import TextArea from 'antd/lib/input/TextArea';
import { treeDataFormate } from '@/utils/tools';
import IconChiose from './components/IconChiose';
import serviceMenu from '@/services/menu';
import PowerBotton from '@/components/PowerBotton';
import { useModel } from 'umi';

interface MenuProps {}

interface curItem {
  parentId?: string;
  menuName: string;
  id: string;
  url: string;
  isAllowedDelete: boolean;
  icon: string;
  remark: string;
  sortIndex: number;
}

interface IMenus extends curItem {
  children?: IMenus[];
}

const formate = (data: any[]) => {
  const funcs: { [pid: string]: curItem[] } = {};
  console.log(data);
  const menu = loop(data) as IMenus[];
  console.log(menu);
  function loop(d: any[]): any[] {
    return d.map((item) => {
      const children: any[] = [];
      if (item.children) {
        item.children.forEach((j: any) => {
          if (j.type == 0) {
            delete j.children;
            funcs[j.parentId] ? funcs[j.parentId].push(j) : (funcs[j.parentId] = [j]);
          } else {
            children.push(j);
          }
        });
        if (children.length > 0) {
          item.children = loop(children);
        } else {
          delete item.children;
        }
      }
      return item;
    });
  }
  return {
    menu,
    funcs,
  };
};

const funcColumns: ProColumns<curItem>[] = [
  {
    title: '功能名称',
    dataIndex: 'menuName',
    width: 140,
    formItemProps: {
      rules: [{ required: true, message: '请传入功能名称!' }],
    },
  },
  {
    title: '接口地址',
    dataIndex: 'url',
    formItemProps: {
      rules: [{ required: true, message: '请传入接口地址!' }],
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

const Item = Form.Item;

const Menu: FC<MenuProps> = (props) => {
  const [menu, setMenu] = useState<IMenus[]>([]);
  const [funcs, setFuncs] = useState<curItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [actRow, setActRow] = useState('');
  const orgFuncs = useRef<{ [pid: string]: curItem[] }>({});
  const formRef = useRef<FormInstance>();
  const formModal = useRef<FormModalRef>(null);
  const auth = useModel('power', (state) => state.curAuth);

  const deleteHandler = (ids: string[]) => {
    if (ids.length == 0) {
      message.warn('起码勾选其中一项');
      return;
    }
    Modal.confirm({
      title: '确定要删除吗',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        const res = await serviceMenu.batchRemove(ids.join(','));
        console.log(res);
        await fetch();
        setActRow('');
        setFuncs([]);
      },
    });
  };

  const setClassName = (record: any) => {
    return actRow === record.id ? `${styles['row-active']}` : '';
  };

  const editHandler = async (values: any, style: 0 | 1) => {
    const hide = message.loading('正在请求');
    if (!values['parentId']) {
      values['parentId'] = 0;
    }
    if (style == 1) {
      values['id'] = actRow;
    }
    values['type'] = style;
    const res: any = await serviceMenu.onAddEdit(values);
    console.log(values);
    hide();
    message.success('请求成功');
    return res;
  };

  const columns: ProColumns<curItem>[] = useMemo(() => {
    return [
      {
        title: '父级菜单',
        dataIndex: 'parentId',
        hideInTable: true,
        renderFormItem: () => {
          return (
            <TreeSelect
              showSearch
              allowClear
              placeholder="是否需要父级菜单"
              treeDefaultExpandAll
              treeData={treeDataFormate(menu, 'id', 'menuName')}
            ></TreeSelect>
          );
        },
      },
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        required: true,
      },
      {
        title: '地址',
        hideInSearch: true,
        dataIndex: 'url',
        required: true,
      },
      {
        title: '能否删除',
        dataIndex: 'isAllowedDelete',
        required: true,
        hideInSearch: true,
        valueEnum: {
          1: '是',
          0: '否',
        },
      },
      {
        title: '图标',
        hideInSearch: true,
        dataIndex: 'icon',

        render: (text: React.ReactNode) => {
          return (
            <span className={`anticon `}>
              <span className={`${text}`}></span>
            </span>
          );
        },
        renderFormItem: (_) => {
          return <IconChiose />;
        },
        required: false,
      },
      {
        title: '备注',
        hideInSearch: true,
        dataIndex: 'remark',
        required: false,
      },
      {
        title: '排序',
        hideInSearch: true,
        dataIndex: 'sortIndex',
        valueType: 'digit',
        required: false,
      },
    ];
  }, [menu]);

  const fetch = async () => {
    const data: any = await serviceMenu.list();
    const res = formate(data.data);
    data.data.unshift({
      menuName: '无',
      id: 0,
    });
    setMenu(res.menu);
    orgFuncs.current = res.funcs;
  };

  useEffect(() => {
    fetch();
  }, []);

  const cancel = () => {
    setVisible(false);
    formRef.current?.resetFields();
  };

  const funcOnOk = async (value: any) => {
    if (formModal.current) {
      const { id, parentId } = formModal.current.form.getFieldsValue(['id', 'parentId']);
      value['id'] = id;
      value['parentId'] = parentId;
      value['style'] = 0;
    }
    if (!value['parentId']) {
      value['parentId'] = actRow;
    }
    console.log(value);
    const success = await editHandler(value, 0);
    if (success) {
      const cur = orgFuncs.current[value['parentId']] ? orgFuncs.current[value['parentId']] : [];
      const t = cur.findIndex((item) => item.id == value['id']);
      if (t > -1) {
        cur[t] = success;
      } else {
        cur.push(success);
      }
      const temp = [...cur];
      orgFuncs.current[value['parentId']] = temp;
      setFuncs(temp);
    }
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <ProTable<curItem>
            search={false}
            headerTitle={`菜单管理(双击行修改)`}
            dataSource={menu}
            columns={columns}
            rowKey="id"
            key="menu"
            rowClassName={setClassName}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  console.log(orgFuncs);
                  setActRow(record.id);
                  setFuncs(orgFuncs.current[record.id]);
                }, // 点击行
                onDoubleClick: (event) => {
                  if (!auth['editMenu']) return;
                  setVisible(true);
                  setTimeout(() => {
                    const temp = { ...record };
                    if (!temp.parentId) {
                      delete temp.parentId;
                    }
                    console.log(temp);
                    formRef.current?.setFieldsValue(temp);
                  }, 10);
                },
              };
            }}
            rowSelection={{}}
            tableAlertRender={false}
            pagination={false}
            toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
              return [
                <PowerBotton
                  type="primary"
                  allowStr="addMenu"
                  key="add"
                  onClick={() => {
                    setVisible(true);
                    setActRow('');
                  }}
                >
                  <PlusOutlined /> 添加
                </PowerBotton>,
                <PowerBotton
                  allowStr="delMenu"
                  key="del"
                  type="dashed"
                  onClick={() => {
                    deleteHandler(selectedRowKeys as string[]);
                  }}
                >
                  <DeleteOutlined /> 删除
                </PowerBotton>,
              ];
            }}
          ></ProTable>
        </Col>
        <Col span="12">
          <ProTable<curItem>
            headerTitle="功能管理"
            search={false}
            dataSource={funcs}
            columns={funcColumns}
            rowKey="id"
            rowSelection={{}}
            tableAlertRender={false}
            // pagination={false}
            onRow={(record) => {
              return {
                onDoubleClick: (event) => {
                  if (!auth['editFunc']) return;
                  console.log(actRow);
                  if (actRow.length == 0) {
                    message.warn('请先选择一个页面');
                  } else {
                    if (formModal.current) {
                      formModal.current.form.setFieldsValue(record);
                      console.log(formModal.current.form.getFieldValue('id'));
                      formModal.current.show({
                        title: '修改',
                        onSubmit: funcOnOk,
                      });
                    }
                  }
                },
              };
            }}
            toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
              return [
                <PowerBotton
                  allowStr="addFunc"
                  type="primary"
                  onClick={() => {
                    if (actRow.length == 0) {
                      message.warn('请先选择一个页面');
                    } else {
                      formModal.current?.show({
                        title: '添加',
                        onSubmit: funcOnOk,
                      });
                    }
                  }}
                >
                  <PlusOutlined /> 添加
                </PowerBotton>,
                <PowerBotton
                  allowStr="delFunc"
                  type="dashed"
                  onClick={() => {
                    deleteHandler(selectedRowKeys as string[]);
                  }}
                >
                  <DeleteOutlined /> 删除
                </PowerBotton>,
              ];
            }}
          ></ProTable>
        </Col>
      </Row>
      <Modal
        visible={visible}
        title="菜单权限"
        okText="确定"
        cancelText="取消"
        onCancel={cancel}
        footer={null}
      >
        <ProTable<curItem>
          search={false}
          columns={columns}
          type="form"
          formRef={formRef}
          onSubmit={async (value) => {
            console.log(value);
            const success = await editHandler(value, 1);
            if (success) {
              setVisible(false);
              fetch();
            }
          }}
        ></ProTable>
      </Modal>
      <FormModal ref={formModal}>
        <Item label="功能名称" name="menuName" required>
          <Input placeholder="请输入功能名称" />
        </Item>
        <Item label="接口地址" name="url" required>
          <Input placeholder="请输入接口地址" />
        </Item>
        <Item label="备注" name="remark" required>
          <TextArea placeholder="请输入备注" />
        </Item>
      </FormModal>
    </div>
  );
};
export default Menu;
