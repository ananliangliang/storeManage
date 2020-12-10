import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.less';
import { Chart } from '@antv/g2';
import serviceIndex from '@/services';

interface IndexProps {
  title: string;
  icon: string;
  contentId: string;
  warehouseId?: string;
  type: 1 | 2;
}
const text = ['一周', '一月'];

const AreaBox: FC<IndexProps> = ({ title, icon, contentId, warehouseId, type }) => {
  const [cur, setCur] = useState<0 | 1>(0);
  const chartInstance = useRef<Chart>();
  useEffect(() => {
    const chart = new Chart({
      container: contentId,
      autoFit: true,
    });
    chart.scale('date', {
      range: [0, 1],
      tickCount: 10,
      type: 'timeCat',
    });
    chart.scale('count', {
      nice: true,
    });
    chart.axis('count', {
      label: {
        formatter: (text) => {
          return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
      },
    });
    chart.tooltip({
      showCrosshairs: true,
    });

    chart.line().position('date*count');
    chart.area().position('date*count');
    chart.render();
    chartInstance.current = chart;
  }, []);
  useEffect(() => {
    fetch();
  }, [warehouseId, cur]);

  async function fetch() {
    const res: any = await serviceIndex.getAccess({
      id: warehouseId,
      type,
      date: (cur + 1) as any,
    });
    chartInstance.current?.changeData(res);
    console.log(res);
  }
  const menu = useMemo(() => {
    return (
      <Menu onClick={handleClick}>
        {text.map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
      </Menu>
    );
  }, []);
  function handleClick(event: any) {
    const { key } = event;
    if (cur == key) return;
    setCur(key);
  }
  return (
    <div className={styles.box2}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-${icon}`} />
          {title}
          <div className={styles.fr}>
            <Dropdown overlay={menu}>
              <span>
                {text[cur]}
                <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </div>
        <div id={contentId} className={styles.canvas}></div>
      </div>
    </div>
  );
};
export default AreaBox;
