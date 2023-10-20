import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { SleeperInjuryStatus, SleeperPlayer, SleeperPosition, SleeperUnit } from '../../shared/types'

const filePath = path.resolve('files')

// READ IN PLAYERS
export const loadPlayers= async () => {
    console.log('loading players')
    const URL = 'https://api.sleeper.app/v1/players/nfl'

    await getPlayerData(URL)
    console.log('loaded players')
}

const getPlayerData = async (url: string) => {
    let data: any
    try {
        const response = await fetch(url)
        console.log('Got players data')
        const json = await response.json()
        data = json
        console.log('Retrieved player JSON')
    } catch (error) {
        console.log('ERROR', error)
    }

    const allUnitsObj: Record<string, SleeperUnit> = {}
    const allPlayersObj: Record<string, SleeperPlayer> = {}
    const allDefObj: Record<string, SleeperUnit> = {}

    Object.keys(data).forEach(async (id: string) => {
        const player = data[id]
        const active: boolean = player.active

        if(!active) return

        const position = player.position
        const firstName: string = player.first_name.replace(`'`, `\\'`)
        const lastName: string = player.last_name.replace(`'`, `\\'`)
        const fullName: string = `${firstName} ${lastName}` 
        const team: string = player.team || 'FA'
        const injuryStatus: SleeperInjuryStatus | null = player.injury_status
        const fantasyPositions: SleeperPosition[] = player.fantasy_positions

        if(position === SleeperPosition.DEF) {
            const defense: SleeperUnit = {
                id,
                position,
                fantasyPositions,
                firstName,
                lastName,
                fullName,
                team,
                active,
                injuryStatus,
            }
            allUnitsObj[id] = defense
            allDefObj[id] = defense
            return
        }

        const age = player.age
        const yearsExperience = player.years_exp
        const number = player.number
        const height = player.height.replace(`'`, `\\'`)
        const weight = player.weight
        const depthChartOrder = player.depth_chart_order

        const sleeperPlayer: SleeperPlayer = {
            id,
            fullName,
            firstName,
            lastName,
            yearsExperience,
            team,
            position,
            fantasyPositions,
            injuryStatus,
            active,
            age,
            number,
            height,
            weight,
            depthChartOrder,
        }
        allPlayersObj[id] = sleeperPlayer 
        allUnitsObj[id] = sleeperPlayer
    })

    console.log('num players loaded:', Object.keys(allUnitsObj).length)
    const allUnitsString = JSON.stringify(allUnitsObj)
    fs.writeFileSync(`${filePath}/units.json`, allUnitsString, 'utf8')
}
