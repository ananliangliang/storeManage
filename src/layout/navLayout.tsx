import NavTabs from '@/components/NavTabs';
import React, { FC } from 'react';
//import styles from './navLayout.less'

interface NavLayoutProps {}

const NavLayout: FC<NavLayoutProps> = (props) => {
  return (
    <div className="fullContent">
      {/* <NavTabs /> */}
      {props.children}
    </div>
  );
};
export default NavLayout;
