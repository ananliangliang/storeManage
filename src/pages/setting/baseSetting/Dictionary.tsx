import React, { SFC, useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Divider, Modal, Menu, message, Popconfirm } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import styles from './Department.less';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect } from '@/utils/tools';
import { dictListAllTree, dictAddEdit, dictRemove } from '../service/dictionary';
import { ClickParam } from 'antd/lib/menu';
import { useSelector, useLocation } from 'dva';

interface DictionaryProps {}
type orgType = { [coId: string]: Icurrent[] };

interface Icurrent {
  children: Icurrent[];
  name: string;
  dictionaryId: string;
  parentId: string;
}

const formate = (com: Icurrent[]) => {
  const tree: orgType = {};
  loop(com);
  return tree;
  function loop(cur: Icurrent[]) {
    cur.map(item => {
      if (!item.children || item.children.length == 0) {
        delete item.children;
        if (tree[item.parentId]) {
          tree[item.parentId].push(item);
        } else {
          tree[item.parentId] = [item];
        }
      } else {
        loop(item.children);
      }
    });
  }
};

const Dictionary: SFC<DictionaryProps> = props => {
  const [dataSource, setDataSource] = useState<Icurrent[]>([]);
  const [dict, setDict] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState('0');
  const [modalVisible, handleModalVisible] = useState(false);
  const func = useSelector((selector: ConnectState) => selector.menu.func);
  const [btn = [], setBtn] = useState(() => {
    return func[useLocation().pathname];
  });
  const orgData = useRef<orgType>({});
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const dict = await dictListAllTree();
    setDict(dict);
    orgData.current = formate(dict);
    console.log(orgData);
    orgData.current[0] = dict.map((item: any) => {
      return {
        name: item.name,
        dictionaryId: item.dictionaryId,
        parentId: 0,
      };
    });
    setDataSource(orgData.current[currentId || 0]);
  };

  const handleAdd = async (record: Icurrent) => {
    return await subEffect(async () => {
      record.dictionaryId = formRef.current?.getFieldValue('dictionaryId');
      console.log(record);
      const res = await dictAddEdit(record);
      return res;
    });
  };

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
        const res = await Promise.allSettled(ids.map(id => dictRemove(id)));
        console.log(res);
        init();
      },
    });
  };

  const handleDel = async (id: string) => {
    return await subEffect(
      async () => {
        await dictRemove(id);
      },
      '正在删除请稍后',
      '删除成功',
    );
  };

  const columns: ProColumns<Icurrent>[] = [
    {
      title: '字典编号',
      dataIndex: 'dictionaryId',
      hideInSearch: true,
    },
    {
      title: '父字段单位',
      dataIndex: 'parentId',
      valueEnum: (() => {
        const temp = {
          '0': '无',
        };
        dict.map(item => {
          temp[item.dictionaryId] = item.name;
        });
        return temp;
      })(),
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
      rules: [{ message: '请输入名称', required: true }],
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
          <>
            {btn.includes('edit') && (
              <>
                <a
                  onClick={() => {
                    handleModalVisible(true);
                    setTimeout(() => {
                      formRef.current?.setFieldsValue(record);
                    }, 10);
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
              </>
            )}
            {btn.includes('del') && (
              <Popconfirm
                title="确认删除?"
                onConfirm={async () => {
                  const res = await handleDel(record.dictionaryId);
                  if (res) {
                    init();
                  }
                }}
              >
                <a>删除</a>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };
  const onMenuClick = (param: ClickParam) => {
    console.log(orgData, param.key);
    setCurrentId(param.key);
    setDataSource(orgData.current[param.key]);
  };

  return (
    <div>
      <Row gutter={8} className={styles.row}>
        <Col flex="256px">
          <Menu defaultSelectedKeys={['0']} onClick={onMenuClick}>
            <Menu.Item key={'0'}> 字段列表 </Menu.Item>
            {dict.map(item => (
              <Menu.Item key={item.dictionaryId}> {item.name} </Menu.Item>
            ))}
          </Menu>
        </Col>
        <Col flex="auto">
          <div className={styles.col}>
            <ProTable<Icurrent>
              search={false}
              headerTitle="字典管理"
              tableAlertRender={false}
              rowSelection={{}}
              toolBarRender={(action, { selectedRowKeys, selectedRows }) => {
                return [
                  btn.includes('add') ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        handleModalVisible(true);
                        setTimeout(() => {
                          formRef.current?.setFieldsValue({ parentId: currentId + '' });
                        });
                      }}
                    >
                      <PlusOutlined /> 添加
                    </Button>
                  ) : null,
                  btn.includes('del') ? (
                    <Button
                      type="dashed"
                      onClick={() => {
                        deleteHandler(selectedRowKeys as string[]);
                      }}
                    >
                      {' '}
                      <DeleteOutlined /> 删除
                    </Button>
                  ) : null,
                ];
              }}
              postData={(d: any) => {
                console.log(d);
                return d;
              }}
              columns={columns}
              dataSource={dataSource}
              rowKey="dictionaryId"
            ></ProTable>
          </div>
        </Col>
      </Row>
      <Modal
        title="字段管理"
        visible={modalVisible}
        footer={null}
        onCancel={onClose}
        getContainer={false}
      >
        <ProTable
          {...DEFAULT_FORM_LAYOUT}
          columns={columns}
          type="form"
          size="middle"
          formRef={formRef}
          onSubmit={async (value: any) => {
            const success = await handleAdd(value);
            if (success) {
              onClose();
              init();
            }
          }}
        ></ProTable>
      </Modal>
    </div>
  );
};
export default Dictionary;
