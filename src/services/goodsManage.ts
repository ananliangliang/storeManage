import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';
import { proTableReq } from '@/utils/tools';
import { RespGoodsModel } from './goodsModelI';

const serviceGoodsManage = {
  list(params: any = {}) {
    return proTableReq<RespGoodsModel>('/manage/list', params);
  },
  get(id: string) {
    return getReq('/manage/get', { id });
  },
  getFloor(data: ReqList<any>) {
    return post('/manage/getFloor', data);
  },
  batchRemove(ids: string) {
    return post(`/manage/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/manage/onAddEdit', data);
  },
  remove(id: string) {
    return post(`/manage/remove?id=${id}`);
  },
  treeList() {
    return post<RespGoodsModel[]>('/manage/treeList');
  },
};

export default serviceGoodsManage;
