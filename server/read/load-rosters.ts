import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { Player } from '../../shared/types'
import { writePlayers } from './db-write'

const filePath = path.resolve('files')

export const loadRosters = async (leagueId: string) => {
    console.log('Loading rosters')
    const URL = `https://api.sleeper.app/v1/league/${leagueId}/rosters`

    await getRosterData(URL)
    console.log('Loaded rosters')
}

const getRosterData = async (url: string) => {
    let data: any
    try {
        const response = await fetch(url)
        const json = await response.json()
        data = json
        console.log('Retrieved JSON')
    } catch (error) {
        console.log('ERROR', error)
        data = []
    }

    const allPlayersObj: Record<string, Player> = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())

    data.forEach(async (roster : any) => {
        const id = roster.owner_id
        const players = roster.players
        players.forEach(async (p: any) => {
            if (allPlayersObj[p]) {
                allPlayersObj[p].ownerId = id
            }
        })
    })

    writePlayers(allPlayersObj)
}
