import { DataNode } from 'antd/lib/tree';

export function getOrgData(treeData: any[]) {
  return treeData.map((item: any) => {
    const newItem = { ...item };
    console.log(newItem);
    delete newItem.children;
    return newItem;
  });
}


