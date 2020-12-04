import { useState, useCallback, useEffect } from 'react';
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
  useEffect(() => {
    const unlisten = history.listen((location: any) => {
      setCurAuth(getPathPower(location));
    });
    return () => {
      unlisten();
    };
  }, []);

  const getPathPower = useCallback(
    (location) => {
      const res = auth[location.pathname];
      console.log(auth, res);
      return res;
    },
    [auth],
  );

  const forMatePower = useCallback((data: any) => {
    const func: { [pid: string]: { children?: IMenus[] }[] } = {};
    const temp: { [pid: string]: string } = {};
    const menus = loop(data) as IMenus[];
    function loop(d: any[]): any[] {
      return d.map((item) => {
        const children: any[] = [];
        if (item.children) {
          item.children.forEach((j: any) => {
            if (j.style == 0) {
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
        temp[item.menuId] = item.url;
        return item;
      });
    }
    const funcs = {};
    for (const key in func) {
      if (func.hasOwnProperty(key)) {
        const e = func[key];
        let temp = {};
        e.map((item) => {
          temp[item['remark']] = true;
        });
        funcs[temp[key]] = temp;
      }
    }
    setMenu(menus);
    setAuth(funcs);
  }, []);

  return {
    menu,
    curAuth,
    forMatePower,
  };
}
