import serviceAdmin from '@/services/admin';
import { useState, useCallback, useEffect } from 'react';
import { useModel, useRequest } from 'umi';

export default function useUserModel() {
  const [user, setUser] = useState(null);
  const forMatePower = useModel('power', (state) => state.forMatePower);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = useCallback(() => {
    async function fetch() {
      const res: any = await serviceAdmin.getLoginInfo();
      signin(res);
    }
    fetch();
  }, []);

  const signin = useCallback((res: any) => {
    sessionStorage.setItem('token', res.loginToken);
    setUser(res);
    forMatePower(res.menus);
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
