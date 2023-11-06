import { Roster, TieredPlayer, Trade } from './types'

export interface TopPlayerReturn {
    players: TieredPlayer[]
    ownerId?: string
}

export interface RostersReturn {
    rosters: Roster[]
    ownerId?: string
}

export interface TradesReturn {
    rosters: Roster[]
    trades: Trade[]
    ownerId?: string
}