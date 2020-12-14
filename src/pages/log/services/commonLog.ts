import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceCommonLog = {
  list(params: any = {}) {
    return proTableReq<any>('/commonlog/list', params, true);
  },
  get(id: string) {
    return getReq('/commonlog/get', { id }, true);
  },
  getFloor(data: ReqList<any>) {
    return post('/commonlog/getFloor', data, true);
  },
  batchRemove(ids: string) {
    return post(`/commonlog/batch/remove?ids=${ids}`, null, true);
  },
  onAddEdit(data: any) {
    return post('/commonlog/onAddEdit', data, true);
  },
  remove(id: string) {
    return post(`/commonlog/remove?id=${id}`, null, true);
  },
};

export default serviceCommonLog;
