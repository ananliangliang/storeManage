import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useRef,
  RefForwardingComponent,
} from 'react';
import { Modal, Form, message, Select, DatePicker, InputNumber } from 'antd';
import { useForm } from 'antd/lib/form/util';
import { DEFAULT_FORM_LAYOUT, LOG_MODAL_TYPE } from '@/const';
import { SelectValue } from 'antd/lib/select';
import SearchSelect, { tOption } from '../FormComponents/searchSelect';
import TextArea from 'antd/lib/input/TextArea';
import { addEdit } from '@/pages/journal/service';
import { subEffect } from '@/utils/tools';
import { getDepList } from '@/pages/dep/service/dep';
import moment from 'moment';
//import styles from './logModal.less'

interface LogModalProps {
  // visible?: boolean,
  // onSubmit: (data: any) => void
  // onCancel: () => void,
  // data: any
  onSuccess?: () => void;
}

const sourceRequest = async (param: string) => {
  const res = await getDepList({ dename: param });
  return res.data.map((item: any) => {
    return {
      id: item.departmentId,
      name: item.dename,
    };
  });
};

export interface ReqlodalModal {
  comment: string;
  createTime: number;
  createUid: string;
  depId: string;
  hum: number;
  id: string;
  record: string;
  taskId: string;
  temp: number;
  /**
   * 类型(0未指定,1图形维护,2投运对点,3巡视联调,4厂家运维,5 交接 , 6 缺陷)
   * @type {(0 | 1 | 2 | 3 | 4 |5 |6)}
   * @memberof ReqlodalModal
   */
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface LogModalRef {
  show: () => void;
  close: () => void;
  updata: (data: any) => void;
}
const Item = Form.Item;
const Option = Select.Option;

const LogModal: RefForwardingComponent<LogModalRef, LogModalProps> = ({ onSuccess }, ref) => {
  const [form] = useForm();
  const [type, setType] = useState<SelectValue>(-1);
  const [visible, setVisible] = useState(false);
  const curId = useRef('');
  const now = moment(new Date()).add(1, 'days');
  const chioseAddRef = useRef<{ [id: string]: string }>({});
  const [defDep, setDefDep] = useState<tOption[]>([]);
  useImperativeHandle(ref, () => ({
    show: () => {
      if (!visible) setVisible(true);
    },
    close: cancel,
    updata: (data: any) => {
      if (!visible) setVisible(true);
      if (data.createTime) {
        data.submitTime = moment(data.submitTime);
      }
      console.log(data);
      setType(data.type);
      setDefDep([
        {
          id: data.depId,
          name: data.depName,
        },
      ]);
      curId.current = data.id;
      form.setFieldsValue(data);
    },
  }));
  const onFinish = async (data: any) => {
    try {
      const data = await form.validateFields();
      data.submitTime = data.submitTime.valueOf();
      console.log(data);
      data.id = curId.current;
      const success = await subEffect(async () => {
        const res = await addEdit(data);
      });
      if (success) {
        onSuccess && onSuccess();
      }
      setVisible(false);
      // form.submit()
    } catch (error) {
      message.error('表单数据异常请查看提示');
    }
  };
  const cancel = () => {
    if (visible) setVisible(false);
    setType(-1);
    curId.current = '';
    form.resetFields();
  };

  const fmtComment = () => {
    const values = form.getFieldsValue();
    switch (type) {
      case LOG_MODAL_TYPE.XUN_SHI:
        let str = '';
        if (values.depId) str += chioseAddRef.current[values.depId];
        if (values.temp) str += ' 温度: ' + values.temp + ' ℃';
        if (values.hum) str += ' 湿度: ' + values.hum;
        form.setFields([{ name: 'comment', value: str + '.' }]);
        break;

      default:
        break;
    }
  };

  const chioseAdd = (value: string, options: any) => {
    console.log(options);
    const values = form.getFieldsValue();
    console.log(values);
    chioseAddRef.current[value] = options.name;
    fmtComment();
  };

  const renderContent = () => {
    switch (type) {
      case LOG_MODAL_TYPE.XUN_SHI:
        return (
          <>
            <Item
              name="depId"
              label="机房站点"
              rules={[
                {
                  required: true,
                  message: '机房站点!',
                },
              ]}
            >
              <SearchSelect onChange={chioseAdd} defaultOpt={defDep} request={sourceRequest} />
            </Item>
            <Item
              name="temp"
              label="温度"
              rules={[
                {
                  required: true,
                  message: '请输入温度!',
                },
              ]}
            >
              <InputNumber
                onChange={fmtComment}
                formatter={value => `${value}℃`}
                parser={value => (value ? value.replace('℃', '') : '℃')}
              />
            </Item>

            <Item
              name="hum"
              label="湿度"
              rules={[
                {
                  required: true,
                  message: '请输入温度!',
                },
              ]}
            >
              <InputNumber onChange={fmtComment} />
            </Item>
          </>
        );
      case LOG_MODAL_TYPE.JIAO_JIE:
        return null;
      case LOG_MODAL_TYPE.LIAN_TIAO:
        return null;
      // case LOG_MODAL_TYPE.QUE_XIAN:
      //   return <Item
      //     name="quexian"
      //     label="缺陷单号"
      //     rules={[{
      //       required: true,
      //       message: '请选择缺陷单号!'
      //     }]}
      //   >
      //     <SearchSelect request={getDefcetOdd} />
      //   </Item>

      case LOG_MODAL_TYPE.TU_XING:
        return null;
      case LOG_MODAL_TYPE.CHANG_JIA:
        break;
      default:
        return;
    }
  };

  return (
    <Modal
      visible={visible}
      title="操作日志"
      okText="确定"
      cancelText="取消"
      onCancel={cancel}
      afterClose={cancel}
      onOk={onFinish}
    >
      <Form {...DEFAULT_FORM_LAYOUT} name="modal" form={form} onFinish={onFinish}>
        <Item
          name="submitTime"
          label="日志时间"
          rules={[{ required: true, type: 'object', message: '必须选择日志时间!' }]}
          // rules={[{
          //   required: true,
          //   message: '请选择时间!'
          // }]}
        >
          <DatePicker
            allowClear
            showTime
            format="YYYY-MM-DD HH:mm"
            disabledDate={cur => cur > now}
          />
        </Item>
        <Item
          name="type"
          label="日志类型"
          rules={[{ required: true, message: '必须选择日志类型!' }]}
        >
          <Select
            onChange={value => {
              setType(value);
            }}
          >
            <Option value={LOG_MODAL_TYPE.XUN_SHI}>巡视检查</Option>
            <Option value={LOG_MODAL_TYPE.JIAO_JIE}>日常交接</Option>
            <Option value={LOG_MODAL_TYPE.LIAN_TIAO}>联调投运</Option>
            <Option value={LOG_MODAL_TYPE.QUE_XIAN}>缺陷记录</Option>
            <Option value={LOG_MODAL_TYPE.TU_XING}>图形维护</Option>
            <Option value={LOG_MODAL_TYPE.CHANG_JIA}>厂家运维</Option>
            <Option value={LOG_MODAL_TYPE.QI_TA}>其他类型</Option>
          </Select>
        </Item>
        {renderContent()}
        {type > -1 && (
          <Item label="备注" name="comment">
            <TextArea />
          </Item>
        )}
      </Form>
    </Modal>
  );
};
export default forwardRef(LogModal);
