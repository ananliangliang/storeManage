import { post } from '@/utils/request';
import { proTableReq } from '@/utils/tools';

const serviceIndex = {
  getAccess(params: { id?: string; type: 1 | 2; date: 1 | 2 }) {
    return post('/index/getAccess', params);
  },
  getGoodsCount(id?: string) {
    return post('/index/getGoodsCount', { id });
  },
  getMassageLog(param: any = {}) {
    return proTableReq('/index/getMassageLog', param);
  },
};

export default serviceIndex;
