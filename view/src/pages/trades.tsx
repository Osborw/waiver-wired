import React, { useEffect, useState } from 'react'
import { CalculatedPlayer, Roster, SearchPosition, TempRoster } from '../../../shared/types'
import { styled } from 'styled-components'
import { RosterList } from '../components/trades/RosterList'
import { createStartingLineup, rosterSumAvgStats } from '../logic/roster-logic'
import { OfferList } from '../components/trades/OfferList'

const TradeBuilderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
`

const ArrowContainer = styled.div`
  border: 1px black solid;
  width: 10%;
  min-height: 500px;
`

const createBaseTradeRoster = (originalRoster: Roster): TradeRoster => {
  const baseTempRoster: TempRoster = {
    fullRoster: originalRoster.fullRoster,
    ownerId: originalRoster.ownerId,
    starters: originalRoster.starters,
    avgPoints: originalRoster.avgPoints.totalPoints
  }

  return {
    ownerId: originalRoster.ownerId,
    ownerName: originalRoster.ownerName,
    originalRoster,
    remainingRoster: baseTempRoster,
    postTradeRoster: baseTempRoster
  }
}

const createTempRosterFromPlayerList = (ownerId: string, players: CalculatedPlayer[], leagueRosterSpots: SearchPosition[]): TempRoster => {
  const fullRoster = players
  const starters = createStartingLineup(players, leagueRosterSpots)
  const avgPoints = rosterSumAvgStats(Object.values(starters))

  return {
    ownerId,
    fullRoster,
    starters,
    avgPoints
  }
}

export interface TradeRoster {
  ownerId: string
  ownerName: string
  originalRoster: Roster
  remainingRoster: TempRoster 
  postTradeRoster: TempRoster
}

const removePlayerFromTradeRoster = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newPostTradeRosterList = roster.postTradeRoster.fullRoster.filter(p => p.id !== player.id)
  roster.postTradeRoster = createTempRosterFromPlayerList(roster.ownerId, newPostTradeRosterList, leagueRosterSpots)
}

const removePlayerFromRemaining = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newRemainingRosterList = roster.remainingRoster.fullRoster.filter(p => p.id !== player.id)
  roster.remainingRoster = createTempRosterFromPlayerList(roster.ownerId, newRemainingRosterList, leagueRosterSpots)
}

const addPlayerToTradeRoster = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newPostTradeRosterList = [...roster.postTradeRoster.fullRoster, player]
  roster.postTradeRoster = createTempRosterFromPlayerList(roster.ownerId, newPostTradeRosterList, leagueRosterSpots)
}

const addPlayerToRemaining = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newRemaingingRosterList = [...roster.remainingRoster.fullRoster, player]
  roster.remainingRoster = createTempRosterFromPlayerList(roster.ownerId, newRemaingingRosterList, leagueRosterSpots)
}

interface TradesProps {
  rosters: Roster[]
  ownerId: string
  leagueRosterSpots: SearchPosition[]
}

export const Trades = ({ rosters, ownerId, leagueRosterSpots }: TradesProps) => {
  const [ownerTradeRoster, setOwnerTradeRoster] = useState<TradeRoster>()
  const [oppTradeRoster, setOppTradeRoster] = useState<TradeRoster>()
  const [ownerOfferedPlayers, setOwnerOfferedPlayers] = useState<CalculatedPlayer[]>()
  const [oppOfferedPlayers, setOppOfferedPlayers] = useState<CalculatedPlayer[]>()

  const setRosters = () => {
    const ownerRoster = rosters.find((roster) => roster.ownerId === ownerId)
    const oppRoster = rosters.find((roster) => roster.ownerId !== ownerId)
    if (!ownerRoster) {
      console.error('No owner roster found!')
      return
    }
    if (!oppRoster) {
      console.error('No opp roster found!')
      return
    }

    //Create starting state
    setOwnerTradeRoster(createBaseTradeRoster(ownerRoster))
    setOppTradeRoster(createBaseTradeRoster(oppRoster))
    setOwnerOfferedPlayers([])
    setOppOfferedPlayers([])
  }

  useEffect(() => setRosters(), [])

  const addOwnerPlayerToOfferList = (player: CalculatedPlayer) => {
    setOwnerOfferedPlayers(current => {
      if(!current) return [player]
      return [...current, player]
    })

    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
    removePlayerFromRemaining(ownerTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(oppTradeRoster, player, leagueRosterSpots)
  }

  const addOppPlayerToOfferList = (player: CalculatedPlayer) => {
    setOppOfferedPlayers(current => {
      if(!current) return [player]
      return [...current, player]
    })

    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(oppTradeRoster, player, leagueRosterSpots)
    removePlayerFromRemaining(oppTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
  }

  const removeOwnerPlayerFromOfferList = (player: CalculatedPlayer) => {
    setOwnerOfferedPlayers(current => {
      if(!current) return []
      return current.filter(p => p.id !== player.id) 
    })

    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(oppTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
    addPlayerToRemaining(ownerTradeRoster, player, leagueRosterSpots)
  }

  const removeOppPlayerFromOfferList = (player: CalculatedPlayer) => {
    setOppOfferedPlayers(current => {
      if(!current) return []
      return current.filter(p => p.id !== player.id) 
    })

    if(!oppTradeRoster) {
      console.error('Cannot find the opp Trade Roster!')
      return
    }
    if(!ownerTradeRoster) {
      console.error('Cannot find the owner Trade Roster!')
      return
    }
    removePlayerFromTradeRoster(ownerTradeRoster, player, leagueRosterSpots)
    addPlayerToTradeRoster(oppTradeRoster, player, leagueRosterSpots)
    addPlayerToRemaining(oppTradeRoster, player, leagueRosterSpots)
  }

  if (!ownerTradeRoster) return <div>No owners roster found!</div>
  if (!oppTradeRoster) return <div>No opp roster found!</div>
  if (!ownerOfferedPlayers) return <div>Could not create owner offered players list!</div>
  if (!oppOfferedPlayers) return <div>Could not create opp offered players list!</div>

  return (
    <div>
      <h2>Trade Builder</h2>
      <TradeBuilderContainer>
        <RosterList
          ownerTradeRoster={ownerTradeRoster}
          oppTradeRoster={oppTradeRoster}
          addPlayerToOfferList={addOwnerPlayerToOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
        <OfferList 
          offeredPlayers={ownerOfferedPlayers}
          ownerTradeRoster={oppTradeRoster}
          oppTradeRoster={ownerTradeRoster}
          removePlayerFromOfferList={removeOwnerPlayerFromOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
        <ArrowContainer></ArrowContainer>
        <OfferList 
          offeredPlayers={oppOfferedPlayers}
          ownerTradeRoster={ownerTradeRoster}
          oppTradeRoster={oppTradeRoster}
          removePlayerFromOfferList={removeOppPlayerFromOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
        <RosterList
          ownerTradeRoster={oppTradeRoster}
          oppTradeRoster={ownerTradeRoster}
          addPlayerToOfferList={addOppPlayerToOfferList}
          leagueRosterSpots={leagueRosterSpots}
        />
      </TradeBuilderContainer>
    </div>
  )
}