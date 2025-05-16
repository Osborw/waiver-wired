import { Player, SleeperUnit } from '../../shared/types'

export const writePlayersDB = (_players: Record<string, Player>) => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const writeUnitsDB = (_units: Record<string, SleeperUnit>) => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const readPlayersDB = () => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const readUnitsDB = () => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}
