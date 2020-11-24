import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';



// 修改
export function dictAddEdit(values: any) {
  return post(`/dictionary/addEdit`, values);
}


// 删除
export function dictRemove(dictionaryId: string) {
  return post(`/dictionary/remove`, { dictionaryId });
}

//层级菜单列表
export function dictListAllTree() {
  return post(`/dictionary/allListDic`, {
    parentId: 0
  });
}


export function dictGet(dictionaryId: string) {
  return post(`/dictionary/get`, { dictionaryId });
}


//层级菜单列表
export function dictList(param: any) {
  return proTableReq(`/dictionary/list`, param);
}
