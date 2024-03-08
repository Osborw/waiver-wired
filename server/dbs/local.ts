import fs from 'fs'
import path from 'path'
import { Player, SleeperUnit } from '../../shared/types'

const filePath = path.resolve('')

export const writePlayersLocal = async (players: Record<string, Player>) => {
  const allPlayersString = JSON.stringify(players)
  if (!fs.existsSync(`${filePath}/files`)) fs.mkdirSync(`${filePath}/files`)
  fs.writeFileSync(`${filePath}/files/players.json`, allPlayersString, 'utf8')
}

export const writeUnitsLocal = async (units: Record<string, SleeperUnit>) => {
  const allUnitsString = JSON.stringify(units)
  if (!fs.existsSync(`${filePath}/files`)) fs.mkdirSync(`${filePath}/files`)
  fs.writeFileSync(`${filePath}/files/units.json`, allUnitsString, 'utf8')
}

export const readPlayersLocal = async (): Promise<Record<string, Player>> => {
  const readFile = await fs.promises.readFile(`${filePath}/files/players.json`)
  return JSON.parse((readFile).toString())
}

export const readUnitsLocal = async (): Promise<Record<string, SleeperUnit>> => {
  const readFile = await fs.promises.readFile(`${filePath}/files/units.json`)
  return JSON.parse((readFile).toString())
}