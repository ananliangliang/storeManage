import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Spin } from 'antd';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.less';
import { Chart, Tooltip, Legend, Point, Line, Interval } from 'bizcharts';
import serviceIndex from '@/services';
import { debounce } from 'lodash';

interface IndexProps {
  title: string;
  icon: string;
  warehouseId?: string;
  fetchFlag: boolean;
}
const text = ['最近一周', '最近一月'];
const scale = {
  date: {
    // range: [0, 1],
    tickCount: 10,
    type: 'timeCat',
  },
  in: {
    nice: true,
  },
  out: {
    nice: true,
  },
};

const colors = ['#59d0ff', '#e8771b'];

const AreaBox: FC<IndexProps> = ({ title, icon, fetchFlag, warehouseId }) => {
  const [cur, setCur] = useState<0 | 1>(0);
  const chartIns = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (fetchFlag) {
      fetch();
    }
  }, [warehouseId, cur, fetchFlag]);

  useEffect(() => {
    const resize = debounce(() => {
      if (box.current) {
        const { clientHeight } = box.current;
        setHeight(clientHeight - 25);
      }
    }, 300);
    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const [outList, inList] = (await Promise.all([
        serviceIndex.getAccess({
          id: warehouseId,
          type: 1,
          date: (cur + 1) as any,
        }),
        serviceIndex.getAccess({
          id: warehouseId,
          type: 2,
          date: (cur + 1) as any,
        }),
      ])) as [any[], any[]];
      inList.map((item: any) => {
        item['入库'] = item.count;
        item['出库'] = 0;
      });
      outList.map((item: any) => {
        const res = inList.find((j) => j.date === item.date);
        if (res) {
          res['出库'] = item.count;
        } else {
          inList.push({
            ...item,
            入库: 0,
            出库: item.count,
          });
        }
      });
      inList.sort((a, b) => (a.date > b.date ? 1 : -1));
      console.log(inList);
      setData(inList);
    } catch (error) {}
    setLoading(false);
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
    console.log(key, cur);
    setCur(key);
  }
  return (
    <Spin spinning={loading}>
      <div className={styles.box5}>
        <div className={styles.content} ref={box}>
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
          <Chart
            scale={scale}
            // autoFit
            autoFit
            height={height}
            data={data}
            onGetG2Instance={(chart: any) => {
              chartIns.current = chart;
              // chartIns.current.on('interval:mouseenter', (e) => {
              //   console.log(chartIns);
              //   chartIns.current.geometries.forEach((g) => {
              //     if (g.type === 'interval') {
              //       (g.getShapes() || []).forEach((s) => {
              //         s.set('origin_fill', s.get('attrs').fill);
              //         s.attr('fill', 'red');
              //       });
              //     }
              //   });
              // });
              // chartIns.current.on('interval:mouseleave', (e) => {
              //   console.log(chartIns);
              //   chartIns.current.geometries.forEach((g) => {
              //     if (g.type === 'interval') {
              //       (g.getShapes() || []).forEach((s) => {
              //         s.attr('fill', s.get('origin_fill'));
              //       });
              //     }
              //   });
              // });
            }}
          >
            {/*  如需使用单轴
        <Axis name="waiting" visible={true} />
        <Axis name="people" visible={false} />
        */}
            <Legend
              custom={true}
              position="right-top"
              allowAllCanceled={true}
              title={{
                style: {
                  fill: '#fff',
                },
              }}
              itemName={{
                style: { fill: '#fff' },
              }}
              items={[
                {
                  value: '入库',
                  name: '入库',

                  marker: {
                    symbol: 'square',
                    style: { fill: colors[0], r: 5 },
                  },
                },
                {
                  value: '出库',
                  name: '出库',
                  marker: {
                    symbol: 'hyphen',
                    style: { stroke: colors[1], r: 5, lineWidth: 3 },
                  },
                },
              ]}
              onChange={(ev) => {
                if (!ev) return;
                const item = ev.item;
                const value = item.value;
                const checked = !item.unchecked;
                const geoms = chartIns.current.geometries;

                for (let i = 0; i < geoms.length; i++) {
                  const geom = geoms[i];

                  if (geom.getYScale().field === value) {
                    if (checked) {
                      geom.show();
                    } else {
                      geom.hide();
                    }
                  }
                }
              }}
            />
            <Tooltip shared />
            <Interval position="date*入库" color={colors[0]} />
            <Line position="date*出库" color={colors[1]} size={3} shape="smooth" />
            <Point position="date*出库" color={colors[1]} size={3} shape="circle" />
          </Chart>{' '}
        </div>
      </div>
    </Spin>
  );
};
export default AreaBox;
