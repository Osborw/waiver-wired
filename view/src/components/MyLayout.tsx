import React, { ReactNode, Dispatch } from 'react';
import Header from './Header';
import { Page } from '../app';

const layoutStyle = {
  marginLeft: 20,
  marginRight: 20,
  paddingLeft: 20,
  paddingRight: 20,
}

interface LayoutProps {
  leagueName: string
  setPage: Dispatch<React.SetStateAction<Page>>
  children: ReactNode 
}

const Layout = (props: LayoutProps) => (
  <div style={layoutStyle}>
    <Header leagueName={props.leagueName} setPage={props.setPage}/>
    {props && props.children}
  </div>
);

export default Layout;