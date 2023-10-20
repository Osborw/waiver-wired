import fs from 'fs'
import path from 'path'

const filePath = path.resolve('../read/files')

export const readUnits = async () => JSON.parse((await fs.promises.readFile(`${filePath}/units.json`)).toString())
export const readPlayers = async () => JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
export const readSeason = async () => JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())