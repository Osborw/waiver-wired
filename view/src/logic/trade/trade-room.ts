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
