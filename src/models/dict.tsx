import serviceBase from '@/services/base';
import { delay } from 'lodash';
import { useState, useCallback, useRef, useEffect } from 'react';
/**
 * @getDict 写做 get 实际上是 fetch
 *
 * @export
 * @returns
 */
export default function useDictModel() {
  const [dict, setDict] = useState<Partial<DICT_TYPE>>({});
  const initFlag = useRef(false);
  const map = useRef<Partial<DICT_MAP>>({});

  const init = useCallback(() => {
    (async function () {
      const res: any = await serviceBase.getDicByOne(0);
      console.log(res);
      map.current = { _allType: 0 };
      res.map((item: any) => {
        map.current[item.value] = item.id;
      });
      setDict((e) => {
        return { ...e, _allType: res };
      });
      initFlag.current = true;
    })();
  }, []);

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

export function dict2select(list?: { id: string; name: string }[]) {
  const map = new Map();
  if (list) {
    list.map((item) => {
      map.set(item.id, item.name);
    });
  }
  return map;
}

/**
 * @_allType 所有类型
 * @goodsType    物资类型
 * @goodsState   物资状态
 * @reportState  上报状态
 * @ruleState    状态
 * @manageType   报损类型
 * @handleType   处理方式
 */
type DICT_STRING =
  | '_allType'
  | 'goodsType'
  | 'goodsState'
  | 'reportState'
  | 'ruleState'
  | 'manageType'
  | 'handleType';
type DICT_MAP = {
  [str in DICT_STRING]: number;
};

type DICT_TYPE = {
  [name in DICT_STRING]: { id: string; name: string; value: string; parentId: string }[];
};
