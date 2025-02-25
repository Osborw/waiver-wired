import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { LeagueInfo, getLeaguesByUsername } from '../server/getIndex'

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

  useEffect(() => {
    const init = async () => {}
    init()
  }, [])

  const searchForLeaguesByUser = async () => {
    const leagues = await getLeaguesByUsername(usernameSearch)
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
      >

      </Input>
      {/* <Button onClick={searchForLeaguesByUser}>Search</Button> */}
      <Leagues>
        {leagues.map((league) => (
          <LeagueTile league={league} />
        ))}
      </Leagues>
    </HomePageLayout>
  )
}

const LeagueTileDiv = styled.div`
  display: flex;
  border: solid;
  border-radius: 5px;
`

interface LeagueTileProps {
  league: LeagueInfo
}

const LeagueTile = ({ league }: LeagueTileProps) => {
  return (
    <LeagueTileDiv>
      <p>{league.name}</p>
    </LeagueTileDiv>
  )
}