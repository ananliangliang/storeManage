import serviceAdmin from '@/services/admin';
import { useState, useCallback, useEffect } from 'react';
import { useModel } from 'umi';
import defaultSettings from '../../config/defaultSettings';

export default function useUserModel() {
  const [user, setUser] = useState(null);
  const forMatePower = useModel('power', (state) => state.forMatePower);
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(() => {
    async function fetch() {
      const res: any = await serviceAdmin.getLoginInfo();
      signin(res);
    }
    return fetch();
  }, []);

  const signin = useCallback((res: any) => {
    sessionStorage.setItem('token', res.loginToken);
    setUser(res);
    const menu = forMatePower(res.menus);

    setInitialState({
      settings: defaultSettings,
      menuData: menu.menus,
    } as any);
  }, []);
  const signout = useCallback(() => {
    // signout implementation
    // setUser(null)
  }, []);

  return {
    user,
    signin,
    signout,
  };
}
