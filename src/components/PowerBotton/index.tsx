import { Button, Divider } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { FC } from 'react';
import { useModel } from 'umi';

interface IndexProps extends ButtonProps {
  allowStr: string;
  showDivider?: boolean;
}

const PowerBotton: FC<IndexProps> = (props) => {
  const { allowStr, showDivider, ...btnProps } = props;
  const auth = useModel('power', (state) => state.curAuth);
  if (REACT_APP_ENV === 'dev' || auth[allowStr]) {
    return (
      <>
        <Button {...btnProps} />
        {showDivider && <Divider type="vertical" />}
      </>
    );
  }
  return null;
};
export default PowerBotton;
