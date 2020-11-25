import { RespWarehouse } from '@/pages/Warehouse/data';
import { warehouseTreeList } from '@/pages/Warehouse/service';
import { DataNode } from 'antd/lib/tree';
import { useState, useCallback } from 'react';

type posType = {
  warehouse?: string;
  floor?: string;
  partition?: string;
  goods?: string;
};

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
    const { node, pos } = formate(res);
    setWarehouse(node);
    setPos(pos);
    setLoading(false);
  }, []);

  return {
    warehouse,
    loading,
    init,
    pos,
  };
}

function formate(list: RespWarehouse[], pid?: string) {
  const pos = {};
  const node = inner(list, pid);
  return {
    pos,
    node,
  };

  function inner(list: RespWarehouse[], pid?: string): DataNode[] {
    return list.map((item, idx) => {
      let newList: any[] = [];
      const key = pid ? pid + '_' + idx : idx + '';

      if (idx === 0) {
        const type = getType(item);
        pos[type] = key;
      }
      if (item.children.length > 0) {
        newList = inner(item.children as any, key);
      }
      if (newList.length > 0) {
        return {
          ...item,
          title: item.mergerName,
          key: key,
          children: newList,
        };
      }
      return {
        ...item,
        title: item.mergerName,
        key: key,
      };
    });
  }
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

export function getWarehouse(treeData: DataNode[], warehouseId: number) {
  treeData.map((item) => {
    getType(item);
  });
}
export function getFloor(treeData: DataNode[], floorId: number) {}
export function getPart(treeData: DataNode[], partId: number) {}

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
        }
      default:
        throw '错误的数据';
    }
  } else {
    return 'org';
  }
}
