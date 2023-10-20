import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { EligiblePositions, Player, SleeperPlayer, SleeperPosition, SleeperUnit } from '../../shared/types'
import { calculateDefPPR, calculatePPR } from './calculators'

const filePath = path.resolve('files')

const parseJSON = (filename: string) => {
    const rawdata = fs.readFileSync(`files/${filename}`).toString()
    return JSON.parse(rawdata)
}

// READ IN SEASON STATS
export const loadSeasonStats = async (year: number) => {
    console.log('Loading season stats')
    const URL = `https://api.sleeper.app/v1/stats/nfl/regular/${year}`

    await getSeasonData(URL)
    console.log('Loaded season stats')
}

const getSeasonData = async (url: string) => {
    let data: any
    try {
        const response = await fetch(url)
        const json = await response.json()
        data = json
        console.log('Retrieved season JSON')
    } catch (error) {
        console.log('ERROR', error)
        data = parseJSON('season.json')
    }

    const allPlayersObj: Record<string, any> = {}

    const allUnitsObj: Record<string, SleeperUnit> = JSON.parse((await fs.promises.readFile(`${filePath}/units.json`)).toString())

    const ids = Object.keys(allUnitsObj)

    ids.map(async (id: string) => {
        if (data[id]) {
            try {
                const sleeperPlayer = allUnitsObj[id]
                let player: Player = {
                    id,
                    fullName: sleeperPlayer.fullName,
                    firstName: sleeperPlayer.firstName,
                    lastName: sleeperPlayer.lastName,
                    team: sleeperPlayer.team,
                    fantasyPositions: sleeperPlayer.fantasyPositions,
                    injuryStatus: sleeperPlayer.injuryStatus,
                    ownerId: null,
                    weeklyStats: []
                }

                allPlayersObj[id] = player
            } catch (err) {
                console.log(err)
            }
        }
    })

    const allPlayersString = JSON.stringify(allPlayersObj)
    fs.writeFileSync(`${filePath}/season.json`, allPlayersString, 'utf8')
}