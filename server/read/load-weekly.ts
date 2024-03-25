import fetch from 'node-fetch'
import { Player, WeeklyStats } from '../../shared/types'
import { mapWeekDataToFantasyStats } from './mapper'
import { readUnits, writePlayers } from '../dbs/main'

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

        const allUnitsObj = await readUnits()

        const ids = Object.keys(allUnitsObj)

        ids.forEach(async id => {
            if (!data[id]) return
            const weekData = mapWeekDataToFantasyStats(data[id])
            if (weekData && weekData.gp != undefined && weekData.gp >= 1) {

                const weeklyStats: WeeklyStats = {
                    id,
                    weekNumber: week,
                    gp: 1,
                    weekStats: weekData
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

    //write to DB
    writePlayers(playerObj)

    console.log('Loaded weekly stats')

}