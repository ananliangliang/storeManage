import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { FC, useEffect, useState } from 'react';
//import styles from './departBtn.less'

interface IDepartBtn {
  id: any;
  depName: string;
  ident: string;
}
interface DepartBtnProps {
  btnList: IDepartBtn[];
  onClick: (data: IDepartBtn) => void;
}

const DepartBtn: FC<DepartBtnProps> = ({ btnList = [], onClick }) => {
  const [text, setText] = useState('');
  const [list, setList] = useState<IDepartBtn[]>([]);

  useEffect(() => {
    if (btnList.length > 1) {
      setText('所有组织');
      setList([{ id: '', depName: '所有组织', ident: '' }, ...btnList]);
    } else {
      if (btnList.length == 0) {
      } else {
        setText(btnList[0].depName);
        setList([...btnList]);
      }
    }
  }, [btnList]);
  function handleMenuClick(e: any) {
    setText(list[e.key].depName);
    onClick(list[e.key]);
  }
  return list.length > 1 ? (
    <Dropdown
      overlay={
        <Menu onClick={handleMenuClick}>
          {list.map((item, i) => (
            <Menu.Item key={i}>{item.depName}</Menu.Item>
          ))}
        </Menu>
      }
      arrow
    >
      <Button>
        {text} <DownOutlined />
      </Button>
    </Dropdown>
  ) : (
    <div>{text}</div>
  );
};
export default DepartBtn;
