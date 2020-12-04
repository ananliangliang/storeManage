import { getReq, post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceCommon = {
  productList(params: any = {}) {
    return proTableReq<any>('/product/list', params, true);
  },
  productGet(id: string) {
    return getReq('/product/get', { id }, true);
  },
  productBatchRemove(ids: string) {
    return post(`/product/batch/remove?ids=${ids}`, {}, true);
  },
  productOnAddEdit(data: any) {
    return post('/product/onAddEdit', data, true);
  },
  productRemove(id: string) {
    return post(`/product/remove?id=${id}`, {}, true);
  },
  productConfigList(params: any = {}) {
    return proTableReq<any>('/productConfig/list', params, true);
  },
  productConfigGet(id: string) {
    return getReq('/productConfig/get', { id }, true);
  },
  productConfigBatchRemove(ids: string) {
    return post(`/productConfig/batch/remove?ids=${ids}`, {}, true);
  },
  productConfigOnAddEdit(data: any) {
    return post('/productConfig/onAddEdit', data, true);
  },
  productConfigRemove(id: string) {
    return post(`/productConfig/remove?id=${id}`, {}, true);
  },

  departmentList(params: any = {}) {
    return proTableReq<any>('/department/list', params, true);
  },
  departmentGet(id: string) {
    return getReq(`/department/get?id={id}`, '', true);
  },
  departmentGetOrgAll() {
    return post('/department/getOrgAll', {}, true);
  },
  departmentBatchRemove(ids: string) {
    return post(`/department/batch/remove?ids=${ids}`, {}, true);
  },
  departmentOnAddEdit(data: any) {
    return post('/department/onAddEdit', data, true);
  },
  departmentRemove(id: string) {
    return post(`/department/remove?id=${id}`, {}, true);
  },
  departmentListAllTree() {
    return post(`/department/listAllTree`, {}, true);
  },
};

export default serviceCommon;
