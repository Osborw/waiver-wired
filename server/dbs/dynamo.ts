import { Player, SleeperUnit } from '../../shared/types'

export const writePlayersDynamo = (players: Record<string, Player>) => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const writeUnitsDynamo = (units: Record<string, SleeperUnit>) => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const readPlayersDynamo = () => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}

export const readUnitsDynamo = () => {
  throw new Error(`no dynamo db defined. If running locally, try setting env var ENV='local'`)
}
