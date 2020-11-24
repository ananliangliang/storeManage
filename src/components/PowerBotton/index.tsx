import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { FC } from 'react';
//import styles from './index.less'

interface IndexProps extends ButtonProps {
  allowStr?: string;
}

const Index: FC<IndexProps> = (props) => {
  if (process.env.NODE_ENV === 'development') {
    return <Button {...props} />;
  } else {
    // 权限判断
    return <></>;
  }
};
export default Index;
