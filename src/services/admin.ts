import { post, getReq } from '@/utils/request';

const serviceAdmin = {
  login(params: { userName: string; passWord: string }) {
    params['ident'] = 'tools';
    params['sysType'] = 'web';
    return post('/admin/login', params, true);
  },

  getLoginInfo() {
    return post('/admin/getLoginInfo', {}, true);
  },
  updatePassword(params: any = {}) {
    return post('/admin/login', params, true);
  },
  resetPassword(userId: number) {
    return post('/admin/resetPassword', { userId },true);
  },
};

export default serviceAdmin;
