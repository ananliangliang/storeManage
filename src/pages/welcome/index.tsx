import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';
import WareBox from './components/box/wareBox';
import Box from './components/box/box';
import GoodsBox from './components/goodsBox';
import AreaBox from './components/areaBox';
import classNames from 'classnames';
import IndexList from './components/indexList/IndexList';
import WarningBox from './components/warningBox';
import serviceIndex from '@/services';

interface IndexProps {}

const Index: FC<IndexProps> = (props) => {
  const [warehouseId, setWarehouseId] = useState(undefined);
  const [rowData, setRowData] = useState<any>({
    fkwzs: 0,
    wzyj: 0,
    jrckwz: 0,
    jrrkwz: 0,
  });
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const root = document.getElementById('root');
    root?.classList.add('hideFoot');
    return () => {
      root?.classList.remove('hideFoot');
    };
  }, []);
  useEffect(() => {
    fetchPageData();
  }, [warehouseId]);
  async function fetchPageData() {
    const res: any = await serviceIndex.getGoodsCount(warehouseId);
    setRowData(res);
    let arr: any[] = [];
    res.wzyj.map((item: any) => {
      arr.push({
        name: '即将维护',
        value: item.jjwh,
        type: item.model,
      });
      arr.push({
        name: '维护预期',
        value: item.whyq,
        type: item.model,
      });
      arr.push({
        name: '完成维护',
        value: item.wcwh,
        type: item.model,
      });
    });
    setPieData(arr);
  }
  function handleFetchData(id: any) {
    console.log(id);
    setWarehouseId(id);
  }
  return (
    <>
      <Row gutter={12} className={styles.row}>
        <Col flex={1}>
          <WareBox onChange={handleFetchData} />
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
        <Col flex={1}>
          <AreaBox
            warehouseId={warehouseId}
            type={1}
            contentId="outArea"
            title="物资出库"
            icon="chuku"
          />
        </Col>
        <Col flex={1}>
          <AreaBox
            warehouseId={warehouseId}
            type={2}
            contentId="inArea"
            title="物资入库"
            icon="ruku"
          />
        </Col>
      </Row>
      <Row gutter={12} className={classNames(styles.row, styles.mar25)}>
        <Col flex={1}>
          <WarningBox warehouseId={warehouseId} data={pieData} />
        </Col>
        <Col flex={2}>
          <IndexList warehouseId={warehouseId} />
        </Col>
      </Row>
    </>
  );
};
export default Index;
