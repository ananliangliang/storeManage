// import React, { FC, useEffect, useRef } from 'react';
// import { Chart } from '@antv/g2';

// import styles from '../index.less';

// interface IndexProps {
//   data: {
//     model: string;
//     count: number;
//   }[];
// }

// const GoodsBox: FC<IndexProps> = ({
//   data = [
//     {
//       model: '',
//       value: undefined,
//     },
//   ],
// }) => {
//   const chartInstance = useRef<Chart>();
//   useEffect(() => {
//     const chart = new Chart({
//       container: 'goodsBox',
//       autoFit: true,
//       padding: [0, 40, 10, 100],
//       // height: 500,
//     });
//     chart.data(data);
//     chart.scale({
//       count: {
//         alias: ' ',
//         nice: true,
//       },
//     });
//     chart.axis('model', {
//       title: null,
//       tickLine: null,
//       // line: null,
//       label: {
//         style: {
//           fill: 'rgba(255,255,255,0.85)',
//         },
//       },
//     });

//     chart.axis('count', {
//       label: null,
//       // label: {
//       //   style: {
//       //     fill: 'rgba(255,255,255,0.85)',
//       //   },
//       // },
//       title: {
//         offset: 30,
//         style: {
//           fill: 'rgba(255,255,255,0.85)',
//           fontSize: 12,
//           fontWeight: 300,
//         },
//       },
//       grid: null,
//     });
//     chart.legend(false);
//     chart.coordinate().transpose();
//     chart
//       .interval()
//       .position('model*count')
//       .color('rgba(15,184,233,0.50)')
//       .label('count', {
//         style: {
//           fill: 'rgba(255,255,255,0.85)',
//         },
//         offset: 10,
//       })
//       .state({
//         active: {
//           style: {
//             stroke: null,
//             fill: 'rgb(15,184,233)',
//           },
//         },
//       });

//     chart.interaction('element-active');
//     chart.render();
//     chartInstance.current = chart;
//   }, []);
//   useEffect(() => {
//     if (data.length !== 0) {
//       console.warn(data);
//       chartInstance.current?.changeData(data);
//     } else {
//       chartInstance.current?.changeData([
//         {
//           model: '',
//           value: undefined,
//         },
//       ]);
//     }
//   }, [data]);
//   return (
//     <div className={styles.box2}>
//       <div className={styles.content}>
//         <div className={styles.t}>
//           <span className={`iconfont icon icon-yujing`} />
//           库房物资
//         </div>
//         <div id="goodsBox" className={styles.canvas}></div>
//       </div>
//     </div>
//   );
// };
// export default GoodsBox;
