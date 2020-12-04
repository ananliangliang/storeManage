/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { getPageQuery } from './utils';
import { stringify } from 'qs';
import { notification } from 'antd';
import config from '@/config/config';
import { history } from 'umi';
import localData from '@/localStore';
const codeMessage: {
  [code: number]: string;
} = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response) {
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;
      console.error(url, status, errorText);
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    // throw 出去 防止 dva model 接收到莫名其妙的数据
    console.warn(error);
  } else {
    throw error;
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: config.baseUrl,
  timeout: 300000,
  requestType: 'json',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  if (options.method === 'get') {
    options.params = options.params || options.data;
  }
  return {
    url,
    options,
  };
});

// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  let data: any = {};
  try {
    data = await response.clone().json();
  } catch (error) {
    notification.error({
      description: '返回结果类型出错',
      message: '服务异常',
    });
    throw '返回结果类型出错';
  }

  if (data.code >= 200 && data.code < 400) {
    const ret = data;
    if (response.headers.get('x-total-count')) {
      ret.headers['x-total-count'] = response.headers.get('x-total-count');
    }
    return ret.content as any;
  } else if (data.code == 1000) {
    //登录过期
    const { redirect } = getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
    throw '登录过期';
  }
  throw '服务器异常';
});

export default request;

export async function post<T>(url: string, data?: any, isCommon?: boolean) {
  const param: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      loginToken: localData.getToken(),
    },
    body: JSON.stringify(data),
  };
  const _url = isCommon ? '/common' + url : config.prefix + url;
  console.log(_url);
  return await request<T>(_url, param);
}

export async function upload(url: string, data?: any, isCommon?: boolean) {
  const param: RequestInit = {
    method: 'post',
    headers: {
      // 'Content-Type': "multipart/form-data",
      loginToken: localData.getToken(),
    },
    body: data,
  };
  const _url = isCommon ? '/common' + url : config.prefix + url;

  return await request(_url, param);
}

export async function getReq(url: string, data?: any, isCommon?: boolean) {
  const param: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      loginToken: localData.getToken(),
    },
    body: JSON.stringify(data),
  };
  const _url = isCommon ? '/common' + url : config.prefix + url;

  return await request(_url, param);
}
