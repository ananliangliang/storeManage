import { Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
//import styles from './statusSwitch.less'

interface StatusSwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => Promise<void> | void;
  checkedText?: string;
  unCheckedText?: string;
}

const StatusSwitch: FC<StatusSwitchProps> = ({
  checked,
  disabled,
  onChange,
  checkedText = '开启',
  unCheckedText = '关闭',
}) => {
  const [_checked, setChecked] = useState(checked);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setChecked(_checked);
  }, [checked]);

  async function handleChange(checked: boolean) {
    setLoading(true);
    try {
      await onChange(checked);
      setChecked(checked);
    } catch (error) {}
    setLoading(false);
  }

  return (
    <Switch
      checked={_checked}
      disabled={disabled}
      checkedChildren={checkedText}
      unCheckedChildren={unCheckedText}
      loading={loading}
      onChange={handleChange}
    />
  );
};
export default StatusSwitch;
