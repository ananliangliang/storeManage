import { RespWarehouse } from '@/pages/Warehouse/data';
import { warehouseTreeList } from '@/pages/Warehouse/service';
import { DataNode } from 'antd/lib/tree';
import { useState, useCallback } from 'react';

type posType = {
  [key in posKey]?: string;
};

type posKey = 'org' | 'warehouse' | 'floor' | 'partition' | 'goods';

export default function useWarehouseModel() {
  const [warehouse, setWarehouse] = useState<DataNode[]>([]);
  const [pos, setPos] = useState<posType>({});
  const [loading, setLoading] = useState(false);

  const init = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    console.log('init');
    const res = await warehouseTreeList();
    console.log(res);
    const { node, pos } = warehouseTreeFormate(res);
    setWarehouse(node);
    setPos(pos);
    setLoading(false);
  }, []);

  const keyFindParent = useCallback(
    (key: string, parentName: posKey) => {
      const keyArr = key.split('_');
      console.log(pos);

      if (Object.prototype.hasOwnProperty.call(pos, parentName)) {
        const posKey = pos[parentName] ? pos[parentName] + '_0' : '0';
        const posArr = posKey.split('_');
        if (keyArr.length >= posArr.length) {
          const item = keyFindItem(warehouse, keyArr.slice(0, posArr.length).join('_'));
          console.log(item);
          return item;
        }
      }
      throw '错误的父名称';
    },
    [warehouse, pos],
  );

  return {
    warehouse,
    loading,
    keyFindParent,
    init,
    pos,
  };
}

export function warehouseTreeFormate(list: RespWarehouse[], pid?: string) {
  const pos = {};
  const node = inner(list, pid);
  return {
    pos,
    node,
  };

  function inner(list: RespWarehouse[], pid?: string): DataNode[] {
    return list.map((item, idx) => {
      let newList: any[] = [];
      const p = pid ? pid + '_' + idx : idx + '';

      if (idx === 0) {
        const type = getType(item);
        pos[type] = p;
      }
      if (item.children.length > 0) {
        newList = inner(item.children as any, p);
      }
      if (newList.length > 0) {
        return {
          ...item,
          title: item.mergerName,
          value: item.id,
          label: item.mergerName,
          key: p,
          pos: p,
          children: newList,
        };
      }
      return {
        ...item,
        pos: p,
        value: item.id,
        label: item.mergerName,
        title: item.mergerName,
        key: p,
      };
    });
  }
}

export function keyFindItem(treeData: DataNode[], key: string): DataNode {
  const arr = key.split('_');
  return arr.reduce((previousValue, item, idx) => {
    if (arr.length - 1 > idx) {
      if (previousValue[item] && previousValue[item].children) {
        return previousValue[item].children;
      }
    }
    return previousValue[item];
  }, treeData) as any;
}

export function keyFindChild(treeData: DataNode[], key: string) {
  const arr = key.split('_');
  return arr.reduce((previousValue, item) => {
    if (previousValue[item] && previousValue[item].children) {
      return previousValue[item].children;
    }
    return previousValue[item] || [];
  }, treeData);
}

export function dataNode2Select(treeData: DataNode[]) {
  const map = new Map();
  treeData.map((item: any) => {
    map.set(item.value, item.title);
  });
  return map;
}

export function keyFindObj(treeData: DataNode[], key: string) {
  const arr = key.split('_');
  return arr.reduce((previousValue, item, idx) => {
    if (arr.length - 1 > idx) {
      if (previousValue[item] && previousValue[item].children) {
        return previousValue[item].children;
      }
    }
    return previousValue[item] || [];
  }, treeData);
}

function getType(data: any) {
  if (data.flg) {
    switch (data.flg) {
      case 'org':
        return 'warehouse';
      case 'warehouse':
        return 'floor';
      case 'region':
        if (data.level == 2) {
          return 'partition';
        } else if (data.level == 3) {
          return 'goods';
        } else if (data.level == 4) {
          return 'shelf';
        } else if (data.level == 5) {
          return 'grid';
        }
      default:
        throw '错误的数据';
    }
  } else {
    return 'org';
  }
}
