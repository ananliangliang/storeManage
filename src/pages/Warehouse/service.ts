import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { RespWarehouse } from './data';

export function warehouseList(data: ReqList<any>) {
  return post<
    RespList<{
      id: number;
      regionName: string;
      shortName: string;
      mergerName: string;
      address: string;
      orgNo: number;
      imageUrl?: string;
      // children: null;
    }>
  >('/warehouse/list', data);
}

export function warehouseGet(id: string) {
  return getReq('/warehouse/get', { id });
}
export function warehouseGetFloor(data: ReqList<any>) {
  return post('/warehouse/getFloor', data);
}
export function warehouseBatchRemove(ids: string) {
  return post(`/warehouse/batch/remove?ids=${ids}`);
}
export function warehouseOnAddEdit(data: any) {
  return post('/warehouse/onAddEdit', data);
}
export function warehouseRemove(id: string) {
  return post(`/warehouse/remove?id=${id}`);
}
export function warehouseTreeList() {
  return post<RespWarehouse[]>('/warehouse/treeList');
}

export function regionList(
  data: ReqList<{
    warehouse_id: number;
    parent_id: number;
  }>,
) {
  if (data.filter?.warehouse_id) {
    data.filter['level'] = 2;
  }
  return post<
    RespList<{
      id: number;
      regionName: string;
      shortName: string;
      mergerName: string;
      address: string;
      orgNo: number;
      imageUrl?: string;
      // children: null;
    }>
  >('/region/list', data);
}
export function regionGet(id: string) {
  return getReq('/region/get', { id });
}
export function regionBatchRemove(ids: string) {
  return post(`/region/batch/remove?ids=${ids}`);
}
export function regionOnAddEdit(data: any) {
  return post('/region/onAddEdit', data);
}
export function regionRemove(id: string) {
  console.log(id);
  return post(`/region/remove?id=${id}`);
}
