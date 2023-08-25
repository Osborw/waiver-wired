import * as LoadLocal from './load'

const main = async () => {

    await LoadLocal.players()
    await LoadLocal.seasonStats()
    await LoadLocal.weeklyStats()
    await LoadLocal.rosters()
    await LoadLocal.calculateData()
}

main()