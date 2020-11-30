import { ReqList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsPreliminary = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/preliminary/list', params);
  },
  get(id: string) {
    return getReq(`/preliminary/get?id=${id}`);
  },
  getFloor(data: ReqList<any>) {
    return post('/preliminary/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/preliminary/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/preliminary/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/preliminary/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/preliminary/treeList');
  },
};

export default serviceGoodsPreliminary;
