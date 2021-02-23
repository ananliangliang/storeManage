import { Button, Input } from 'antd';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
interface IndexProps {
  searchVal?: string;
  onSearch: (val: string) => void;
  width?: number;
  placeholder?: string;
  className?: string;
}

const Index: FC<IndexProps> = ({ searchVal, onSearch, placeholder = '请输入', className }) => {
  const [val, setVal] = useState('');
  useEffect(() => {
    setVal(searchVal || '');
  }, [searchVal]);
  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    setVal(event.target['value']);
  }
  function handleSearch() {
    onSearch(val);
  }
  return (
    <div className={classNames(styles.search, className)}>
      <Input
        value={val}
        placeholder={placeholder}
        onChange={handleInput}
        onPressEnter={handleSearch}
        allowClear
      />
      <Button className={styles.btn} onClick={handleSearch}>
        搜索
      </Button>
    </div>
  );
};
export default Index;
