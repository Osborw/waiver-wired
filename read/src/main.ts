import { calculateData } from './calculators'
import { loadPlayers } from './load-players'
import { loadRosters } from './load-rosters'
import { loadSeasonStats } from './load-season'
import { loadWeeklyStats } from './load-weekly'
require('dotenv').config({ path: '../.env' })

const main = async () => {

    const envWeek = process.env.WEEK
    if(!envWeek) throw new Error('No WEEK provided, please include a .env file with WEEK')
    const WEEK = parseInt(envWeek)
    const envYear = process.env.YEAR
    if(!envYear) throw new Error('No YEAR provided, please include a .env file with YEAR')
    const YEAR = parseInt(envYear)
    const LEAGUE_ID = process.env.SLEEPER_LEAGUE_ID
    if(!LEAGUE_ID) throw new Error('No YEAR provided, please include a .env file with YEAR')

    await loadPlayers()
    await loadSeasonStats(YEAR)
    await loadWeeklyStats(WEEK, YEAR)
    await loadRosters(LEAGUE_ID)
    await calculateData(WEEK)
}

main()