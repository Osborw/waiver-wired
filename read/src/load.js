
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const math = require('mathjs')
const { promisify, isNullOrUndefined } = require('util')
require('dotenv').config({ path: '../.env' })

const filePath = path.resolve('files')
const ELIGIBLE_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF']
const MAX_WEEKS = process.env.WEEK

const parseJSON = filename => {
    const rawdata = fs.readFileSync(`files/${filename}`)
    return JSON.parse(rawdata)
}

// READ IN PLAYERS
export const players = async db => {
    return new Promise(async (res, rej) => {
        console.log('loading players')
        const URL = 'https://api.sleeper.app/v1/players/nfl'

        await getPlayerData(URL, db)
        console.log('loaded players')
        res('players')
    })
}

const getPlayerData = async (url, db) => {  
    let data
    try {
        const response = await fetch(url)
        console.log('Got players data')
        const json = await response.json()
        data = json
        console.log('Retrieved player JSON')
    } catch (error) {
        console.log('ERROR', error)
    }

    const allPlayersObj = {}

    let stuff = new Set()

    Object.keys(data).map(async id => {
        const player = data[id]
        if (player.position === 'DEF') {
            Object.keys(player).map(key => {
                stuff.add(key)
            })
        }
        const name = player.full_name ? player.full_name.replace(`'`, `\\'`) : (player.position === 'DEF' ? `${player.first_name} ${player.last_name}` : null)
        const team = player.team || 'FA'
        const position = player.position
        const status = player.status
        const injury_status = player.injury_status
        const active = player.active || false
        const age = player.age || -1
        const years_exp = player.years_exp === null ? -1 : player.years_exp
        const number = player.number || -1
        const height = player.height ? player.height.replace(`'`, `\\'`) : null
        const weight = player.weight || -1
        const depth_chart_position = player.depth_chart_position
        const depth_chart_order = player.depth_chart_order
        const fantasy_data_id =
            player.fantasy_data_id === null ? -1 : player.fantasy_data_id
        const stats_id = player.stats_id === null ? -1 : player.stats_id
        const espn_id = player.espn_id === null ? -1 : player.espn_id
        const injury_start_date =
            player.injury_start_date === undefined ? null : player.injury_start_date
        const search_rank = player.search_rank === null ? -1 : player.search_rank
        const fantasy_positions = player.fantasy_positions || ['unknown']
        if (position !== 'DEF' && active && ELIGIBLE_POSITIONS.includes(position)) {
            fantasy_positions.map(async p => {
                try {
                    const playerObj = {
                        id,
                        name,
                        team,
                        position,
                        fantasy_position: p,
                        status,
                        injury_status,
                        active,
                        age,
                        years_exp,
                        number,
                        height,
                        weight,
                        depth_chart_position,
                        depth_chart_order,
                        search_rank,
                        fantasy_data_id,
                        stats_id,
                        espn_id,
                        injury_start_date
                    }
                    allPlayersObj[id] = playerObj
                } catch (err) {
                    console.log(err)
                }
            })
        }
        else if (position === 'DEF' && active) {
            try {
                const playerObj = {
                    id,
                    name,
                    team,
                    position,
                    fantasy_position: position,
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
    fs.writeFileSync(`${filePath}/players.json`, allPlayersString, 'utf8', (err) => console.error(err))
}


// READ IN SEASON STATS
export const seasonStats = async () => {
    return new Promise(async (res, rej) => {
        console.log('Loading season stats')
        const URL = `https://api.sleeper.app/v1/stats/nfl/regular/${process.env.YEAR}`

        await getSeasonData(URL)
        console.log('Loaded season stats')
        res()
    })
}

const getSeasonData = async (url) => {
    let data
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
                if (allPlayers[id].position === 'DEF') {
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
    fs.writeFileSync(`${filePath}/season.json`, allPlayersString, 'utf8', (err) => console.error(err))
}


// READ IN Weekly STATS
export const weeklyStats = async () => {

    console.log('Loading weekly stats')
    const playersObj = {}

    const DoAllWeeks = async (url, max_weeks) => {
        let i
        for (i = 1; i <= max_weeks; i++) {
            await getWeeklyData(`${url}${i}`, i)
        }
    }

    const getWeeklyData = async (url, week) => {
        let data
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
                if (allPlayers[id].position === 'DEF') {
                    playersObj[week][id] = { ...data[id], gp: 1, gms_active: 1, pts_ppr: calculateDefPPR(data[id]) }
                }
                else {
                    playersObj[week][id] = { ...data[id], pts_ppr: calculatePPR(data[id]) }
                }
            }
        }))

        console.log(`done querying week ${week}`)
    }

    return new Promise(async (res, rej) => {
        const BASE_URL = `https://api.sleeper.app/v1/stats/nfl/regular/${process.env.YEAR}/`

        await DoAllWeeks(BASE_URL, MAX_WEEKS)

        const allPlayersString = JSON.stringify(playersObj)
        fs.writeFileSync(`${filePath}/weeks.json`, allPlayersString, 'utf8', (err) => console.error(err))

        console.log('Loaded weekly stats')
        res()
    })

}

//GET ROSTERS
export const rosters = async con => {
    return new Promise(async (res, rej) => {
        console.log('Loading rosters')
        const URL = `https://api.sleeper.app/v1/league/${process.env.SLEEPER_LEAGUE_ID}/rosters`

        await getRosterData(URL, con)
        console.log('Loaded rosters')
        res()
    })
}

const getRosterData = async (url, con) => {
    let data
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

    await Promise.all(data.map(async user => {
        const id = user.owner_id
        const players = user.players
        await Promise.all(players.map(async p => {
            if (allPlayers[p]) {
                allPlayers[p] = { ...allPlayers[p], owner_id: id }
            }
        }))
    }))

    const allPlayersString = JSON.stringify(allPlayers)
    fs.writeFileSync(`${filePath}/players.json`, allPlayersString, 'utf8', (err) => console.error(err))
}

export const calculateData = async () => {

    console.log('calculating data')
    await calculateAllDefPPR()

    let weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())

    const ids = Array.from(new Set(Object.keys(weeks).flatMap(week => {
        return Object.keys(weeks[week])
    })))

    await calculateStandardDeviation(ids)
    console.log('Done calculating data')
}

const calculateStandardDeviation = async (ids) => {
    const weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())
    let season = JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())

    ids.map(id => {
        const pprPerWeek = Object.keys(weeks).map(week => {
            if(weeks[week][id] && weeks[week][id].gp === 1) return weeks[week][id]['pts_ppr'] || 0
        })
        const filtered = pprPerWeek.filter(val => val !== undefined)
        const stddev = filtered.length > 0 ? math.std(filtered) : 0
        season[id] = {...season[id], std_dev: stddev }
    })

    const seasonString = JSON.stringify(season)
    fs.writeFileSync(`${filePath}/season.json`, seasonString, 'utf8', (err) => console.error(err))
}

const calculatePPR = (data) => {

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

    ptsPPR = math.round((ptsPPR + Number.EPSILON) * 100) / 100
    return ptsPPR
}

const calculateDefPPR = async (data) => {

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

const calculateAllDefPPR = async con => {

    let allPlayers = JSON.parse((await fs.promises.readFile(`${filePath}/players.json`)).toString())
    let weeks = JSON.parse((await fs.promises.readFile(`${filePath}/weeks.json`)).toString())
    let season = JSON.parse((await fs.promises.readFile(`${filePath}/season.json`)).toString())
    const allIds = Object.keys(allPlayers)
    const defenses = allIds.map(id => {
        if (allPlayers[id]['position'] === 'DEF') return id
    })

    const calculateDefPPR = async (id) => {
        let sum = 0
        let i
        for (i = 1; i <= MAX_WEEKS; i++) {
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
        await calculateDefPPR(id)
    }))

    const allWeeksString = JSON.stringify(weeks)
    fs.writeFileSync(`${filePath}/weeks.json`, allWeeksString, 'utf8', (err) => console.error(err))
    const seasonString = JSON.stringify(season)
    fs.writeFileSync(`${filePath}/season.json`, seasonString, 'utf8', (err) => console.error(err))
}

