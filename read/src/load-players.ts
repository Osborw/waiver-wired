
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { Defense, EligiblePositions, Player, RawPlayer } from '../../shared/types'
import { getPositionFromEnum, isDefense, isEligiblePosition } from '../../shared/common'

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

    const allPlayersObj: Record<string, any> = {}

    let allPlayerKeys = new Set()

    Object.keys(data).map(async (id: string) => {
        const player: RawPlayer = data[id]
        const position = player.position
        if (isDefense(position)) {
            Object.keys(player).map(key => {
                allPlayerKeys.add(key)
            })
        }

        const name = player.full_name ? player.full_name.replace(`'`, `\\'`) : (isDefense(position) ? `${player.first_name} ${player.last_name}` : 'NA_Name')
        const team = player.team || 'FA'
        const status = player.status
        const injury_status = player.injury_status
        const active = player.active || false
        const age = player.age || -1
        const years_exp = player.years_exp === null ? -1 : player.years_exp
        const number = player.number || -1
        const height = player.height ? player.height.replace(`'`, `\\'`) : null
        const weight = player.weight || null 
        const depth_chart_position = player.depth_chart_position
        const depth_chart_order = player.depth_chart_order
        const fantasy_data_id =
            player.fantasy_data_id === null ? -1 : player.fantasy_data_id
        const stats_id = player.stats_id === null ? -1 : player.stats_id
        const espn_id = player.espn_id === null ? -1 : player.espn_id
        const search_rank = player.search_rank === null ? -1 : player.search_rank
        const fantasy_positions = player.fantasy_positions || ['NA']
        if (position && !isDefense(position) && active && isEligiblePosition(position)) {
            fantasy_positions.map(async (p: string) => {
                try {
                    const playerObj: Player = {
                        id,
                        name,
                        team,
                        position: getPositionFromEnum(position),
                        fantasy_position: getPositionFromEnum(p),
                        status,
                        injury_status,
                        active,
                        age,
                        years_exp,
                        number,
                        height,
                        weight,
                        depth_chart_position: depth_chart_position as unknown as EligiblePositions,
                        depth_chart_order,
                        search_rank,
                        fantasy_data_id,
                        stats_id,
                        espn_id,
                        owner_id: ''
                    }
                    allPlayersObj[id] = playerObj
                } catch (err) {
                    console.log(err)
                }
            })
        }
        else if (isDefense(position) && active) {
            try {
                const playerObj: Defense = {
                    id,
                    name,
                    team,
                    position: EligiblePositions.DEF,
                    fantasy_position: EligiblePositions.DEF,
                    active,
                }
                allPlayersObj[id] = playerObj
            } catch (err) {
                console.log(err)
            }
        }
    })

    console.log('num players loaded:', Object.keys(allPlayersObj).length)
    const allPlayersString = JSON.stringify(allPlayersObj)
    fs.writeFileSync(`${filePath}/players.json`, allPlayersString, 'utf8')
}
