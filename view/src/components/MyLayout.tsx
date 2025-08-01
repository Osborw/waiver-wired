import React, { ReactNode, Dispatch } from 'react';
import { Header } from './Header';
import { Page } from '../pages/league';
import s from './MyLayout.module.scss'

interface LayoutProps {
  leagueName: string
  setPage: Dispatch<React.SetStateAction<Page>>
  children: ReactNode 
}

const Layout = (props: LayoutProps) => (
  <div className={s.layout}>
    <Header leagueName={props.leagueName} setPage={props.setPage}/>
    {props && props.children}
  </div>
);

export default Layout;