import React from 'react';
import { BasicLayoutProps, MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

import defaultSettings from '../config/defaultSettings';
import sideLogo from '@/assets/image/sideLogo.png';
import { IMenus } from './models/power';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zhCN from './locales/zh-CN';
moment.locale('zh-cn');
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
  menuData: MenuDataItem[];
}> {
  return {
    fetchUserInfo: {} as any,
    settings: {
      ...defaultSettings,
      menu: {
        locale: false,
        loading: true,
      },
    },
    menuData: [],
  };
}

export const antd = {
  config: {
    locale: zhCN, // 引用antd的语言包
  },
};
const menuDataRender = (menuList: IMenus[]): MenuDataItem[] => {
  return menuList.map((item) => {
    const a: MenuDataItem = {
      path: item.url,
      name: item.menuName,
      locale: 'menu.' + item.menuName,
      icon: (
        <span className="anticon">
          <span className={item.icon} />
        </span>
      ),
      children: item.children ? menuDataRender(item.children) : [],
      key: item.url,
    };
    console.log(a);
    return a;
  });
};

export const layout = ({
  initialState,
}: {
  initialState: {
    settings?: LayoutSettings;
    currentUser?: API.CurrentUser;
    menuData: MenuDataItem[];
  };
}): BasicLayoutProps => {
  const menuData = menuDataRender((initialState.menuData as any) || []);
  console.warn(menuData);
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
    menuData,
    menuDataRender: (org) => {
      console.warn(org);
      return menuDataRender((initialState.menuData as any) || []);
    },
    // menuDataRender: (menuData) => initialState.menuData || menuData,
    ...initialState?.settings,
    logo: sideLogo,
    // menuItemRender(prop, def) {
    //   console.log(prop, def);
    //   return def;
    // },
  };
};
