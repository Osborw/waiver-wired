import React, { ReactNode, Dispatch } from 'react';
import Header from './Header';
import { Page } from '../pages/league';
import './MyLayout.scss'

interface LayoutProps {
  leagueName: string
  setPage: Dispatch<React.SetStateAction<Page>>
  children: ReactNode 
}

const Layout = (props: LayoutProps) => (
  <div className='layout'>
    <Header leagueName={props.leagueName} setPage={props.setPage}/>
    {props && props.children}
  </div>
);

export default Layout;