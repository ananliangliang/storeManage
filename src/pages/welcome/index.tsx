import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
import SummaryBlock, { STORAGE_WAERE_ID } from './components/summaryBlock';
import WareBlock from './components/wareBlock';
import AreaBlock, { TAreaItem } from './components/areaBlock';
import ShelfBlock from './components/shelfBlock';
import GoodsBlock from './components/goodsBlock';
import serviceIndex, { TWareItem } from '@/services';
import { useRequest } from 'umi';

interface IndexProps {}

const Index: FC<IndexProps> = (props) => {
  const [ware, setWare] = useState({
    lwwz: 0,
    zwwz: 0,
    kfList: [] as TWareItem[],
  });

  const [wareVal, setWareVal] = useState({
    wareName: '',
    address: '',
    shelfNum: 0,
    goodsNum: 0,
    outNum: 0,
    inNum: 0,
  });

  const [curKf, setCurKf] = useState<number>(() => {
    const defaultId = localStorage.getItem(STORAGE_WAERE_ID);
    return Number(defaultId);
  });

  const [curHj, setCurHj] = useState<TAreaItem>({} as any);

  const [hlId, setHlId] = useState<number>();

  const fetchWareDetail = useRequest(serviceIndex.getWarehouseDetail, {
    manual: true,
    onSuccess(res: any, param) {
      const tar = ware.kfList.find((item) => item.id === param[0]);
      setWareVal((e) => ({
        address: tar?.address ?? '',
        wareName: tar?.mergerName ?? '',
        shelfNum: res.zhjs,
        goodsNum: res.zwzs,
        outNum: res.jrcks,
        inNum: res.jrrks,
      }));
    },
  });
  // resize
  useEffect(() => {
    const content = document.querySelector('.ant-layout-content') as Element;
    const body = document.body;
    body.classList.add(styles.root);
    function resize() {
      document.documentElement.setAttribute('style', 'font-size:100px');
    }
    resize();
    content.addEventListener('resize', resize);
    return () => {
      body.classList.remove(styles.root);
      document.documentElement.setAttribute('style', '');
      content.removeEventListener('resize', resize);
    };
  }, []);

  // init
  useEffect(() => {
    async function fetchWarehouseList() {
      const res: any = await serviceIndex.getWarehouseList();
      const tar: TWareItem = res.kfList.find((item: any) => item.id === curKf);
      if (tar) {
        setWareVal((e) => ({
          ...e,
          address: tar.address,
          wareName: tar.mergerName,
        }));
      }
      setWare(res);
    }
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (curKf) {
      fetchWareDetail.run(curKf);
      setCurHj({} as any);
    }
  }, [curKf]);

  function handleChioseWare(data: TWareItem) {
    setCurKf(data.id);
    setCurHj({} as any);
  }

  function handleChioseHj(data: TAreaItem) {
    console.log(data);
    setCurHj(data);
    setHlId(undefined);
  }
  function handleChioseShelf(data: any) {
    setHlId(data.id);
  }
  return (
    <div className={styles.content}>
      <div className={styles.col}>
        <SummaryBlock
          wareList={ware.kfList}
          inNum={ware.zwwz}
          outNum={ware.lwwz}
          onClick={handleChioseWare}
        />
        <WareBlock loading={fetchWareDetail.loading} {...wareVal} />
        <AreaBlock wareId={curKf} onChiose={handleChioseHj} />
      </div>
      <div className={styles.col}>
        <ShelfBlock hj={curHj} onClick={handleChioseShelf} />
        <GoodsBlock kfId={curKf} qyId={curHj.id} hlId={hlId} />
      </div>
    </div>
  );
};
export default Index;
