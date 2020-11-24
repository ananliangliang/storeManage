import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { RespWarehouse } from './warehouseI';

const serviceWarehouse = {
  list(data: ReqList) {
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
  },
  get(id: string) {
    return getReq('/warehouse/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/warehouse/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/warehouse/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/warehouse/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/warehouse/remove?id=${id}`);
  },
  treeList() {
    return post<RespWarehouse[]>('/warehouse/treeList');
  },
};

export default serviceWarehouse;
