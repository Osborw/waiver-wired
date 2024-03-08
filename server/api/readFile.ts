import fs from 'fs'
import path from 'path'
import { Player } from '../../shared/types'

const filePath = path.resolve('files')

export const readPlayers = async (): Promise<Record<string, Player>> => JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())