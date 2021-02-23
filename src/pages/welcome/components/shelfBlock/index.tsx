import classNames from 'classnames';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import styles from '../style.less';
import Search from '../search';
import { TAreaItem } from '../areaBlock';
import serviceIndex from '@/services';
import { useRequest } from 'umi';
import { Empty, Spin } from 'antd';

interface Tware {
  mergerName: string;
  num: string;
  regionName: string;
  id: number;
}
interface IndexProps {
  hj: TAreaItem;
  onClick: (data: any) => void;
}

const Index: FC<IndexProps> = ({ hj, onClick }) => {
  const [list, setList] = useState<Tware[][]>([]);
  const [cur, setCur] = useState<number>();
  const hlList = useRef<Tware[]>([]);
  const fetchList = useRequest(serviceIndex.getHjDetail, {
    manual: true,
    onSuccess(res: any) {
      setList(formatList(res));
      hlList.current = res;
    },
  });
  useEffect(() => {
    if (hj.id) {
      fetchList.run(hj.id);
    } else {
      setList([]);
      hlList.current = [];
    }
  }, [hj]);

  function handleSearch(val: string) {
    const newList = hlList.current.filter((item) => item.mergerName.includes(val));
    setList(formatList(newList));
  }

  function handleClick(item: Tware) {
    setCur(item.id);
    onClick && onClick(item);
  }

  const hjNum = hj.num ?? 0;
  return (
    <Spin spinning={fetchList.loading}>
      <div className={styles.shelfBlock}>
        <div className={styles.bg}></div>
        <div className={styles.box}>
          <div className={styles.header}>
            <div>库房预览({hjNum})</div>
            <Search onSearch={handleSearch} />
          </div>
          <div className={styles.content}>
            {list.map((arr, idx) => {
              return (
                <>
                  {arr.map((item) => (
                    <div
                      className={classNames(styles.lineBtn, { [styles.act]: item.id == cur })}
                      onClick={handleClick.bind(null, item)}
                    >
                      <div className={styles.bg} />
                      <div className={styles.c}>{hjNum + '-' + item.num}</div>
                    </div>
                  ))}
                  {idx != list.length - 1 && <div className={styles.bar} />}
                </>
              );
            })}
            {list.length == 0 && <Empty className={styles.empty} description="暂无货架" />}
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default memo(Index, (old, now) => old.hj == now.hj);

function formatList(list: Tware[]): Tware[][] {
  const arr = list.reduce((all, now, idx, arr) => {
    if (idx > 0 && arr[idx - 1].regionName == now.regionName) {
      all[all.length - 1].push(now);
    } else {
      all.push([now]);
    }
    return all;
  }, [] as Tware[][]);
  return arr;
}
