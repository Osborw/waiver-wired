import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { isNullOrUndefined } from 'util'
import { EligiblePositions } from '../../shared/types'
import { calculateDefPPR, calculatePPR } from './calculators'

const filePath = path.resolve('files')

const parseJSON = (filename: string) => {
    const rawdata = fs.readFileSync(`files/${filename}`).toString()
    return JSON.parse(rawdata)
}

// READ IN Weekly STATS
export const loadWeeklyStats = async (maxWeeks: number) => {

    console.log('Loading weekly stats')
    const playersObj: Record<string, any> = {}

    const DoAllWeeks = async (url: string, max_weeks: number) => {
        let i: number
        for (i = 1; i <= max_weeks; i++) {
            await getWeeklyData(`${url}${i}`, i, maxWeeks)
        }
    }

    const getWeeklyData = async (url: string, week: number, maxWeeks: number) => {
        let data: any
        try {
            const response = await fetch(url)
            const json = await response.json()
            data = json
            console.log(`Retrieved JSON for week ${week}`)
        } catch (error) {
            console.log('ERROR', error)
            data = parseJSON('season.json')
        }

        playersObj[week] = {}

        const allPlayers = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
        const ids = Object.keys(allPlayers)

        await Promise.all(ids.map(async id => {
            if (data[id] && (isNullOrUndefined(data[id]['gp']) || data[id]['gp'] > -1)) {
                //For defenses
                if (allPlayers[id].position === EligiblePositions.DEF) {
                    playersObj[week][id] = { ...data[id], gp: 1, gms_active: 1, pts_ppr: calculateDefPPR(data[id]) }
                }
                else {
                    playersObj[week][id] = { ...data[id], pts_ppr: calculatePPR(data[id]) }
                }
            }
        }))

        console.log(`done querying week ${week}`)
    }

    const BASE_URL = 'https://api.sleeper.app/v1/stats/nfl/regular/2023/'

    await DoAllWeeks(BASE_URL, maxWeeks)

    const allPlayersString = JSON.stringify(playersObj)
    fs.writeFileSync(`${filePath}/weeks.json`, allPlayersString, 'utf8')

    console.log('Loaded weekly stats')

}