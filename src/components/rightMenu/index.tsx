import { Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import React, { FC, useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

interface IndexProps extends MenuProps {
  closeType?: 'leave' | 'click';
  btns: { key: string; text: string; allowStr: string }[];
  pos: {
    x: number;
    y: number;
  };
}

const RightMenu: FC<IndexProps> = ({ className, pos, onClick, closeType = 'leave', btns }) => {
  const auth = useModel('power', (state) => state.curAuth);
  const [style, setStyle] = useState({
    top: '0px',
    left: '0px',
    display: 'none',
  });
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    setList(btns.filter((item) => auth[item.allowStr]));
  }, [btns]);

  useEffect(() => {
    setStyle({
      top: pos.y + 'px',
      left: pos.x + 'px',
      display: pos.x == -9999 ? 'none' : 'block',
    });
  }, [pos]);
  useEffect(() => {
    function close() {
      setStyle((e) => ({
        ...e,
        display: 'none',
      }));
    }
    if (closeType === 'click') {
      document.addEventListener('click', close);
    }
    return () => {
      document.removeEventListener('click', close);
    };
  }, [closeType]);
  function handleLevae() {
    if (closeType === 'leave') {
      setStyle((e) => ({
        ...e,
        display: 'none',
      }));
    }
  }
  return list.length > 0 ? (
    <div className={styles.rightMenu} style={style} onMouseLeave={handleLevae}>
      <div className={styles.bg}>
        <Menu onClick={onClick} selectable={false}>
          {list.map((item) => (
            <Menu.Item key={item.key}>{item.text}</Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  ) : null;
};
export default RightMenu;
