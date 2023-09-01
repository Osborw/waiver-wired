import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { EligiblePositions } from '../../shared/types'
import { calculateDefPPR, calculatePPR } from './calculators'

const filePath = path.resolve('files')

const parseJSON = (filename: string) => {
    const rawdata = fs.readFileSync(`files/${filename}`).toString()
    return JSON.parse(rawdata)
}

// READ IN SEASON STATS
export const loadSeasonStats = async () => {
    console.log('Loading season stats')
    const URL = 'https://api.sleeper.app/v1/stats/nfl/regular/2022'

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

    const allPlayersObj = {}

    const allPlayers = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
    const ids = Object.keys(allPlayers)

    ids.map(async id => {
        if (data[id]) {
            try {
                let player
                if (allPlayers[id].position === EligiblePositions.DEF) {
                    player = {
                        ...data[id],
                        pts_ppr: calculateDefPPR(data[id]),
                        gms_active: data[id]['gp']
                    }
                }
                else {
                    player = {
                        ...data[id],
                        pts_ppr: calculatePPR(data[id])
                    }
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