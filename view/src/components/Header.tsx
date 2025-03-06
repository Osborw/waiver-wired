import React, { Dispatch } from 'react'
import { Page } from '../pages/league';

const linkStyle = {
  marginRight: 15
};

interface HeaderProps {
  leagueName: string,
  setPage: Dispatch<React.SetStateAction<Page>>
}

const Header = ({leagueName, setPage}: HeaderProps) => (
  <div style={{marginBottom: '16px'}}>
    <h2>{leagueName}</h2>
    <div>
      <a onClick={() => setPage(Page.PLAYERS)} style={linkStyle}>
        Players 
      </a>
      <a onClick={() => setPage(Page.ROSTERS)} style={linkStyle}>
        Rosters 
      </a>
      <a onClick={() => setPage(Page.TRADES)} style={linkStyle}>
        Trades 
      </a>
    </div>
  </div>
);

export default Header;