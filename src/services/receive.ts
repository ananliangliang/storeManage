import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceReceive = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/receive/list', params);
  },
  get(id: string) {
    return getReq('/receive/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/receive/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/receive/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/receive/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/receive/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/receive/treeList');
  },
};

export default serviceReceive;
