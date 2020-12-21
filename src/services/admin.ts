import config from '@/config/config';
import { post } from '@/utils/request';

const serviceAdmin = {
  login(params: { userName: string; passWord: string }) {
    params['ident'] = config.ident;
    params['sysType'] = 'web';
    return post('/admin/login', params, true);
  },

  getLoginInfo() {
    const ident = sessionStorage.getItem('ident');
    if (!ident) {
      return post(`/admin/getLoginInfo`, {}, true);
    }
    return post(`/admin/getLoginInfo${ident ? '?ident=' + ident : ''}`, {}, true);
  },
  updatePassword(params: any = {}) {
    return post('/admin/login', params, true);
  },
  resetPassword(userId: number) {
    return post('/admin/resetPassword', { userId }, true);
  },
};

export default serviceAdmin;
