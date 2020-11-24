import serviceBase from '@/services/base';
import { delay } from 'lodash';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRequest } from 'umi';

export default function useDictModel() {
  const [dict, setDict] = useState<Partial<DICT_TYPE>>({});
  const initFlag = useRef(false);
  const map = useRef<Partial<DICT_MAP>>({});
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const res: any = await serviceBase.getDicByOne(0);
    console.log(res);
    map.current = {};
    res.map((item: any) => {
      map.current[item.value] = item.id;
    });
    initFlag.current = true;
  }

  const getDict = useCallback((key: DICT_STRING) => {
    if (!initFlag.current) {
      delay(() => {
        fetch();
      }, 500);
    } else {
      fetch();
    }
    async function fetch() {
      const v = map.current[key];
      if (typeof v == 'number') {
        const res = await serviceBase.getDicByOne(v);
        setDict((e) => {
          return { ...e, [key]: res };
        });
      }
    }
  }, []);

  return {
    dict,
    init,
    getDict,
  };
}

type DICT_STRING = 'goodsType' | 'goodsState' | 'reportState' | 'ruleState';
type DICT_MAP = {
  [str in DICT_STRING]: number;
};

type DICT_TYPE = {
  [name in DICT_STRING]: { id: string; name: string }[];
};
