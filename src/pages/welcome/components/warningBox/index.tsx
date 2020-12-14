import React, { FC, useMemo } from 'react';
import styles from '../index.less';
import DataSet from '@antv/data-set';
import { Chart, Interval, Tooltip, Legend, View, Axis, Coordinate } from 'bizcharts';
interface WarningBoxProps {
  warehouseId?: string;
  data: { name: string; type: string; value: number }[];
}
const DataView = DataSet.DataView;

const colorMap = ['#14d9e7', '#62daab', '#657798', '#fc911f'];

const WarningBox: FC<WarningBoxProps> = ({ data = [] }) => {
  const dv = useMemo(() => {
    console.log(data);
    const d1 = new DataView();
    d1.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'type',
      as: 'percent',
    });
    return d1;
  }, [data]);
  const dv1 = useMemo(() => {
    const d1 = new DataView();
    d1.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    return d1;
  }, [data]);
  return (
    <div className={styles.box4}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-yujing`} />
          物资预警
        </div>
        <Chart
          data={dv.rows}
          autoFit
          scale={{
            percent: {
              formatter: (val: any) => {
                val = `${(val * 100).toFixed(2)}%`;
                return val;
              },
            },
          }}
        >
          <Coordinate type="theta" radius={0.6} innerRadius={0.3} />
          <Axis visible={false} />
          <Legend visible={false} />
          <Tooltip showTitle={true} />
          <Interval
            position="percent"
            adjust="stack"
            color="type"
            element-highlight
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            label={[
              'type',
              {
                offset: -15,
              },
            ]}
          />
          <View data={dv1.rows}>
            <Coordinate type="theta" radius={0.9} innerRadius={0.6 / 0.9} />
            <Interval
              position="percent"
              adjust="stack"
              color={['name', colorMap]}
              element-highlight
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              label={[
                'name',
                {
                  style: {
                    fill: '#fff',
                  },
                },
              ]}
            />
          </View>
        </Chart>
      </div>
    </div>
  );
};
export default WarningBox;
