import { loadPlayers } from './load-players'
import { loadWeeklyStats } from './load-weekly'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const main = async () => {

    const envWeek = process.env.WEEK
    if (!envWeek) throw new Error('No WEEK provided, please include a .env file with WEEK')
    const WEEK = parseInt(envWeek)
    const envYear = process.env.YEAR
    if (!envYear) throw new Error('No YEAR provided, please include a .env file with YEAR')
    const YEAR = parseInt(envYear)

    await loadPlayers()
    await loadWeeklyStats(WEEK, YEAR)
}

main()