import { keyFindChild } from '@/models/warehouse';
import { exitFullscreen, fullScreen } from '@/utils/tools';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from '../index.less';
interface BoxProps {
  onClick?: () => void;
  onChange: (id: number) => void;
  fetchFlag: boolean;
}

const WareBox: FC<BoxProps> = ({ onClick, onChange, fetchFlag }) => {
  const [data, init, pos] = useModel('warehouse', (state) => [
    state.warehouse,
    state.init,
    state.pos,
  ]);

  const [curWare, setCurWare] = useState<any>({});
  const [isFull, setIsFull] = useState(false);
  const root = useRef<Element | null>();
  useEffect(() => {
    root.current = document.querySelector('#welcome_root');
  }, []);

  useEffect(() => {
    if (fetchFlag && data.length == 0) {
      init();
    }
  }, [fetchFlag]);

  const menus = useMemo(() => {
    console.log(data);
    if (data.length > 0 && pos.warehouse) {
      const menu = keyFindChild(data, pos.warehouse);
      console.log(menu);
      return menu;
    }
    return [];
  }, [data, pos]);
  function handleClick(event: any) {
    const { key } = event;
    console.log(key);
    if (key == curWare.id) return;
    if (key) {
      const tar = menus.find((item: any) => item.value == key);
      if (tar) {
        setCurWare(tar);
      } else {
        setCurWare({
          id: 'all',
          text: '所有库房',
        });
      }
    } else {
      setCurWare({
        id: 'all',
        text: '所有库房',
      });
    }
    onChange(key);
  }
  function handleFull() {
    if (!root.current) root.current = document.querySelector('#welcome_root');
    if (isFull) {
      exitFullscreen();
      root.current?.classList.remove('full');
    } else {
      fullScreen(root.current as HTMLElement);
      root.current?.classList.add('full');
    }
    setIsFull(!isFull);
  }
  return (
    <div className={styles.box} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-cangkuguanli`} />
          当前库房
          <span
            onClick={handleFull}
            className={`iconfont icon-${isFull ? 'suoxiao' : 'fangda'} full`}
          />
        </div>
      </div>
      <div className={styles.btn}>
        {menus.length > 1 ? (
          <Dropdown
            overlay={
              <Menu onClick={handleClick}>
                <Menu.Item key="all">所有库房</Menu.Item>
                {menus.map((item: any) => (
                  <Menu.Item key={item.value}>{item.title}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <span>
              {curWare.mergerName || '所有库房'}
              <DownOutlined />
            </span>
          </Dropdown>
        ) : (
          menus[0]?.['mergerName'] || '暂无权限'
        )}
      </div>
    </div>
  );
};
export default WareBox;
