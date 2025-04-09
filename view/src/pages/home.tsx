import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { LeagueInfo, getLeaguesByUserId, getUserIdByUsername } from '../server/getIndex'
import { Link } from 'react-router'

const HomePageLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1``

const Input = styled.input`
  border-radius: 5px;
  margin: 10px;
`

const Leagues = styled.div`
  display: flex;
  flex-direction: row;
`

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

    if(!searchedUserId) setSearchError(`No User found for "${usernameSearch}"`) 

    const leagues = await getLeaguesByUserId(searchedUserId)
    setUserId(searchedUserId)
    setLeagues(leagues)
  }

  const onKeyDown = (event: any) => {
    if(event.key === "Enter") searchForLeaguesByUser()
  }

  return (
    <HomePageLayout>
      <Title> WAIVER WIRED! </Title>
      <Input 
        onChange={(e: any) => setUsernameSearch(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
      >

      </Input>
      {/* <Button onClick={searchForLeaguesByUser}>Search</Button> */}
      {searchError && <p>{searchError}</p>}
      <Leagues>
        {leagues.map((league) => (
          <LeagueTile league={league} userId={userId} />
        ))}
      </Leagues>
    </HomePageLayout>
  )
}

const LeagueTileDiv = styled.div`
  display: flex;
  border: solid;
  border-radius: 5px;
  margin: 10px;
  padding: 5px;
`

interface LeagueTileProps {
  league: LeagueInfo
  userId: string
}

const LeagueTile = ({ league, userId }: LeagueTileProps) => {
  return (
    <Link to={`/${league.leagueId}/${userId}`}>
      <LeagueTileDiv>
        <p>{league.name}</p>
      </LeagueTileDiv>
    </Link>
  )
}