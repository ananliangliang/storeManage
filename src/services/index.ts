import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceIndex = {
  getAccess(params: { id?: string; type: 1 | 2; date: 1 | 2 }) {
    return post('/index/getAccess', params);
  },
  getGoodsCount(id?: string) {
    return post('/index/getGoodsCount', { id });
  },
  getMassageLog(param: any = {}) {
    return proTableReq('/index/getMassageLog', param);
  },

  getWarehouseList(name?: string) {
    return post<{
      kfList: TWareItem[];
      lwwz: number;
      zwwz: number;
    }>('/index/getWarehouseList', { name });
  },
  getWarehouseDetail(id?: number) {
    return post('/index/getWarehouseDetail', { id });
  },

  getHjList(param: any = {}) {
    return proTableReq('/index/getHjList', param);
  },

  getFq(id: number) {
    return post('/index/getFq', { id });
  },

  getHjDetail(id?: number) {
    return post('/index/getHjDetail', { id });
  },
};

export default serviceIndex;

export interface TWareItem {
  address: string;
  id: number;
  mergerName: string;
  orgName: string;
  orgNo: string;
  regionName: string;
}
