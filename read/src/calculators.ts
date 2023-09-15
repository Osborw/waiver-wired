import {round, std} from 'mathjs'
import fs from 'fs'
import path from 'path'
import { EligiblePositions } from '../../shared/types'

const filePath = path.resolve('files')

export const calculatePPR = (data: any) => {

    let ptsPPR = 
    (data.pass_yd || 0) * .04 +
    (data.pass_td || 0) * 4 +
    (data.pass_2pt || 0) * 2 +
    (data.pass_int || 0) * -1 +
    (data.rush_yd || 0) * .1 +
    (data.rush_td || 0) * 6 +
    (data.rush_2pt || 0) * 2 +
    (data.rec || 0) * 1 +
    (data.rec_yd || 0) * .1 +
    (data.rec_td || 0) * 6 +
    (data.rec_2pt || 0) * 2 +
    (data.fgm_0_19 || 0) * 3 +
    (data.fgm_20_29 || 0) * 3 +
    (data.fgm_30_39 || 0) * 3 +
    (data.fgm_40_49 || 0) * 4 +
    (data.fgm_50p || 0) * 5 +
    (data.xpm || 0) * 1 +
    (data.fgmiss || 0) * -1 +
    (data.xpmiss || 0) * -1 +
    (data.fum || 0) * -1

    ptsPPR = round((ptsPPR + Number.EPSILON) * 100) / 100
    return ptsPPR
}

export const calculateDefPPR = async (data: any) => {

    let ptsPPR = 
    (data.pts_allow_0 || 0) * 10 + 
    (data.pts_allow_1_6 || 0) * 7 + 
    (data.pts_allow_7_13 || 0) * 4 + 
    (data.pts_allow_14_20 || 0) + 
    (data.pts_allow_28_34 || 0) * -1 + 
    (data.pts_allow_35p || 0) * -4 + 
    (data.def_st_ff || 0) +
    (data.ff || 0) + 
    (data.fum_rec || 0) * 2 + 
    (data.int || 0) * 2 + 
    (data.sack || 0) + 
    (data.def_pr_td || 0) * 6 + 
    (data.def_st_td || 0) * 6 + 
    (data.def_td || 0) * 6 + 
    (data.def_kr_td || 0) * 6 + 
    (data.safe || 0) * 2 + 
    (data.def_2pt || 0) * 2

    return ptsPPR
}

export const calculateData = async (maxWeeks: number) => {

    console.log('calculating data')
    await calculateAllDefPPR(maxWeeks)

    let weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())

    const ids = Array.from(new Set(Object.keys(weeks).flatMap(week => {
        return Object.keys(weeks[week])
    })))

    await calculateStandardDeviation(ids)
    console.log('Done calculating data')
}

const calculateStandardDeviation = async (ids: string[]) => {
    const weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())
    let season = JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())

    ids.map(id => {
        const pprPerWeek = Object.keys(weeks).map(week => {
            if(weeks[week][id] && weeks[week][id].gp === 1) return weeks[week][id]['pts_ppr'] || 0
        })
        const filtered = pprPerWeek.filter(val => val !== undefined)
        const stddev = filtered.length > 0 ? std(filtered) : 0
        season[id] = {...season[id], std_dev: stddev }
    })

    const seasonString = JSON.stringify(season)
    fs.writeFileSync(`${filePath}/season.json`, seasonString, 'utf8')
}


const calculateAllDefPPR = async (maxWeeks: number) => {

    let allPlayers = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
    let weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())
    let season = JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())
    const allIds = Object.keys(allPlayers)
    const defenses = allIds.map(id => {
        if (allPlayers[id]['position'] === EligiblePositions.DEF) return id
    })

    const calculateDefPPR = async (id: string) => {
        let sum = 0
        let i: number
        for (i = 1; i <= maxWeeks; i++) {
            const data = weeks[i][id]

            if (!data) continue

            const ptsAllowed = data['pts_allow']

            let ptsAllowPts = 0
            if (ptsAllowed === 0) {
                ptsAllowPts = 10
            }
            else if (ptsAllowed >= 1 && ptsAllowed <= 6) {
                ptsAllowPts = 7
            }
            else if (ptsAllowed >= 7 && ptsAllowed <= 13) {
                ptsAllowPts = 4
            }
            else if (ptsAllowed >= 14 && ptsAllowed <= 20) {
                ptsAllowPts = 1
            }
            else if (ptsAllowed >= 28 && ptsAllowed <= 34) {
                ptsAllowPts = -1
            }
            else if (ptsAllowed >= 35) {
                ptsAllowPts = -4
            }

            let ptsPPR = ptsAllowPts + (data.ff || 0) + (data.fum_rec || 0) * 2 + (data.int || 0) * 2 + (data.sack || 0) + (data.def_pr_td || 0) * 6 + (data.def_st_td || 0) * 6 + (data.def_td || 0) * 6 + (data.def_kr_td || 0) * 6 + (data.safe || 0) * 2 + (data.def_2pt || 0) * 2
            sum += ptsPPR

            weeks[i][id] = { ...weeks[i][id], pts_ppr: ptsPPR }
        }

        season[id] = { ...season[id], pts_ppr: sum }
    }

    await Promise.all(defenses.map(async id => {
        await calculateDefPPR(id as string)
    }))

    const allWeeksString = JSON.stringify(weeks)
    fs.writeFileSync(`${filePath}/weeks.json`, allWeeksString, 'utf8')
    const seasonString = JSON.stringify(season)
    fs.writeFileSync(`${filePath}/season.json`, seasonString, 'utf8')
}
