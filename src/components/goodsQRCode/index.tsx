import React, { FC } from 'react';
import QRCode from 'qrcode.react';

import styles from './index.less';

interface IndexProps {
  codeNo: string;
  name: string;
}

const Index: FC<IndexProps> = ({ codeNo, name }) => {
  return (
    <div className={styles.content}>
      <QRCode
        value={JSON.stringify({
          code_no: codeNo,
        })} //value参数为生成二维码的链接
        size={200} //二维码的宽高尺寸
        fgColor="#000000" //二维码的颜色
      />
      <h1>{name}</h1>
    </div>
  );
};
export default Index;
