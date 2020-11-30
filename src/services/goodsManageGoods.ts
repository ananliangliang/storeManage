import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsManageGoods = {
  list(params: any = {}) {
    return proTableReq<any>('/manageGoods/list', params);
  },
  get(id: string) {
    return getReq('/manageGoods/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/manageGoods/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/manageGoods/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/manageGoods/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/manageGoods/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/manageGoods/treeList');
  },
};

export default serviceGoodsManageGoods;
