import { Roster, SearchPosition, TieredPlayer, Trade } from './types'

export interface LeagueReturn {
    players: TopPlayerReturn[]
    rosters: Roster[] 
    trades: Trade[]
}

export interface TopPlayerReturn {
    position: SearchPosition
    topPlayers: TieredPlayer[]
    top5WeekPlayers: TieredPlayer[]
}

export interface RostersReturn {
    rosters: Roster[]
}

export interface TradesReturn {
    trades: Trade[]
}