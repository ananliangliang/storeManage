// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import theme from './theme';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: { config: {} },
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
  dynamicimport: false,
  // dynamicImport: {
  //   loading: '@/components/PageLoading/index',
  // },
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
      path: '/charts',
      layout: false,
      name: '仓库大屏',
      component: './welcome/index',
    },
    {
      path: '/welcome',
      name: '首页',
      component: './welcome/index',
    },

    {
      path: '/warehouse',
      name: '库房管理',
      component: './Warehouse/index',
    },
    {
      path: '/goodsManage',
      name: '物资管理',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/goodsManage/goodsKind',
          name: '物资类型',
          component: './goodsManage/goodsKind',
        },
        {
          path: '/goodsManage/goodsInfo',
          name: '物资信息',
          component: './goodsManage/goodsInfo',
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
        {
          path: '/goodsManage/breakage',
          name: '报损管理',
          component: './goodsManage/breakage',
        },
      ],
    },
    {
      path: '/outPutManage',
      name: '出入库管理',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/outPutManage/putManage',
          name: '入库管理',
          component: './outPutManage/putManage',
        },
        {
          path: '/outPutManage/outManage',
          name: '出库管理',
          component: './outPutManage/outManage',
        },
      ],
    },
    {
      path: '/log',
      name: '日志管理',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/log/commonLog',
          name: '系统日志',
          component: './log/commonLog',
        },
        {
          path: '/log/messageLog',
          name: '消息日志',
          component: './log/messageLog',
        },
      ],
    },
    {
      name: '系统配置',
      path: '/setting',
      component: '../layout/NavLayout',
      routes: [
        {
          path: '/setting/product',
          name: '产品管理',
          component: './setting/product',
        },
        {
          path: '/setting/department',
          name: '部门管理',
          component: './setting/department',
        },
        {
          path: '/setting/menu',
          name: '菜单管理',
          component: './setting/menu',
        },
        {
          path: '/setting/user',
          name: '人员管理',
          component: './setting/user',
        },
        {
          path: '/setting/dictionary',
          name: '字典管理',
          component: './setting/dictionary',
        },
        {
          path: '/setting/role',
          name: '权限管理',
          component: './setting/role',
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
