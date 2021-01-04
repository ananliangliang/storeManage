import config from '@/config/config';
import localData from '@/localStore';
import serviceAdmin from '@/services/admin';
import { useState, useCallback, useEffect } from 'react';
import { history, useModel } from 'umi';
import defaultSettings from '../../config/defaultSettings';

export default function useUserModel() {
  const [user, setUser] = useState<any>({});
  const { setInitialState } = useModel('@@initialState');
  const forMatePower = useModel('power', (state) => state.forMatePower);
  const dictInit = useModel('dict', (state) => state.init);
  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(() => {
    async function fetchData() {
      const path: string = history.location.pathname;
      console.warn(path, config.noAuthPage.includes(path));
      if (config.noAuthPage.includes(path)) return;
      const res: any = await serviceAdmin.getLoginInfo();
      signin(res);
      dictInit();
    }
    fetchData();
  }, []);

  const signin = useCallback((res: any) => {
    localData.setToken(res.loginToken);
    setUser(res);
    const menu = forMatePower(res.menus);
    setInitialState({
      settings: {
        ...defaultSettings,
        menu: {
          loading: false,
          locale: false,
        },
      },
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
