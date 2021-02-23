// import { DownOutlined } from '@ant-design/icons';
// import { Dropdown, Menu } from 'antd';
// import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
// import styles from '../index.less';
// import { Chart, Axis, Tooltip, Area, Line } from 'bizcharts';
// import DataSet from '@antv/data-set';
// import serviceIndex from '@/services';

// interface IndexProps {
//   title: string;
//   icon: string;
//   contentId: string;
//   warehouseId?: string;
//   type: 1 | 2;
// }
// const text = ['一周', '一月'];

// const scale = {
//   timestamp: {
//     type: 'timeCat',
//     mask: 'HH:mm:ss',
//     tickCount: 6,
//   },
//   value: {
//     tickCount: 3,
//   },
// };

// const colors = {
//   ask: 'l (90) 0.5:rgba(0,136,255, 1) 1:rgba(0,136,255, 0)',
//   order: 'l (90) 0.5:rgba(0,231,147, 1) 1:rgba(0,231,147, 0)',
//   pay: 'l (90) 0.5:rgba(255,195,50, 1) 1:rgba(255,195,50, 0)',
// };

// const AreaBox: FC<IndexProps> = ({ title, icon, contentId, warehouseId, type }) => {
//   const [cur, setCur] = useState<0 | 1>(0);

//   useEffect(() => {
//     fetch();
//   }, [warehouseId, cur]);

//   async function fetch() {
//     const res: any = await serviceIndex.getAccess({
//       id: warehouseId,
//       type,
//       date: (cur + 1) as any,
//     });
//     console.log(res);
//   }

//   const menu = useMemo(() => {
//     return (
//       <Menu onClick={handleClick}>
//         {text.map((item, i) => (
//           <Menu.Item key={i}>{item}</Menu.Item>
//         ))}
//       </Menu>
//     );
//   }, []);
//   function handleClick(event: any) {
//     const { key } = event;
//     if (cur == key) return;
//     setCur(key);
//   }
//   return (
//     <div className={styles.box2}>
//       <div className={styles.content}>
//         <div className={styles.t}>
//           <span className={`iconfont icon icon-${icon}`} />
//           {title}
//           <div className={styles.fr}>
//             <Dropdown overlay={menu}>
//               <span>
//                 {text[cur]}
//                 <DownOutlined />
//               </span>
//             </Dropdown>
//           </div>
//         </div>
//         <Chart data={dv2} scale={scale} forceFit padding="auto">
//           <Axis
//             name="date"
//             line={{
//               stroke: '#95D4FF',
//             }}
//             label={{
//               textStyle: {
//                 fill: '#95D4FF',
//               },
//             }}
//             tickLine={{
//               lineWidth: 4,
//               lineCap: 'round',
//               length: 1,
//               stroke: '#95D4FF',
//             }}
//           />
//           <Axis
//             name="count"
//             grid={null}
//             position="left"
//             line={{
//               stroke: '#95D4FF',
//             }}
//             label={{
//               textStyle: {
//                 fill: '#95D4FF',
//                 fontWeight: 'bold',
//               },
//             }}
//           />
//           <Area
//             adjust="stack"
//             color={['type', (type) => colors[type]]}
//             position="timestamp*value"
//           />
//           <Line
//             adjust="stack"
//             color={['type', (type) => colors[type]]}
//             position="timestamp*value"
//           />
//         </Chart>
//       </div>
//     </div>
//   );
// };
// export default AreaBox;
