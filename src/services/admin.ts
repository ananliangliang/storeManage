import { post, getReq } from '@/utils/request';

const serviceAdmin = {
  login(params: { userName: string; passWord: string }) {
    params['ident'] = 'tools';
    params['sysType'] = 'web';
    return post('/admin/login', params, true);
  },
  updatePassword(params: any = {}) {
    return post('/admin/login', params, true);
  },
};

export default serviceAdmin;
