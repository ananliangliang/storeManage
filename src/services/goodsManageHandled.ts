import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsManageHandled = {
  list(params: any = {}) {
    return proTableReq<any>('/manageHandled/list', params);
  },
  get(id: string) {
    return getReq('/manageHandled/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/manageHandled/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/manageHandled/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/manageHandled/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/manageHandled/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/manageHandled/treeList');
  },
};

export default serviceGoodsManageHandled;
