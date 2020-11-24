import { post } from '@/utils/request';



// 修改
export function MenuAddEdit(values: any) {
  if (values) {
    values['hook'] = "pc"
  }
  return post(`/menu/addEdit`, values);
}


// 删除
export function MenuRemove(menuId: string) {
  return post(`/menu/remove`, { menuId });
}

//层级菜单列表
export function MenuListAllTree() {
  return post(`/menu/listAllTree`, {
    "parent_id": 0, "hook": "pc"
  });
}

export function MenuListByRoleId(roleId: string) {
  return post(`/menu/listByRoleId`, { roleId });
}
