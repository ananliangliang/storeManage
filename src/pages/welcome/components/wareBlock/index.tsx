import { Spin } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';
import styles from '../style.less';

interface IndexProps {
  wareName: string;
  address: string;
  shelfNum: number;
  goodsNum: number;
  outNum: number;
  inNum: number;
  loading: boolean;
}

const Index: FC<IndexProps> = ({
  wareName,
  address,
  shelfNum,
  goodsNum,
  outNum,
  inNum,
  loading,
}) => {
  return (
    <Spin spinning={loading}>
      <div className={styles.wareBlock}>
        <div className={styles.bg}></div>
        <div className={styles.box}>
          <div className={styles.header}>
            <div className={styles.title}>
              {wareName ? (
                <>
                  {wareName} <span>位置:{address} </span>
                </>
              ) : (
                '暂无选中仓库'
              )}
            </div>
          </div>
          <div className={classNames(styles.content, styles.wareFlex)}>
            <div>
              <span className={classNames('iconfont icon-goods_shelves1', styles.icon)} />
              <div className={styles.n}>
                <div className={styles.num}>{shelfNum}</div>
                <div>货架总数</div>
              </div>
            </div>
            <div>
              <span className={classNames('iconfont icon-goods', styles.icon)} />
              <div className={styles.n}>
                <div className={styles.num}>{goodsNum}</div>
                <div>总物资数</div>
              </div>
            </div>
            <div>
              <span className={classNames('iconfont icon-lend', styles.icon)} />
              <div className={styles.n}>
                <div className={styles.num}>{outNum}</div>
                <div>今日出库数</div>
              </div>
            </div>
            <div>
              <span className={classNames('iconfont icon-Warehousing', styles.icon)} />
              <div className={styles.n}>
                <div className={styles.num}>{inNum}</div>
                <div>今日入库数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default Index;
