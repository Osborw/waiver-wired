import { CalculatedPlayer, TieredPlayer } from './types'

export interface TopPlayerReturn {
    players: TieredPlayer[]
    ownerId?: string
}