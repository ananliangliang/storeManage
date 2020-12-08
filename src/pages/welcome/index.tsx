import React, { FC, useEffect } from 'react';
import styles from './index.less';
import welcomBg from '@/assets/welcomBg.png';

interface IndexProps {}

const Index: FC<IndexProps> = (props) => {
  useEffect(() => {
    const root = document.getElementById('root');
    root?.classList.add('hideFoot');
    return () => {
      root?.classList.remove('hideFoot');
    };
  }, []);
  return (
    <>
      <div style={{ width: '300px', height: '300px' }} className={styles.box}></div>
      <img src={welcomBg} alt="" />
    </>
  );
};
export default Index;
