import { post } from './request';
import { message } from 'antd';
import { RespList } from '@/data';

export async function proTableReq<T>(url: string, params: any = {}, isCommon?: boolean) {
  const { current = 1, pageSize = 10 } = params;
  console.log(params);
  delete params.current;
  delete params.pageSize;
  delete params._timestamp;
  const data = {
    filter: { ...params },
    pageSize: pageSize,
    pageNum: current,
  };
  console.log(data);
  const res = await post<RespList<T>>(url, data, isCommon);
  return {
    data: res.list,
    total: res.total,
  };
}

export function removeEmptyChildren(list: any[]) {
  list.map((item) => {
    if (item.children && item.children.length > 0) {
      removeEmptyChildren(item.children);
    } else {
      delete item.children;
    }
  });
}

export async function waitTime(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export async function subEffect(
  func: () => any,
  loadingMsg = '正在提交数据',
  successMsg = '访问成功',
) {
  const hide = message.loading(loadingMsg);
  try {
    const res = await func();
    console.log(res);
    hide();
    message.success(successMsg);
    if (res) return res;
    return true;
  } catch (error) {
    console.warn(error);
    hide();
    return false;
  }
}

export function* dvaSubEffect(
  func: () => any,
  loadingMsg = '正在提交数据',
  successMsg = '访问成功',
) {
  const hide = message.loading(loadingMsg);
  try {
    yield func();
    hide();
    message.success(successMsg);
  } catch (error) {
    hide();
  }
}

export function treeDataFormate(items: any[], id: string, title: string): any {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        key: item[id],
        title: item[title],
        value: item[id],
        children: treeDataFormate(item.children, id, title),
      };
    } else {
      return {
        key: item[id],
        title: item[title],
        value: item[id],
      };
    }
  });
}

export function deepClone(obj: any): any {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

export function download(address: string) {
  const aLink = document.createElement('a');
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = address;
  aLink.download = address;
  aLink.click();
  document.body.removeChild(aLink);
}

export function getBrowserInfo() {
  var agent = navigator.userAgent.toLowerCase();
  var regStr_ff = /firefox\/[\d.]+/gi;
  var regStr_chrome = /chrome\/[\d.]+/gi;
  var regStr_saf = /safari\/[\d.]+/gi;
  var isIE = agent.indexOf('compatible') > -1 && agent.indexOf('msie') > -1; //判断是否IE<11浏览器
  var isIE11 = agent.indexOf('trident') > -1 && agent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('msie (\\d+\\.\\d+);');
    reIE.test(agent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion == 7) {
      return 'IE/7';
    } else if (fIEVersion == 8) {
      return 'IE/8';
    } else if (fIEVersion == 9) {
      return 'IE/9';
    } else if (fIEVersion == 10) {
      return 'IE/10';
    }
  } //isIE end
  if (isIE11) {
    return 'IE/11';
  }
  //firefox
  if (agent.indexOf('firefox') > 0) {
    return agent.match(regStr_ff);
  }
  //Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    return agent.match(regStr_saf);
  }
  //Chrome
  if (agent.indexOf('chrome') > 0) {
    return agent.match(regStr_chrome);
  }
  return '';
}

// 获取操作系统信息
export function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  var name = 'Unknown';
  var version = 'Unknown';
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (
      userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
    ) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
    ) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
    } else {
      name = 'Linux';
    }
  } else {
    name = 'Unknown';
  }
  return { name, version };
}

export function fullScreen(dom: HTMLElement) {
  const element: any = dom;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else {
    message.error('当前浏览器不支持全屏方法');
    throw '当前浏览器不支持全屏方法';
  }
}

//退出全屏
export function exitFullscreen() {
  const dom: any = document;
  if (dom.exitFullscreen) {
    dom.exitFullscreen();
  } else if (dom.msExitFullscreen) {
    dom.msExitFullscreen();
  } else if (dom.mozCancelFullScreen) {
    dom.mozCancelFullScreen();
  } else if (dom.webkitExitFullscreen) {
    dom.webkitExitFullscreen();
  } else {
    message.error('当前浏览器不支持退出全屏');
    throw '当前浏览器不支持退出全屏';
  }
}
