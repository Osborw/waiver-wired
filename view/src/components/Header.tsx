import React, { Dispatch } from 'react'
import { Page } from '../pages/league';
import s from './Header.module.scss'

interface HeaderProps {
  leagueName: string,
  setPage: Dispatch<React.SetStateAction<Page>>
}

export const Header = ({leagueName, setPage}: HeaderProps) => (
  <div className={s.header}>
    <h2>{leagueName}</h2>
    <div className={s.tabs}>
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
)