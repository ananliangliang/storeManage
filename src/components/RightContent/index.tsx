import serviceAdmin from '@/services/admin';
import serviceCommon from '@/services/common';
import { Space, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  const user = useModel('user', (state) => state.user);
  console.log(user);
  const [menu, setMenu] = useState<any[]>([]);
  useEffect(() => {
    async function fetchList() {
      if (user?.user?.used == 2) {
        const res = await serviceCommon.productList({ pageSize: 9999 });
        setMenu(
          res.data.map((item: any) => ({
            label: item.name,
            value: item.ident,
          })),
        );
      }
    }
    fetchList();
  }, [user]);
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  async function handleChangeIdent(value: string) {
    sessionStorage.setItem('ident', value);
    await serviceAdmin.getLoginInfo();
    location.reload();
  }

  const a = [{ a: 1, b: 2 }];
  return (
    <Space className={className}>
      {menu.length > 0 && (
        <Select options={menu} showSearch defaultValue={user?.ident} onChange={handleChangeIdent} />
      )}
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
