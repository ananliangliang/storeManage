import React from 'react';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';
import temp from '@/assets/temp.jpg';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <>
    <img src={temp} style={{ width: '100%' }} />
  </>
);
