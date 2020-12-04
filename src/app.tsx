import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

import defaultSettings from '../config/defaultSettings';
import sideLogo from '@/assets/image/sideLogo.png';

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
}> {
  // const fetchUserInfo = async () => {
  //   try {
  //     const currentUser = await queryCurrent();
  //     return currentUser;
  //   } catch (error) {
  //     history.push('/user/login');
  //   }
  //   return undefined;
  // };
  // // 如果是登录页面，不执行
  // if (history.location.pathname !== '/user/login') {
  //   const currentUser = await fetchUserInfo();
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: defaultSettings,
  //   };
  // }
  defaultSettings['logo'] = sideLogo;
  return {
    fetchUserInfo: {} as any,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { currentUser } = initialState;
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!currentUser && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};