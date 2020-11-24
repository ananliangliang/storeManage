import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

// 修改
export function companyAddEdit(values: any) {
  return post(`/company/addEdit`, values);
}

// 删除
export function companyRemove(coId: string) {
  return post(`/company/remove`, { coId });
}

//层级菜单列表
export function companyListAllTree() {
  return post(`/company/listAllTree`);
}

export function companyGet(coId: string) {
  return post(`/company/get`, { coId });
}

//层级菜单列表
export function companyList(param: any) {
  return proTableReq(`/company/list`, param);
}

export function companyListBycompanyId(coId: string) {
  return post(`/company/listBycompanyId`, { coId });
}
