import React, { FC, useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
//import styles from './EleRoom.less'

export type tOption = {
  id: string;
  name: string;
};
interface SearchSelectProps {
  request: (search: string) => Promise<tOption[]>;
  effectTime?: number;
  fetchFlag?: any;
  mode?: 'multiple' | 'tags';
  onChange?: (value: any, option: any) => void;
  defaultOpt?: tOption[];
  value?: string | string[];
  initDelay?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: any;
}

const Option = Select.Option;
const SearchSelect: FC<SearchSelectProps> = ({
  effectTime = 800,
  request,
  fetchFlag = 0,
  mode,
  className,
  disabled,
  placeholder = '请选择',
  defaultOpt,
  onChange,
  value,
}) => {
  const [opt, setOpt] = useState<tOption[]>(defaultOpt || []);
  const [_value, setValue] = useState(() => {
    if (value) {
      if (typeof value === 'object') {
        return value.map((item) => item + '');
      } else {
        return value + '';
      }
    }
    return undefined;
  });
  const [loading, setLoading] = useState(false);
  const time = useRef<number>();
  const searchV = useRef<string>();
  const flag = useRef(0);

  const fetch = () => {
    handleSearch('');
    searchV.current = undefined;
  };

  const handleSearch = (str: string) => {
    if (searchV.current === str && str !== '') {
      clearTimeout(time.current);
      return;
    }
    setLoading(true);
    if (time.current) clearTimeout(time.current);
    time.current = window.setTimeout(async () => {
      try {
        searchV.current = str;
        let temp: tOption[] = [];
        if (_value) {
          if (flag.current !== fetchFlag) {
            flag.current = fetchFlag;
            setValue(typeof value == 'object' ? [] : '');
            temp = [];
          } else {
            if (typeof value == 'object') {
              temp = opt.filter((item) => _value.includes(item.id + ''));
            } else {
              temp = opt.filter((item) => item.id == _value + '');
            }
          }
        }

        let obj = {};
        const res = (await request(str)).concat(temp);
        const newOpt = res.reduce((cur: tOption[], next) => {
          !obj[next.id] && (obj[next.id] = true && cur.push(next));
          return cur;
        }, []);
        setOpt(newOpt);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }, effectTime);
  };

  useEffect(() => {
    if (value && opt.length == 0) {
      setOpt(defaultOpt || []);
    }
    if (value) {
      if (typeof value === 'object') {
        setValue(value.map((item) => item + ''));
      } else {
        setValue(value + '');
      }
    } else {
      setValue(undefined);
    }
  }, [value]);
  useEffect(() => {
    setOpt(defaultOpt || []);
  }, [defaultOpt]);
  const change = (value: string, option: any) => {
    if (option) {
      const o = option.length
        ? option.map((item: any) => {
            return {
              id: item.key,
              name: item.name,
            };
          })
        : [{ id: option.key, name: option.name }];
      onChange && onChange(value, o);
    } else {
      onChange && onChange(null, []);
    }
  };
  const options = opt.map((item: tOption) => (
    <Option key={item.id + ''} value={item.id + ''} name={item.name}>
      {item.name}
    </Option>
  ));

  const handleFocus = () => {
    if (flag.current !== fetchFlag) {
      fetch();
    }
  };
  return (
    <Select
      mode={mode}
      className={className}
      placeholder={placeholder}
      showSearch
      allowClear
      loading={loading}
      value={_value as string}
      filterOption={false}
      onFocus={handleFocus}
      onSearch={handleSearch}
      onChange={change}
      disabled={disabled}
      notFoundContent={null}
    >
      {options}
    </Select>
  );
};
export default SearchSelect;
