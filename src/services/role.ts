import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceRole = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/role/list', params, true);
  },
  get(id: string) {
    return getReq(`/role/get?id=${id}`, { id }, true);
  },

  onAddEdit(data: any) {
    return post('/role/onAddEdit', data, true);
  },
  remove(id: string) {
    return post(`/role/remove?id=${id}`);
  },
  batchRemove(ids: string) {
    return post(`/role/batch/remove?ids=${ids}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/role/treeList', {}, true);
  },
};

export default serviceRole;
