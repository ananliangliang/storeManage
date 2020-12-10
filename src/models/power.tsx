import { message } from 'antd';
import { useState, useCallback, useEffect, useRef } from 'react';
import { history } from 'umi';

export interface IMenus {
  icon: string;
  menuName: string;
  remark: string;
  url: string;
  menuId: string;
  style: 0 | 1;
  children: IMenus[];
}

interface IAuthType {
  [pathName: string]: {
    [name: string]: true;
  };
}
export default function usePowerModel() {
  const [menu, setMenu] = useState<IMenus[]>([]);
  const [auth, setAuth] = useState<IAuthType>({});
  const [curAuth, setCurAuth] = useState<{
    [name: string]: true;
  }>({});
  const refAuth = useRef<IAuthType>({});
  const refMenu = useRef<IMenus[]>([]);
  const refKeyMenu = useRef({});
  useEffect(() => {
    const unlisten = history.listen((location: any) => {
      pathAllow();
      setCurAuth(getPathPower(location));
    });
    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    refAuth.current = auth;
    refMenu.current = menu;
    pathAllow();
    setCurAuth(getPathPower(history.location));
  }, [menu, auth]);

  function pathAllow() {
    if (refMenu.current.length == 0) return;
    if (history.location.pathname == '/user/login') return;
    const res = refKeyMenu.current[history.location.pathname];
    if (!res) {
      message.warn('没有权限访问该页面!');
      setTimeout(() => {
        history.replace(refMenu.current[0].url);
      }, 0);
    }
  }

  function getPathPower(location: any) {
    const res = refAuth.current[location.pathname];
    return res || {};
  }

  const forMatePower = useCallback((data: any) => {
    const func: { [pid: string]: { children?: IMenus[] }[] } = {};
    const temp: { [pid: string]: string } = {};
    refKeyMenu.current = {};
    const menus = loop(data) as IMenus[];
    function loop(d: any[]): any[] {
      return d.map((item) => {
        const children: any[] = [];
        if (item.children) {
          item.children.forEach((j: any) => {
            if (j.type == 0) {
              delete j.children;
              func[j.parentId] ? func[j.parentId].push(j) : (func[j.parentId] = [j]);
            } else {
              children.push(j);
            }
          });
          if (children.length > 0) {
            item.children = loop(children);
          } else {
            delete item.children;
          }
        }
        temp[item.id] = item.url;
        refKeyMenu.current[item.url] = true;
        return item;
      });
    }
    const funcs = {};
    for (const key in func) {
      if (func.hasOwnProperty(key)) {
        const e = func[key];
        let t = {};
        e.map((item) => {
          t[item['remark']] = true;
        });
        funcs[temp[key]] = t;
      }
    }
    setMenu(menus);
    setAuth(funcs);
    return {
      menus,
      funcs,
    };
  }, []);

  return {
    menu,
    curAuth,
    forMatePower,
  };
}
