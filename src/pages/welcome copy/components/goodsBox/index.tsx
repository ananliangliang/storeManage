import React, { FC, useMemo } from 'react';
import { Chart, Coordinate, Interval, Interaction } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from '../index.less';

interface IndexProps {
  data: {
    model: string;
    count: number;
  }[];
}

const GoodsBox: FC<IndexProps> = ({ data = [] }) => {
  const dv = useMemo(() => {
    const ds = new DataSet();
    data.map((item) => {
      item['总数'] = item.count;
    });
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: 'sort',
      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return a['总数'] - b['总数'];
      },
    });
    return dv;
  }, [data]);

  return (
    <div className={styles.box2}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-yujing`} />
          库房物资
        </div>
        <Chart data={dv.rows} autoFit padding={[0, 40, 10, 100]}>
          <Coordinate transpose />
          <Interval
            position="model*总数"
            color="rgba(15,184,233,0.50)"
            label={[
              '总数',
              {
                style: {
                  fill: 'rgba(255,255,255,0.85)',
                },
                offset: 10,
              },
            ]}
            state={{
              active: {
                style: {
                  stroke: null,
                  fill: 'rgb(15,184,233)',
                },
              },
            }}
          />
          <Interaction type="element-active" />
        </Chart>
      </div>
    </div>
  );
};
export default GoodsBox;
