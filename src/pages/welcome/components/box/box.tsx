import React, { FC } from 'react';
import styles from '../index.less';
interface BoxProps {
  title: string;
  number: number;
  icon: string;
  onClick?: () => void;
}

const Box: FC<BoxProps> = ({ title, number, icon, onClick }) => {
  return (
    <div className={styles.box} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.t}>
          <span className={`iconfont icon icon-${icon}`} />
          {title}
        </div>
        <div className={styles.btn}>
          <span className={styles.num}>{number}</span>件
        </div>
      </div>
    </div>
  );
};
export default Box;
