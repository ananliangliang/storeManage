import { useState, useCallback, useEffect } from 'react';

import { history } from 'umi';

export default function useNavTabsModel() {
  const [navTabs, setTabs] = useState<any[]>([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    console.log('init nav');
    const unlisten = history.listen((location: Location, action: string) => {
      console.log(location, action);
      onChange(location.pathname);
    });
    return () => {
      unlisten();
    };
  }, []);

  const onChange = useCallback((key: string) => {
    const cur = navTabs.filter((item) => item.key === key);
    if (cur.length > 0) {
      setCurrent(cur[0].key);
    } else {
      setTabs([...navTabs, { title: '1231', key }]);
      setCurrent(key);
    }
  }, []);

  const closeAll = useCallback(() => {
    setTabs([]);
  }, []);
  function getIndex(key: string) {
    return navTabs.findIndex((item) => item.key === key);
  }
  const closeRight = useCallback((key: string) => {
    const idx = getIndex(key);
    setTabs(navTabs.slice(0, idx));
  }, []);
  const closeLeft = useCallback((key: string) => {
    const idx = getIndex(key);
    setTabs(navTabs.slice(idx));
  }, []);

  return {
    navTabs,
    current,
    onChange,
    closeLeft,
    closeRight,
    closeAll,
  };
}
