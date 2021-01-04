import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceMessageLog = {
  list(params: any = {}) {
    return proTableReq<any>('/messagelog/list', params);
  },
  get(id: string) {
    return getReq('/messagelog/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/messagelog/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/messagelog/batch/remove?ids=${ids}`, null);
  },
  onAddEdit(data: any) {
    return post('/messagelog/onAddEdit', data);
  },
  onEditUser(data: any) {
    return post('/messagelog/onEditUser', data);
  },
  remove(id: string) {
    return post(`/messagelog/remove?id=${id}`, null);
  },
};

export default serviceMessageLog;
