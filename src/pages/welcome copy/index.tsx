import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';
import WareBox from './components/box/wareBox';
import Box from './components/box/box';
import GoodsBox from './components/goodsBox';
import AreaBox from './components/areaBox/index';
import classNames from 'classnames';
import IndexList from './components/indexList/IndexList';
import WarningBox from './components/warningBox';
import serviceIndex from '@/services';
import { history, useLocation, useModel } from 'umi';
import serviceAdmin from '@/services/admin';
import { debounce } from 'lodash';
interface IndexProps {}

const whk = 882 / 1616;
const Index: FC<IndexProps> = (props) => {
  const [warehouseId, setWarehouseId] = useState(undefined);
  const [rowData, setRowData] = useState<any>({
    fkwzs: 0,
    wzyj: 0,
    jrckwz: 0,
    jrrkwz: 0,
  });
  const [pieData, setPieData] = useState<any[]>([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [user, signin] = useModel('user', (state) => [state.user, state.signin]);
  const { query }: any = useLocation<any>();
  const welcome = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.getElementById('root');
    root?.classList.add(styles.hideFoot);
    const resize = debounce(() => {
      if (welcome.current && box.current) {
        const { clientHeight, clientWidth } = welcome.current;
        const ca = whk - clientHeight / clientWidth;
        box.current.style.width = clientWidth * (1 - ca) + 'px';
      }
    }, 300);
    window.addEventListener('resize', resize);
    resize();
    async function fetch() {
      if (history.location.pathname === '/charts') {
        root?.classList.add(styles.havBg);

        if (!user.loginToken) {
          const res = await serviceAdmin.getLoginInfo2(query.ident);
          signin(res);
        }
      }
    }
    fetch();
    return () => {
      window.removeEventListener('resize', resize);
      root?.classList.remove(styles.hideFoot);
    };
  }, []);
  useEffect(() => {
    if (user.loginToken) {
      setFetchFlag(true);
    }
  }, [user]);
  useEffect(() => {
    if (fetchFlag) {
      fetchPageData();
    }
  }, [warehouseId, fetchFlag]);
  async function fetchPageData() {
    const res: any = await serviceIndex.getGoodsCount(warehouseId);
    setRowData(res);
    let arr: any[] = [];
    res.wzyj.map((item: any) => {
      arr.push({
        name: item.model + '-即将维护',
        value: item.jjwh,
        type: item.model,
      });
      arr.push({
        name: item.model + '-维护预期',
        value: item.whyq,
        type: item.model,
      });
      arr.push({
        name: item.model + '-完成维护',
        value: item.wcwh,
        type: item.model,
      });
    });
    setPieData(arr.filter((item) => item.type));
  }
  function handleFetchData(id: any) {
    setWarehouseId(id == 'all' ? undefined : id);
  }
  return (
    <div id="welcome_root" className={styles.welcome} ref={welcome}>
      <div className={styles.mainBox} ref={box}>
        <Row gutter={12} className={styles.row}>
          <Col flex={1}>
            <WareBox fetchFlag={fetchFlag} onChange={handleFetchData} />
          </Col>
          <Col flex={1}>
            <Box title="库房物资数" icon="huowu" number={rowData.kfwzs} />
          </Col>
          <Col flex={1}>
            <Box title="物资预警" icon="yujing" number={rowData.wzyjs} />
          </Col>
          <Col flex={1}>
            <Box title="今日出库物资" icon="chuku" number={rowData.jrckwz} />
          </Col>
          <Col flex={1}>
            <Box title="今日入库物资" icon="ruku" number={rowData.jrrkwz} />
          </Col>
        </Row>
        <Row gutter={12} className={classNames(styles.row, styles.mar25)}>
          <Col flex={1}>
            <GoodsBox data={rowData.kfwz} />
          </Col>
          <Col flex={2}>
            <AreaBox
              warehouseId={warehouseId}
              fetchFlag={fetchFlag}
              title="物资出入库"
              icon="chuku"
            />
          </Col>
        </Row>
        <Row gutter={12} className={classNames(styles.row, styles.mar25)}>
          <Col flex={1}>
            <WarningBox warehouseId={warehouseId} data={pieData} />
          </Col>
          <Col flex={2}>
            <IndexList fetchFlag={fetchFlag} warehouseId={warehouseId} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Index;
