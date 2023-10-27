import { CalculatedPlayer, Roster, TieredPlayer, Trade } from './types'

export interface TopPlayerReturn {
    players: TieredPlayer[]
    ownerId?: string
}

export interface RostersReturn {
    rosters: Roster[]
    trades: Trade[]
    ownerId?: string
}