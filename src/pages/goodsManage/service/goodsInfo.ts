import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

export function goodsInfoList(param: any) {
  return proTableReq(`/goods/list`, param);
}

export function listByReginon(param: any) {
  return proTableReq(`/goods/listByReginon`, param);
}

export function listByReginonAll(param: any) {
  return proTableReq(`/goods/listByReginonAll`, param);
}

export function goodsChangeRFID(id: string, signNo: string) {
  return post('/goods/changeRFID', { id, signNo });
}
