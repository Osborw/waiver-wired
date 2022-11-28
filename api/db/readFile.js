const fs = require('fs')
const path = require('path')
const filePath = path.resolve('../read/files')

export const readPlayers = async () => JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
export const readWeeks = async () => JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())
export const readSeason = async () => JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())