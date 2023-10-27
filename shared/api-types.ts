import { CalculatedPlayer, Roster, TieredPlayer } from './types'

export interface TopPlayerReturn {
    players: TieredPlayer[]
    ownerId?: string
}

export interface RostersReturn {
    rosters: Roster[]
    ownerId?: string
}