import React, { useState } from 'react'
import { Roster, SearchPosition, SleeperPosition, Trade } from '../../../shared/types'
import { styled } from 'styled-components'
import { RosterList } from '../components/RosterList'

const TradeBuilderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
`

const RosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  width: 20%;
  min-height: 500px;
`

const OfferContainer = styled.div`
  display: flex;
  border: 1px black solid;
  width: 20%;
  min-height: 500px;
`

const ArrowContainer = styled.div`
  border: 1px black solid;
  width: 10%;
  min-height: 500px;
`

const SortContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px black solid;
  height: 10%;
`

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  height: 90%
`


interface TradesProps {
  rosters: Roster[]
  ownerId: string
  leagueRosterSpots: SearchPosition[]
}

export const Trades = ({rosters, ownerId, leagueRosterSpots}: TradesProps) => {

  const [selectedRoster, setSelectedRoster] =  useState(rosters.find(roster => roster.ownerId !== ownerId))

  const ownersRoster = rosters.find(roster => roster.ownerId === ownerId)
  if(!ownersRoster) return <div>No owners roster found!</div>
  if(!selectedRoster) return <div>No selected roster found!</div>

  return (
    <div>
      <h2>Trade Builder</h2>
      <TradeBuilderContainer>
        <RosterList roster={ownersRoster} oppRoster={selectedRoster} leagueRosterSpots={leagueRosterSpots} />
        <OfferContainer>

        </OfferContainer>
        <ArrowContainer>

        </ArrowContainer>
        <OfferContainer>

        </OfferContainer>
        <RosterList roster={selectedRoster} oppRoster={ownersRoster} leagueRosterSpots={leagueRosterSpots} />
      </TradeBuilderContainer>
    </div>
  )
}