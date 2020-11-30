import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceUserProduct = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/userProduct/list', params, true);
  },
  get(id: string) {
    return getReq(`/userProduct/get?id=${id}`, { id }, true);
  },

  onAddEdit(data: any) {
    return post('/userProduct/onAddEdit', data, true);
  },
  remove(id: string) {
    return post(`/userProduct/remove?id=${id}`);
  },
  batchRemove(ids: string) {
    return post(`/userProduct/batch/remove?ids=${ids}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/userProduct/treeList', {}, true);
  },
};

export default serviceUserProduct;
