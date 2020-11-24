import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceDict = {
  list(params: any = {}) {
    return proTableReq<any>('/model/list', params);
  },
  get(id: string) {
    return getReq('/model/get', { id });
  },
  batchRemove(ids: string) {
    return post(`/model/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/model/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/model/remove?id=${id}`);
  },
};

export default serviceDict;
