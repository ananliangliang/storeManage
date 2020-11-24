import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsModel = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/model/list', params);
  },
  get(id: string) {
    return getReq('/model/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/model/getFloor', data);
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
  treeList() {
    return post<RespGoodsModel[]>('/model/treeList');
  },
};

export default serviceGoodsModel;
