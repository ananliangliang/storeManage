import { Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';

interface IndexProps extends MenuProps {
  closeType?: 'leave' | 'click';
  btns: { key: string; text: string }[];
  pos: {
    x: number;
    y: number;
  };
}

const RightMenu: FC<IndexProps> = ({ className, pos, onClick, closeType = 'leave', btns }) => {
  const [style, setStyle] = useState({
    top: '0px',
    left: '0px',
    display: 'none',
  });

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
  return (
    <div className={styles.rightMenu} style={style} onMouseLeave={handleLevae}>
      <div className={styles.bg}>
        <Menu onClick={onClick} selectable={false}>
          {btns.map((item) => (
            <Menu.Item key={item.key}>{item.text}</Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  );
};
export default RightMenu;
