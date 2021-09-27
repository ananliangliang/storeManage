import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
import SummaryBlock, { STORAGE_WAERE_ID } from './components/summaryBlock';
import WareBlock from './components/wareBlock';
import AreaBlock, { TAreaItem } from './components/areaBlock';
import ShelfBlock from './components/shelfBlock';
import GoodsBlock from './components/goodsBlock';
import serviceIndex, { TWareItem } from '@/services';
import { useRequest } from 'umi';
import { debounce } from 'lodash';

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

  const [curKf, setCurKf] = useState<TWareItem>({} as any);

  const [curHj, setCurHj] = useState<TAreaItem>({} as any);

  const [curHl, setCurHl] = useState<TAreaItem>({} as any);

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
    const body = document.body;
    body.classList.add(styles.root);
    const resize = debounce(function () {
      const content = document.querySelector('.ant-layout-content') as Element;
      if (content) {
        const width = content.clientWidth < 900 ? 900 : content.clientWidth;
        document.documentElement.setAttribute('style', `font-size:${(width / 1616) * 100}px`);
      }
    }, 500);
    resize();
    window.addEventListener('resize', resize);
    return () => {
      body.classList.remove(styles.root);
      document.documentElement.setAttribute('style', '');
      window.removeEventListener('resize', resize);
    };
  }, []);

  // init
  useEffect(() => {
    async function fetchWarehouseList() {
      const res: any = await serviceIndex.getWarehouseList();
      const defaultId = localStorage.getItem(STORAGE_WAERE_ID);
      const tar: TWareItem = res.kfList.find((item: any) => item.id == defaultId);
      if (tar) {
        setCurKf(tar);
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
    if (curKf.id) {
      fetchWareDetail.run(curKf.id);
      setCurHj({} as any);
    }
  }, [curKf]);

  function handleChioseWare(data: TWareItem) {
    setCurKf(data);
    setCurHj({} as any);
    setCurHl({} as any);
  }

  function handleChioseHj(data: TAreaItem) {
    console.log(data);
    setCurHj(data);
    setCurHl({} as any);
  }
  function handleChioseShelf(data: any) {
    setCurHl(data);
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
        <AreaBlock wareId={curKf?.id} onChiose={handleChioseHj} />
      </div>
      <div className={styles.col}>
        <ShelfBlock hj={curHj} onClick={handleChioseShelf} />
        <GoodsBlock kf={curKf} qy={curHj} hl={curHl} />
      </div>
    </div>
  );
};
export default Index;
