import { calculateData } from './calculators'
import { loadPlayers } from './load-players'
import { loadRosters } from './load-rosters'
import { loadSeasonStats } from './load-season'
import { loadWeeklyStats } from './load-weekly'

const main = async () => {

    const MAX_WEEKS = 2 

    await loadPlayers()
    await loadSeasonStats()
    await loadWeeklyStats(MAX_WEEKS)
    await loadRosters()
    await calculateData(MAX_WEEKS)
}

main()