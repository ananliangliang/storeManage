import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsRule = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/rule/list', params);
  },
  get(id: string) {
    return getReq('/rule/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/rule/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/rule/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/rule/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/rule/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/rule/treeList');
  },
  getGoodsList(params: any = {}) {
    return proTableReq<RespGoodsModel>('/rule/getGoodsList', params);
  },
};

export default serviceGoodsRule;
