import React, { Dispatch } from 'react'
import { Page } from '../pages/league';
import './Header.scss'

interface HeaderProps {
  leagueName: string,
  setPage: Dispatch<React.SetStateAction<Page>>
}

const Header = ({leagueName, setPage}: HeaderProps) => (
  <div className='header'>
    <h2>{leagueName}</h2>
    <div>
      <a onClick={() => setPage(Page.PLAYERS)}>
        Players 
      </a>
      <a onClick={() => setPage(Page.ROSTERS)}>
        Rosters 
      </a>
      <a onClick={() => setPage(Page.TRADES)}>
        Trades 
      </a>
    </div>
  </div>
);

export default Header;