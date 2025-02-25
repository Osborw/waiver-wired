import React, { useState, useEffect } from 'react'
import { Home } from './pages/home'
import { League } from './pages/league'

export enum Page {
  HOME,
  LEAGUE,
  PLAYERS,
  ROSTERS,
  TRADES
}

export const App = () => {
  const [page, setPage] = useState<Page>(Page.HOME)

  useEffect(() => {
    const init = async () => {
      const path = window.location.pathname
      const pathItems = path.split('/')

      //TODO: Check validity here
      const leagueId = pathItems[1]
      const userId = pathItems[2]

      //if there's no leagueId or userId, set page as home
      if(leagueId && userId){
       setPage(Page.LEAGUE) 
      }
      else {
        setPage(Page.HOME)
      }
    }
    init()
  }, [])

  return (
    <div>
      {page === Page.HOME && <Home />}
      {page === Page.LEAGUE && <League />}
    </div>
  )
}
