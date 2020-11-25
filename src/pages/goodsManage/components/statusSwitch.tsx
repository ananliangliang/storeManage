import { Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
//import styles from './statusSwitch.less'

interface StatusSwitchProps {
  checked?: boolean;
  onChange: (checked: boolean) => Promise<void> | void;
}

const StatusSwitch: FC<StatusSwitchProps> = ({ checked, onChange }) => {
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
      checkedChildren="开启"
      unCheckedChildren="关闭"
      loading={loading}
      onChange={handleChange}
    />
  );
};
export default StatusSwitch;
