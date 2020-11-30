import serviceGoodsModel from '@/services/goodsModel';
import { RespGoodsModel } from '@/services/goodsModelI';
import { DataNode } from 'antd/lib/tree';
import { useState, useCallback } from 'react';

type posType = {
  warehouse?: string;
  floor?: string;
  partition?: string;
  goods?: string;
};

export default function useGoodsKindModel() {
  const [goodsKind, setGoodsKind] = useState<DataNode[]>([]);
  const [pos, setPos] = useState<posType>({});
  const [loading, setLoading] = useState(false);

  const init = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const res = await serviceGoodsModel.treeList();
    const { node, pos } = formate(res, '0');
    setGoodsKind(node);
    setPos(pos);
    setLoading(false);
  }, []);

  return {
    goodsKind,
    loading,
    init,
    pos,
  };
}

function formate(list: RespGoodsModel[], pid?: string) {
  const pos = {};
  const node = inner(list, pid);
  return {
    pos,
    node,
  };

  function inner(list: RespGoodsModel[], pid?: string): DataNode[] {
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
          title: item.goods,
          key: item.id,
          pos: p,
          value: item.id,
          children: newList,
        };
      }
      return {
        ...item,
        title: item.goods,
        value: item.id,
        pos: p,
        key: item.id,
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
