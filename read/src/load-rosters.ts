import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

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

    let allPlayers = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())

    await Promise.all(data.map(async (user: any) => {
        const id = user.owner_id
        const players = user.players
        await Promise.all(players.map(async (p: any) => {
            if (allPlayers[p]) {
                allPlayers[p] = { ...allPlayers[p], owner_id: id }
            }
        }))
    }))

    const allPlayersString = JSON.stringify(allPlayers)
    fs.writeFileSync(`${filePath}/players.json`, allPlayersString, 'utf8')
}
