import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceAccess = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/access/list', params);
  },
  get(id: string) {
    return getReq('/access/get?id=' + id);
  },
  getFloor(data: ReqList<any>) {
    return post('/access/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/access/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/access/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/access/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/access/treeList');
  },
};

export default serviceAccess;
