import { ReqList, RespList } from '@/data';
import { post, getReq } from '@/utils/request';

const serviceRegion = {
  list(
    data: ReqList<{
      warehouse_id: number;
      parent_id: number;
    }>,
  ) {
    if (data.filter?.warehouse_id) {
      data.filter['level'] = 2;
    }
    return post<
      RespList<{
        id: number;
        regionName: string;
        shortName: string;
        mergerName: string;
        address: string;
        orgNo: number;
        imageUrl?: string;
        // children: null;
      }>
    >('/region/list', data);
  },
  get(id: string) {
    return getReq('/region/get', { id });
  },
  batchRemove(ids: string) {
    return post(`/region/batch/remove?ids=${ids}`);
  },
  onAddEdit(data: any) {
    return post('/region/onAddEdit', data);
  },
  remove(id: string) {
    console.log(id);
    return post(`/region/remove?id=${id}`);
  },
};

export default serviceRegion;
