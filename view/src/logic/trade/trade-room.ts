import { CalculatedPlayer, Roster } from "../../../../shared/types"
import { TradeRoster, createBaseTradeRoster } from "./base-trade-roster"

export type TradeRoomPartnerId = string 

export interface TradeRoom {
  userOwnerId: string
  partnerOwnerId: string
  userTradeRoster: TradeRoster
  partnerTradeRoster: TradeRoster
  userOfferedPlayers: CalculatedPlayer[]
  partnerOfferedPlayers: CalculatedPlayer[]
}

export const createTradeRoom = (userRoster: Roster, partnerRoster: Roster): TradeRoom => {
  const userBaseTradeRoster = createBaseTradeRoster(userRoster)
  const partnerBaseTradeRoster = createBaseTradeRoster(partnerRoster)

  return {
    userOwnerId: userRoster.ownerId,
    partnerOwnerId: partnerRoster.ownerId,
    userTradeRoster: userBaseTradeRoster,
    partnerTradeRoster: partnerBaseTradeRoster,
    userOfferedPlayers: [],
    partnerOfferedPlayers: []
  }
}