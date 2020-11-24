import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';



// 修改
export function RoleAddEdit(values: any) {
  return post(`/role/addEdit`, values);
}


// 删除
export function RoleRemove(roleId: string) {
  return post(`/role/remove`, { roleId });
}

//层级菜单列表
export function RoleListAllTree() {
  return post(`/role/listAllTree`);
}


export function RoleGet(roleId: string) {
  return post(`/role/get`, { roleId });
}


//层级菜单列表
export function RoleList(param: any) {
  return proTableReq(`/role/list`, param);
}

export function RoleListByRoleId(roleId: string) {
  return post(`/role/listByRoleId`, { roleId });
}
