import React, { useEffect, useState } from 'react'
import { LeagueInfo, getLeaguesByUserId, getUserIdByUsername } from '../server/getIndex'
import { Link } from 'react-router'
import s from './home.module.scss'

export const Home = () => {
  const [usernameSearch, setUsernameSearch] = useState('')
  const [leagues, setLeagues] = useState<LeagueInfo[]>([])
  const [userId, setUserId] = useState<string>('')
  const [searchError, setSearchError] = useState<string>()

  useEffect(() => {
    const init = async () => {}
    init()
  }, [])

  const searchForLeaguesByUser = async () => {
    const searchedUserId = await getUserIdByUsername(usernameSearch)

    if(!searchedUserId) {
      setSearchError(`No User found for "${usernameSearch}"`) 
      return
    }

    const leagues = await getLeaguesByUserId(searchedUserId)

    if(!leagues || leagues.length < 1) {
      setSearchError(`No Leagues found for User "${usernameSearch}"`)
      return
    }

    setUserId(searchedUserId)
    setLeagues(leagues)
  }

  const onKeyDown = (event: any) => {
    if(event.key === "Enter") searchForLeaguesByUser()
  }

  const onChange = (event: any) => {
    setSearchError(undefined)
    setUsernameSearch(event.target.value)
  }

  return (
    <div className={s.home_layout}>
      <h1> WAIVER WIRED! </h1>
      <input 
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
      >
      </input>
      {searchError && <p>{searchError}</p>}
      <div className={s.leagues}>
        {leagues.map((league) => (
          <LeagueTile league={league} userId={userId} />
        ))}
      </div>
    </div>
  )
}

interface LeagueTileProps {
  league: LeagueInfo
  userId: string
}

const LeagueTile = ({ league, userId }: LeagueTileProps) => {
  return (
    <Link to={`/${league.leagueId}/${userId}`}>
      <div className={s.league_tile}>
        <p>{league.name}</p>
      </div>
    </Link>
  )
}