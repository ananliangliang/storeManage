import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
//import styles from './dropBtn.less'

interface IDropMenu {
  allowStr: string;
  key: string;
  text: string;
}

interface DropBtnProps {
  menus: IDropMenu[];
  text?: string;
  onClick: (info: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => void;
}

const PowerDropBtn: FC<DropBtnProps> = ({ menus, text, onClick }) => {
  const auth = useModel('power', (state) => state.curAuth);
  const [list, setList] = useState<IDropMenu[]>([]);
  useEffect(() => {
    setList(menus.filter((item) => auth[item.allowStr]));
  }, [menus]);
  return list.length > 0 ? (
    <Dropdown
      overlay={
        <Menu onClick={onClick}>
          {list.map((item) => (
            <Menu.Item key={item.key}>{item.text}</Menu.Item>
          ))}
        </Menu>
      }
      arrow
    >
      <Button>
        {text} <DownOutlined />
      </Button>
    </Dropdown>
  ) : null;
};
export default PowerDropBtn;
