import { getReq, post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceMenu = {
  list(params: any = {}) {
    return proTableReq<any>('/menu/list', params, true);
  },
  get(id: string) {
    return getReq(`/menu/get?id={id}`, '', true);
  },
  getOrgAll() {
    return post('/menu/getOrgAll', {}, true);
  },
  batchRemove(ids: string) {
    return post(`/menu/batch/remove?ids=${ids}`, {}, true);
  },
  onAddEdit(data: any) {
    return post('/menu/onAddEdit', data, true);
  },
  remove(id: string) {
    return post(`/menu/remove?id=${id}`, {}, true);
  },
};

export default serviceMenu;
