import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { Row, Col, Button, Divider, Modal, Menu, message, Popconfirm } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import styles from './Department.less';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DEFAULT_FORM_LAYOUT } from '@/const';
import { FormInstance } from 'antd/lib/form';
import { subEffect } from '@/utils/tools';
import serviceDict from '@/services/dict';
import { useModel } from 'umi';

interface DictionaryProps {}
type orgType = { [coId: string]: Icurrent[] };

interface Icurrent {
  // children: Icurrent[];
  name: string;
  id: string;
  parentId: string;
}

const Dictionary: FC<DictionaryProps> = () => {
  const [dataSource, setDataSource] = useState<Icurrent[]>([]);
  const [allType = [], getDict, dict] = useModel('dict', (state) => [
    state.dict._allType as {
      id: string;
      name: string;
      value: string;
      parentId: string;
    }[],
    state.getDict,
    state.dict,
  ]);

  const [currentId, setCurrentId] = useState(0);
  const [modalVisible, handleModalVisible] = useState(false);
  const formRef = useRef<FormInstance>();
  const parEmun = useMemo(() => {
    const map = new Map([[0, '无']]);
    allType.map((item) => {
      map.set(item.id as any, item.name);
    });
    return map;
  }, [allType]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // orgData.current = formate(dict);
    // console.log(orgData);
    // orgData.current[0] = dict.map((item: any) => {
    //   return {
    //     name: item.name,
    //     dictionaryId: item.dictionaryId,
    //     parentId: 0,
    //   };
    // });
    // setDataSource(orgData.current[currentId || 0]);
  };

  const handleAdd = async (record: Icurrent) => {
    return await subEffect(async () => {
      record.id = formRef.current?.getFieldValue('id');
      console.log(record);
      const res = await serviceDict.onAddEdit(record);
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
        const res = await serviceDict.batchRemove(ids.join('id'));
        console.log(res);
        init();
      },
    });
  };

  const handleDel = async (id: string) => {
    return await subEffect(
      async () => {
        await serviceDict.remove(id);
      },
      '正在删除请稍后',
      '删除成功',
    );
  };

  const columns: ProColumns<Icurrent>[] = [
    {
      title: '字典编号',
      dataIndex: 'id',
      hideInForm: true,
      search: false,
    },
    {
      title: '父字段单位',
      dataIndex: 'parentId',
      valueEnum: parEmun,
    },
    {
      title: '名称',
      dataIndex: 'name',
      search: false,
      formItemProps: {
        rules: [{ message: '请输入名称', required: true }],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, index) => {
        return (
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
            <Popconfirm
              title="确认删除?"
              onConfirm={async () => {
                const res = await handleDel(record.id);
                if (res) {
                  init();
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onClose = () => {
    handleModalVisible(false);
    formRef.current?.resetFields();
  };

  useEffect(() => {
    const tar = allType.find((item) => item.id == (currentId as any));
    if (tar) {
      setDataSource(dict[tar.value]);
    } else {
      setDataSource(allType);
    }
  }, [dict]);
  const onMenuClick = (param: any) => {
    setCurrentId(Number(param.key));
    const tar = allType.find((item) => item.id == param.key);
    console.log(param, allType, tar);
    if (tar) {
      if (dict[tar.value]) {
        setDataSource(dict[tar.value]);
      } else {
        getDict(tar.value as any);
      }
    } else {
      setDataSource(allType);
    }
  };

  return (
    <div>
      <Row gutter={8} className={styles.row}>
        <Col flex="256px">
          <Menu defaultSelectedKeys={['0']} onClick={onMenuClick}>
            <Menu.Item key={'0'}> 字段列表 </Menu.Item>
            {allType.map((item) => (
              <Menu.Item key={item.id}> {item.name} </Menu.Item>
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
                  <Button
                    type="primary"
                    onClick={() => {
                      handleModalVisible(true);
                      setTimeout(() => {
                        formRef.current?.setFieldsValue({ parentId: currentId });
                      });
                    }}
                  >
                    <PlusOutlined /> 添加
                  </Button>,
                  <Button
                    type="dashed"
                    onClick={() => {
                      deleteHandler(selectedRowKeys as string[]);
                    }}
                  >
                    {' '}
                    <DeleteOutlined /> 删除
                  </Button>,
                ];
              }}
              postData={(d: any) => {
                console.log(d);
                return d;
              }}
              columns={columns}
              dataSource={dataSource}
              rowKey="id"
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
