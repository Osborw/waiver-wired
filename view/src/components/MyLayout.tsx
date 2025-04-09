import React, { ReactNode, Dispatch } from 'react';
import Header from './Header';
import { Page } from '../pages/league';
import styled from 'styled-components';

const LayoutDiv = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 20px;
  padding-right: 20px;
`
interface LayoutProps {
  leagueName: string
  setPage: Dispatch<React.SetStateAction<Page>>
  children: ReactNode 
}

const Layout = (props: LayoutProps) => (
  <LayoutDiv>
    <Header leagueName={props.leagueName} setPage={props.setPage}/>
    {props && props.children}
  </LayoutDiv>
);

export default Layout;