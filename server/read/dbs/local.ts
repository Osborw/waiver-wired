import fs from 'fs'
import path from 'path'
import { Player, SleeperUnit } from '../../../shared/types'

const filePath = path.resolve('')

export const writePlayersLocal = (players: Record<string, Player>) => {
  const allPlayersString = JSON.stringify(players)
  if (!fs.existsSync(`${filePath}/files`)) fs.mkdirSync(`${filePath}/files`)
  fs.writeFileSync(`${filePath}/files/players.json`, allPlayersString, 'utf8')
}

export const writeUnitsLocal = (units: Record<string, SleeperUnit>) => {
  const allUnitsString = JSON.stringify(units)
  if (!fs.existsSync(`${filePath}/files`)) fs.mkdirSync(`${filePath}/files`)
  fs.writeFileSync(`${filePath}/files/units.json`, allUnitsString, 'utf8')
}
