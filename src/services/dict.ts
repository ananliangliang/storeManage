import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceDict = {
  list(params: any = {}) {
    return proTableReq<any>('/dictionaries/list', params, true);
  },
  get(id: string) {
    return getReq('/dictionaries/get', { id });
  },
  batchRemove(ids: string) {
    return post(`/dictionaries/batch/remove?ids=${ids}`, undefined, true);
  },
  onAddEdit(data: any) {
    return post('/dictionaries/onAddEdit', data, true);
  },
  remove(id: string) {
    return post(`/dictionaries/remove`, { id }, true);
  },
};

export default serviceDict;
