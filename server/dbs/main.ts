import { Player, SleeperUnit } from "../../shared/types"
import { readPlayersDB, readUnitsDB, writePlayersDB, writeUnitsDB} from "./db"
import { readPlayersLocal, readUnitsLocal, writePlayersLocal, writeUnitsLocal } from "./local"

const ENV = process.env.ENV ?? 'local'

export const writePlayers = (players: Record<string, Player>) => {
  if(ENV === 'local') writePlayersLocal(players)
  else writePlayersDB(players)
}

export const writeUnits = (units: Record<string, SleeperUnit>) => {
  if(ENV === 'local') writeUnitsLocal(units)
  else writeUnitsDB(units)
}

export const readPlayers = async (): Promise<Record<string, Player>> => {
  if(ENV === 'local') return await readPlayersLocal()
  else return readPlayersDB()
}

export const readUnits = async (): Promise<Record<string, SleeperUnit>> => {
  if(ENV === 'local') return await readUnitsLocal()
  else return readUnitsDB()
}