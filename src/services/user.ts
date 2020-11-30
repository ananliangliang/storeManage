import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceUser = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/user/list', params, true);
  },
  get(id: string) {
    return getReq(`/user/get?id=${id}`, { id }, true);
  },

  onAddEdit(data: any) {
    return post('/user/onAddEdit', data, true);
  },
  // remove(id: string) {
  //   return post(`/receive/remove?id=${id}`);
  // },
  // batchRemove(ids: string) {
  //   return post(`/receive/batch/remove?ids=${ids}`);
  // },
  treeList() {
    return post<RespGoodsModel[]>('/user/treeList', {}, true);
  },
};

export default serviceUser;
