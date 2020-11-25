import { getBrowserInfo, getOsInfo } from './utils/tools';

const getItem = (key: string) => {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      const t = JSON.parse(value);
      return t;
    } catch (error) {
      return value;
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error(key + ' 没有值');
    }
    return null;
  }
};

const setItem = (name: string, value: any) => {
  if (typeof value === 'string') {
    localStorage.setItem(name, value);
  } else {
    localStorage.setItem(name, JSON.stringify(value));
  }
};

export default class localData {
  static getLastSupper(): boolean {
    let browser = getItem('browser');
    if (!browser) {
      const bro = getBrowserInfo() as string;
      const name = (bro + '').replace(/[0-9./]/gi, '');
      const version = parseInt((bro + '').replace(/[^0-9.]/gi, ''));
      browser = {
        name,
        version,
      };
      setItem('browser', browser);
    }
    const { name, version } = browser;
    if (name !== 'chrome') {
      return false;
    }
    if (version < 56) {
      return false;
    }
    return true;
  }

  static getSysIsSupper(): boolean {
    let os = getItem('os');
    if (!os) {
      os = getOsInfo();
      setItem('os', os);
    }
    const { version } = os;
    switch (version) {
      case 'Windows 2000':
      case 'Windows XP':
      case 'Windows Vista':
        return false;
    }
    return true;
  }

  static setMenu = (value: any) => {
    setItem('menu', value);
  };

  static getMenu = () => {
    return getItem('menu') || [];
  };

  static setPower = (value: any) => {
    setItem('power', value);
  };

  static getPower = () => {
    return getItem('power') || {};
  };

  static setToken = (value: string) => {
    console.log(value);
    sessionStorage.setItem('token', value);
  };

  static getToken = () => {
    return sessionStorage.getItem('token') || 'token_web_16062129604621eecc1c75c';
  };

  static setDepartment = (value: any) => {
    setItem('department', value);
  };

  static getDepartment = () => {
    return getItem('department');
  };

  static setSelf = (value: any) => {
    setItem('self', value);
  };
  static getSelf = () => {
    return getItem('self') || {};
  };

  static clear = () => {
    localStorage.clear();
    sessionStorage.clear();
  };
}
