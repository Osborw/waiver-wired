import React, { useState } from 'react'
import { CalculatedPlayer, Player, Roster, SearchPosition } from '../../../shared/types'
import { styled } from 'styled-components'
import { createStartingLineup, rosterSumAvgStats } from '../logic/roster-logic'

const RosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px black solid;
  width: 20%;
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
  height: 90%;
`

interface TradesProps {
  roster: Roster
  oppRoster: Roster
  leagueRosterSpots: SearchPosition[]
}

export const RosterList = ({ roster, oppRoster, leagueRosterSpots }: TradesProps) => {
  return (
    <RosterContainer>
      <SortContainer>{roster.ownerName}</SortContainer>
      <PlayersContainer>
        {roster.fullRoster.map((player) => (
          <PlayerTile player={player} roster={roster} oppRoster={oppRoster} leagueRosterSpots={leagueRosterSpots} />
        ))}
      </PlayersContainer>
    </RosterContainer>
  )
}

/**
 *
 * PlayerTile will likely have to do it's own calculation for what a roster would lose avgPoints wise if it lost this player.
 * It will also have to do a calculation for what the other team would gain avgPoints wise if it gained this player
 *
 * So for each player, that's two calculations that each take O(n^2) I think. not great, but not horrible. We'll see what happens.
 *
 */
const PlayerTileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid gray;
  margin: 2px;
  padding: 4px;
`

const PlayerInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PlayerInfoLine = styled.div`
  display: flex;
  flex-direction: row;
`

const PlayerInfo = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 2px;
  margin-left: 2px;
`

const TradeActionContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const TradeInfo = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 2px;
  margin-left: 2px;
  display: flex;
  align-items: center;
`

interface PlayerTileProps {
  player: CalculatedPlayer
  roster: Roster
  oppRoster: Roster
  leagueRosterSpots: SearchPosition[]
}

const getTradeValue = ({player, roster, oppRoster, leagueRosterSpots}: PlayerTileProps) => {
  //create two new player lists 
  const oldAvgPoints = roster.avgPoints.totalPoints
  const oldOppAvgPoints = oppRoster.avgPoints.totalPoints

  const newFullRoster = roster.fullRoster.filter(p => p.id !== player.id)
  const newOppRoster = [...oppRoster.fullRoster, player]
  //create a starting lineup using them

  const newStartingLineup = createStartingLineup(newFullRoster, leagueRosterSpots)
  const newOppStartingLineup = createStartingLineup(newOppRoster, leagueRosterSpots)
  const myNewAvgPoints = rosterSumAvgStats(Object.values(newStartingLineup))
  const oppNewAvgPoints = rosterSumAvgStats(Object.values(newOppStartingLineup))
  //subtract old values from new values
  const myGain = myNewAvgPoints - oldAvgPoints
  const oppGain = oppNewAvgPoints - oldOppAvgPoints
  //return those two numbers
  return {myGain, oppGain}
}

const PlayerTile = ({ player, roster, oppRoster, leagueRosterSpots }: PlayerTileProps) => {

  const tradeValue = getTradeValue({player, roster, oppRoster, leagueRosterSpots}) 

  return (
    <PlayerTileContainer>
      <PlayerInfoContainer>
        <PlayerInfoLine>
          <PlayerInfo>{player.fullName}</PlayerInfo>
          <PlayerInfo>{player.fantasyPositions[0]}</PlayerInfo>
        </PlayerInfoLine>
        <PlayerInfoLine>
          <PlayerInfo>{player.fiveWeekMetrics.avgPoints.toFixed(2)}</PlayerInfo>
        </PlayerInfoLine>
      </PlayerInfoContainer>
      <TradeActionContainer>
        <TradeInfo>{tradeValue.myGain.toFixed(0)} | {tradeValue.oppGain.toFixed(0)}</TradeInfo>
        <button>+</button>
      </TradeActionContainer>
    </PlayerTileContainer>
  )
}
