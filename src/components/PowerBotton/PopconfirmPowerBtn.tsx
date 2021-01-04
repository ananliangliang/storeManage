import { Divider, Popconfirm } from 'antd';
import Button, { ButtonProps } from 'antd/lib/button';
import React, { FC } from 'react';
import { useModel } from 'umi';
//import styles from './PopconfirmPowerBtn.less'

interface PopconfirmPowerBtnProps extends ButtonProps {
  allowStr: string;
  showDivider?: boolean;
  title: string;
  onConfirm?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
}

const PopconfirmPowerBtn: FC<PopconfirmPowerBtnProps> = (props) => {
  const auth = useModel('power', (state) => state.curAuth);
  const { allowStr, showDivider, title, onConfirm, ...btnProps } = props;
  if (REACT_APP_ENV === 'dev' || auth[allowStr]) {
    return (
      <>
        <Popconfirm title={title} onConfirm={onConfirm}>
          <Button {...btnProps} />
        </Popconfirm>
        {showDivider && <Divider type="vertical" />}
      </>
    );
  }
  return null;
};
export default PopconfirmPowerBtn;
