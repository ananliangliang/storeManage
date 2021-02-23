import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import styles from '../style.less';
import Search from '../search';
import { TWareItem } from '@/services';

interface IndexProps {
  wareList: TWareItem[];
  inNum: number;
  outNum: number;
  onClick: (data: TWareItem) => void;
}
export const STORAGE_WAERE_ID = 'STORAGE_WAERE_ID';

const Index: FC<IndexProps> = ({ wareList = [], inNum = 0, outNum = 0, onClick }) => {
  const [list, setList] = useState<TWareItem[]>([]);
  const [cur, setCur] = useState(() => {
    const id = localStorage.getItem(STORAGE_WAERE_ID);
    if (id) return Number(id);
    return -1;
  });
  useEffect(() => {
    console.log(wareList);
    setList(wareList.slice());
  }, [wareList]);

  function handleSearch(val: string) {
    const newList = wareList.filter((item) => item.mergerName.includes(val));
    setList(newList);
  }

  function handleClick(item: TWareItem) {
    console.log(item);
    setCur(item.id);
    localStorage.setItem(STORAGE_WAERE_ID, item.id + '');
    onClick && onClick(item);
  }

  return (
    <div className={styles.summaryBlock}>
      <div className={styles.bg}></div>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.title}>
            库房预览 <span className={styles.tag}>库房数:({wareList.length})</span>
            <span className={styles.tag}>在位物资:({inNum})</span>
            <span className={styles.tag}>离位物资:({outNum})</span>
          </div>
          <Search onSearch={handleSearch} />
        </div>
        <div className={styles.content}>
          {list.map((item) => (
            <div
              key={item.id}
              className={classNames(styles.lineBtn, { [styles.act]: item.id == cur })}
              onClick={handleClick.bind(null, item)}
            >
              <div className={styles.bg} />
              <div className={styles.c}>{item.mergerName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Index;
