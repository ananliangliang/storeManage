import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsEarlyWarning = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/goodsRule/list', params);
  },
  get(id: string) {
    return getReq('/goodsRule/get', { id });
  },

  handle(id: string, remark?: string) {
    return post('/goodsRule/handle', { id, remark });
  },

  getFloor(data: ReqList<any>) {
    return post('/goodsRule/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/goodsRule/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/goodsRule/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/goodsRule/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/goodsRule/treeList');
  },
};

export default serviceGoodsEarlyWarning;
