// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import theme from './theme';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  request: {
    dataField: '',
  },
  layout: {
    name: 'Ant Design Pro',
    locale: true,
    ...defaultSettings,
  },
  esbuild: {},
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },

    {
      path: '/warehouse',
      name: '库房管理',
      icon: 'smile',
      component: './Warehouse/index',
    },
    {
      path: '/goodsManage',
      name: '物资管理',
      icon: 'smile',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/goodsManage/goodsKind',
          name: '物资种类',
          component: './goodsManage/goodsKind',
        },
        {
          path: '/goodsManage/earlyWarning',
          name: '物资预警',
          component: './goodsManage/earlyWarning',
        },
        {
          path: '/goodsManage/warningRule',
          name: '预警规则',
          component: './goodsManage/warningRule',
        },
        {
          path: '/goodsManage/task',
          name: '任务管理',
          component: './goodsManage/task',
        },
      ],
    },
    {
      name: '系统配置',
      icon: 'smile',
      path: '/setting',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/setting/menu',
          name: '菜单管理',
          component: './setting/baseSetting/Menu',
        },
        {
          path: '/setting/role',
          name: '权限管理',
          component: './setting/baseSetting/Role',
        },
        {
          path: '/setting/department',
          name: '部门管理',
          component: './setting/baseSetting/Department',
        },
        {
          path: '/setting/user',
          name: '人员管理',
          component: './setting/baseSetting/User',
        },
        {
          path: '/setting/dictionary',
          name: '字典管理',
          component: './setting/baseSetting/Dictionary',
        },
        {
          component: './404',
        },
      ],
    },

    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: theme,
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
