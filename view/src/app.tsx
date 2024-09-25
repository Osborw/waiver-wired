import React, { useState, useEffect } from 'react'
import Layout from './components/MyLayout'
import { getLeague } from './server/getIndex'
import { TimeFrame, LeagueInfo, Roster } from '../../shared/types'
import { TopPlayerReturn } from '../../shared/api-types'
import { Players } from './pages/players'
import { Rosters } from './pages/rosters'

export enum Page {
  PLAYERS,
  ROSTERS,
}

export const App = () => {
  const [page, setPage] = useState<Page>(Page.PLAYERS)
  const [players, setPlayers] = useState<TopPlayerReturn[]>([])
  const [rosters, setRosters] = useState<Roster[]>([])
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo>()
  const [leagueId, setLeagueId] = useState<string>()
  const [ownerId, setOwnerId] = useState<string>()

  useEffect(() => {
    const init = async () => {
      const path = window.location.pathname
      const pathItems = path.split('/')

      //TODO: Check validity here
      const leagueId = pathItems[1]
      const userId = pathItems[2]

      await getLeagueInfo(leagueId, userId)
    }
    init()
  }, [])

  const getLeagueInfo = async (leagueId: string, userId: string) => {
    const ret = await getLeague(leagueId, userId)
    ret.players.map(p => console.log(p.position, p.topPlayers.length))
    setPlayers(ret.players)
    setOwnerId(userId)
    setLeagueId(leagueId)
    setRosters(ret.rosters)
    setLeagueInfo(ret.league)
    const websiteTitle = document.getElementById('title')
    if(websiteTitle) websiteTitle.innerText = `${ret.league.leagueName} Waiver Wired`
  }

  return (
    <div>
      {leagueInfo && ownerId ? (
        <Layout leagueName={leagueInfo.leagueName} setPage={setPage}>
          {page === Page.PLAYERS && <Players players={players} leagueInfo={leagueInfo} ownerId={ownerId} />}
          {page === Page.ROSTERS && <Rosters rosters={rosters} ownerId={ownerId} />}
        </Layout>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}
