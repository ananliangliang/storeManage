import { Tabs } from 'antd';
import React, { FC, useEffect } from 'react';
import { useModel } from 'umi';
//import styles from './index.less'
const { TabPane } = Tabs;

interface IndexProps {}

const NavTabs: FC<IndexProps> = (props) => {
  const { navTabs, onChange, current } = useModel('navTabs', (state) => state);
  useEffect(() => {
    function handleContextMenu(){}
    function handleClick(){}
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {};
  }, []);
  return (
    <Tabs hideAdd onChange={onChange} activeKey={current} type="editable-card">
      {navTabs.map((pane) => (
        <TabPane tab={pane.title} key={pane.key} />
      ))}
    </Tabs>
  );
};
export default NavTabs;
