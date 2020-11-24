import { useState, useCallback, useEffect } from 'react';
import { useRequest } from 'umi';

export default function useUserModel() {
  const [user, setUser] = useState(null);

  const fetch = useCallback(() => {}, []);

  const signin = useCallback((account, password) => {
    // signin implementation
    // setUser(user from signin API)
    useRequest('/');
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
