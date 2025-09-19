import { CalculatedPlayer, Roster, SearchPosition, TempRoster } from '../../../../shared/types'
import { createStartingLineup, rosterSumAvgStats } from '../roster-logic'

export const createBaseTradeRoster = (originalRoster: Roster): TradeRoster => {
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

export const removePlayerFromTradeRoster = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newPostTradeRosterList = roster.postTradeRoster.fullRoster.filter(p => p.id !== player.id)
  roster.postTradeRoster = createTempRosterFromPlayerList(roster.ownerId, newPostTradeRosterList, leagueRosterSpots)
}

export const removePlayerFromRemaining = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newRemainingRosterList = roster.remainingRoster.fullRoster.filter(p => p.id !== player.id)
  roster.remainingRoster = createTempRosterFromPlayerList(roster.ownerId, newRemainingRosterList, leagueRosterSpots)
}

export const addPlayerToTradeRoster = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newPostTradeRosterList = [...roster.postTradeRoster.fullRoster, player]
  roster.postTradeRoster = createTempRosterFromPlayerList(roster.ownerId, newPostTradeRosterList, leagueRosterSpots)
}

export const addPlayerToRemaining = (roster: TradeRoster, player: CalculatedPlayer, leagueRosterSpots: SearchPosition[]) => {
  const newRemaingingRosterList = [...roster.remainingRoster.fullRoster, player]
  roster.remainingRoster = createTempRosterFromPlayerList(roster.ownerId, newRemaingingRosterList, leagueRosterSpots)
}