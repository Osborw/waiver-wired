import { CalculatedPlayer, Roster, SearchPosition } from "../../../../shared/types"
import { TradeRoster, addPlayerToRemaining, addPlayerToTradeRoster, createBaseTradeRoster, removePlayerFromRemaining, removePlayerFromTradeRoster } from "./base-trade-roster"

export type TradeRoomPartnerId = string 

export interface TradeRoom {
  userOwnerId: string
  partnerOwnerId: string
  userTradeRoster: TradeRoster
  partnerTradeRoster: TradeRoster
  userOfferedPlayers: CalculatedPlayer[]
  partnerOfferedPlayers: CalculatedPlayer[]
  leagueRosterSpots: SearchPosition[]
}

export const createTradeRoom = (userRoster: Roster, partnerRoster: Roster, leagueRosterSpots: SearchPosition[]): TradeRoom => {
  const userBaseTradeRoster = createBaseTradeRoster(userRoster)
  const partnerBaseTradeRoster = createBaseTradeRoster(partnerRoster)

  return {
    userOwnerId: userRoster.ownerId,
    partnerOwnerId: partnerRoster.ownerId,
    userTradeRoster: userBaseTradeRoster,
    partnerTradeRoster: partnerBaseTradeRoster,
    userOfferedPlayers: [],
    partnerOfferedPlayers: [],
    leagueRosterSpots,
  }
}

export const addPlayerToOfferList = (tradeRoom: TradeRoom, player: CalculatedPlayer, ownerId: string) => {
  const isUser = ownerId === tradeRoom.userOwnerId
  const tradeRoster = isUser? tradeRoom.userTradeRoster : tradeRoom.partnerTradeRoster
  const oppTradeRoster = isUser? tradeRoom.partnerTradeRoster : tradeRoom.userTradeRoster

  //edit trade rosters to include/exclude that player
  removePlayerFromTradeRoster(tradeRoster, player, tradeRoom.leagueRosterSpots)
  removePlayerFromRemaining(tradeRoster, player, tradeRoom.leagueRosterSpots)
  addPlayerToTradeRoster(oppTradeRoster, player, tradeRoom.leagueRosterSpots)

  //Add player to offer list
  if(isUser) tradeRoom.userOfferedPlayers.push(player)
  else tradeRoom.partnerOfferedPlayers.push(player)
}

export const removePlayerFromOfferList = (tradeRoom: TradeRoom, player: CalculatedPlayer, ownerId: string) => {
  const isUser = ownerId === tradeRoom.userOwnerId
  const tradeRoster = isUser? tradeRoom.userTradeRoster : tradeRoom.partnerTradeRoster
  const oppTradeRoster = isUser? tradeRoom.partnerTradeRoster : tradeRoom.userTradeRoster

  //edit trade rosters to include/exclude that player
  removePlayerFromTradeRoster(oppTradeRoster, player, tradeRoom.leagueRosterSpots)
  addPlayerToTradeRoster(tradeRoster, player, tradeRoom.leagueRosterSpots)
  addPlayerToRemaining(tradeRoster, player, tradeRoom.leagueRosterSpots)

  //Remove player from offer list
  if(isUser) tradeRoom.userOfferedPlayers = tradeRoom.userOfferedPlayers.filter(p => p.id !== player.id)
  else tradeRoom.partnerOfferedPlayers = tradeRoom.partnerOfferedPlayers.filter(p => p.id !== player.id)
}