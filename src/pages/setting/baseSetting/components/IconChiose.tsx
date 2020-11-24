import { useState } from 'react';
import React from 'react';
import IconModal from '@/components/Modals/IconModal';
import styles from '../Menu.less';

const IconChiose = ({ value, onChange }: { value?: string; onChange?: (data: any) => void }) => {
  const [show, setShow] = useState(false);
  const handleChange = (icon: string) => {
    onChange && onChange(icon);
    setShow(false);
  };
  return (
    <div className={styles.icons}>
      <IconModal visible={show} onChange={handleChange} onClose={() => setShow(false)} />
      <div
        className={styles.full}
        onClick={() => {
          setShow(true);
        }}
      ></div>
      <span className={`anticon`}>
        <span className={`${value}`}></span>
      </span>
    </div>
  );
};

export default IconChiose;
