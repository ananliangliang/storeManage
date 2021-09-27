import { Pagination, Select, Spin } from 'antd';
import classNames from 'classnames';
import React, { FC, memo, useEffect, useState } from 'react';
import styles from '../style.less';
import Search from '../search';
import { useRequest } from 'umi';
import shelfImg from '@/assets/image/shelf.jpg';
import serviceIndex from '@/services';

interface IndexProps {
  wareId?: number;
  onChiose: (data: TAreaItem) => void;
}

interface IList {
  total: number;
  data: TAreaItem[];
}

interface IReqParam {
  kfId: number;
  qyId: number;
  name: string;
  pageSize: number;
  current: number;
}

const PAGE_SIZE = 12;

const Index: FC<IndexProps> = ({ wareId, onChiose }) => {
  const [list, setList] = useState<IList>({
    total: 0,
    data: [],
  });

  const fetchAreaDetail = useRequest(serviceIndex.getHjList, {
    manual: true,
    onSuccess(res: any) {
      setList(res);
    },
  });

  const [cur, setCur] = useState<number>();
  const [area, setArea] = useState([]);
  const [reqParam, setReqParam] = useState<Partial<IReqParam>>({ pageSize: PAGE_SIZE, current: 1 });

  useEffect(() => {
    setReqParam({
      kfId: wareId,
      pageSize: PAGE_SIZE,
      current: 1,
    });
    async function fetchArea(wareId: number) {
      const res: any = await serviceIndex.getFq(wareId);
      console.log(res);
      setArea(res.map((item: any) => ({ value: item.id, label: item.mergerName })));
    }
    if (wareId) {
      fetchArea(wareId);
    }
  }, [wareId]);

  useEffect(() => {
    if (reqParam?.kfId) {
      fetchAreaDetail.run(reqParam);
    }
  }, [reqParam]);

  function handleSearch(val: string) {
    setReqParam((e) => ({
      ...e,
      name: val,
      current: 1,
    }));
  }

  function handleSelect(val: number) {
    setReqParam((e) => ({
      ...e,
      qyId: val,
      name: '',
      current: 1,
    }));
  }

  function handleClick(item: TAreaItem) {
    if (item.id != cur) {
      setCur(item.id);
      onChiose(item);
    }
  }
  function handlePaginChange(page: number) {
    setReqParam((e) => ({
      ...e,
      current: page,
    }));
  }
  return (
    <Spin spinning={fetchAreaDetail.loading}>
      <div className={styles.areaBlock}>
        <div className={styles.bg}></div>
        <div className={styles.box}>
          <div className={styles.header}>
            <div>
              区域:
              <Select
                allowClear
                onChange={handleSelect}
                className={styles.select}
                options={area}
                placeholder="请选择"
              />
            </div>
            <Search onSearch={handleSearch} searchVal={reqParam.name} />
          </div>
          <div className={styles.content}>
            {list.data.map((item) => (
              <div
                key={item.id}
                className={classNames(styles.shelfItem, { [styles.act]: item.id == cur })}
                onClick={handleClick.bind(null, item)}
              >
                <div className={styles.bg} />
                <img className={styles.shelfImg} src={shelfImg} />
                <div className={styles.n}>
                  <div className={styles.n2}>{item.num}</div>
                  <div>
                    库存 <span>{item.zwCount}</span> / {item.allCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.footer}>
            <Pagination
              className={styles.pagin}
              pageSize={PAGE_SIZE}
              total={list.total}
              onChange={handlePaginChange}
              showQuickJumper
              showSizeChanger={false}
              size="small"
            />
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default memo(Index, (old, now) => old.wareId == now.wareId);

export interface TAreaItem {
  id: number;
  mergerName: string;
  zwCount: number;
  allCount: number;
  num: string;
}
