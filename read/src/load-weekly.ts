import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { FantasyStats, Player, SleeperPosition, SleeperUnit, WeeklyStats } from '../../shared/types'
import { calculateDefPPR, calculatePPR } from './calculators'
import { mapWeekDataToFantasyStats } from './mapper'

const filePath = path.resolve('files')

const parseJSON = (filename: string) => {
    const rawdata = fs.readFileSync(`files/${filename}`).toString()
    return JSON.parse(rawdata)
}

// READ IN Weekly STATS
export const loadWeeklyStats = async (maxWeeks: number, year: number) => {
    console.log('Loading weekly stats')

    const baseUrl = `https://api.sleeper.app/v1/stats/nfl/regular/${year}`

    const playerObj: Record<string, Player> = {}

    let week: number
    for (week = 1; week <= maxWeeks; week++) {
        const url = `${baseUrl}/${week}`

        let data: any
        try {
            const response = await fetch(url)
            const json = await response.json()
            data = json
            console.log(`Retrieved JSON for week ${week}`)
        } catch (error) {
            console.log('ERROR', error)
            return
        }

        const allUnitsObj: Record<string, SleeperUnit> = JSON.parse((await fs.promises.readFile(`${filePath}/units.json`)).toString())

        const ids = Object.keys(allUnitsObj)

        ids.forEach(async id => {
            if (!data[id]) return
            const weekData = mapWeekDataToFantasyStats(data[id])
            if (weekData && weekData.gp != undefined && weekData.gp >= 1) {

                const isDefense = allUnitsObj[id].position === SleeperPosition.DEF

                const weeklyStats: WeeklyStats = {
                    id,
                    weekNumber: week,
                    gp: 1,
                    ptsPPR: isDefense ? calculateDefPPR(weekData) : calculatePPR(weekData)
                }

                if (!playerObj[id]) {
                    const unit = allUnitsObj[id]
                    const player: Player = {
                        id,
                        fullName: unit.fullName,
                        firstName: unit.firstName,
                        lastName: unit.lastName,
                        fantasyPositions: unit.fantasyPositions,
                        injuryStatus: unit.injuryStatus,
                        team: unit.team,
                        ownerId: null,
                        weeklyStats: [weeklyStats]
                    }
                    playerObj[id] = player
                } else {
                    playerObj[id].weeklyStats.push(weeklyStats)
                }
            }
        })

        console.log(`done querying week ${week}`)
    }

    const allPlayersString = JSON.stringify(playerObj)
    fs.writeFileSync(`${filePath}/players.json`, allPlayersString, 'utf8')

    console.log('Loaded weekly stats')

}