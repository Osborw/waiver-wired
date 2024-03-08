import { Player, SleeperUnit } from "../../shared/types"
import { writePlayersDynamo, writeUnitsDynamo } from "./dbs/dynamo"
import { writePlayersLocal, writeUnitsLocal } from "./dbs/local"

const ENV = process.env.ENV ?? 'local'

export const writePlayers = (players: Record<string, Player>) => {
  if(ENV === 'local') writePlayersLocal(players)
  else writePlayersDynamo(players)
}

export const writeUnits = (units: Record<string, SleeperUnit>) => {
  if(ENV === 'local') writeUnitsLocal(units)
  else writeUnitsDynamo(units)
}