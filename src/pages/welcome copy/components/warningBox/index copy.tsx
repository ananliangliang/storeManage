// import React, { FC, useEffect, useRef } from 'react';
// import styles from '../index.less';
// import DataSet from '@antv/data-set';
// import { Chart } from '@antv/g2';
// interface WarningBoxProps {
//   warehouseId?: string;
//   data: { name: string; type: string; value: number }[];
// }

// const colorMap = ['#14d9e7', '#62daab', '#657798', '#fc911f'];

// const WarningBox: FC<WarningBoxProps> = ({ data = [] }) => {
//   const inner = useRef<Chart>();
//   const outter = useRef<any>();
//   useEffect(() => {
//     const ds = new DataSet();
//     const dv = ds.createView();
//     dv.source(data).transform({
//       type: 'percent',
//       field: 'value',
//       dimension: 'type',
//       as: 'percent',
//     });
//     const chart = new Chart({
//       container: 'warnning',
//       autoFit: true,
//     });
//     chart.data(dv.rows);
//     chart.legend(false);
//     chart.coordinate('theta', {
//       radius: 0.5,
//       innerRadius: 0.3,
//     });
//     chart.tooltip({
//       showMarkers: false,
//       itemTpl: `
//       <div style="margin-bottom: 10px;list-style:none;">
//       <span style="background-color:{color};" class="g2-tooltip-marker"></span>
//       {name}: {value}
//       </div>`,
//     });
//     let idx = 0;
//     chart
//       .interval()
//       .adjust('stack')
//       .position('percent')
//       .color('type', (val) => {
//         console.log(val);
//         return colorMap[idx++ % colorMap.length];
//       })
//       .style({
//         stroke: 'white',
//         lineWidth: 1,
//       })
//       .tooltip('type*value', (type, v) => {
//         return {
//           name: type,
//           value: v,
//         };
//       })
//       .label('name', {
//         offset: 0,
//         style: {
//           fill: 'white',
//           shadowBlur: 2,
//           shadowColor: 'rgba(0, 0, 0, .45)',
//         },
//       });

//     const ds2 = new DataSet();
//     const dv2 = ds2.createView();
//     dv2.source(data).transform({
//       type: 'percent',
//       field: 'value',
//       dimension: 'name',
//       as: 'percent',
//     });
//     const outterView = chart.createView();
//     outterView.data(dv2.rows);
//     outterView.coordinate('theta', {
//       innerRadius: 0.5 / 0.9,
//       radius: 0.9,
//     });
//     let idx2 = 0;
//     outterView
//       .interval()
//       .adjust('stack')
//       .position('percent')
//       .color('type*name', (type, name) => colorMap[idx2++ % colorMap.length])
//       .style({
//         stroke: 'white',
//         lineWidth: 1,
//       })
//       .tooltip('name*value', (name, v) => {
//         return {
//           name: name,
//           value: v,
//         };
//       })
//       .label('name', {
//         offset: -10,
//         style: {
//           fill: 'white',
//           shadowBlur: 2,
//           shadowColor: 'rgba(0, 0, 0, .45)',
//         },
//       });
//     chart.interaction('element-active');
//     chart.render();
//     inner.current = chart;
//     outter.current = outterView;
//   }, []);
//   useEffect(() => {
//     const ds = new DataSet();
//     const dv = ds.createView();
//     console.log(data);
//     dv.source(data).transform({
//       type: 'percent',
//       field: 'value',
//       dimension: 'type',
//       as: 'percent',
//     });
//     const ds2 = new DataSet();
//     const dv2 = ds2.createView();
//     dv2.source(data).transform({
//       type: 'percent',
//       field: 'value',
//       dimension: 'name',
//       as: 'percent',
//     });
//     console.log(dv.rows, dv2.rows);
//     inner.current?.changeData(dv.rows);
//     outter.current?.changeData(dv2.rows);
//   }, [data]);
//   return (
//     <div className={styles.box4}>
//       <div className={styles.content}>
//         <div className={styles.t}>
//           <span className={`iconfont icon icon-yujing`} />
//           物资预警
//         </div>
//         <div id="warnning" className={styles.canvas}></div>
//       </div>
//     </div>
//   );
// };
// export default WarningBox;
