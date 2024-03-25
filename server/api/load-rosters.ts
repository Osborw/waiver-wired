// import fetch from 'node-fetch'
// import { readPlayers, writePlayers } from '../dbs/main'

// export const loadRosters = async (leagueId: string) => {
//     console.log('Loading rosters')
//     const URL = `https://api.sleeper.app/v1/league/${leagueId}/rosters`

//     await getRosterData(URL)
//     console.log('Loaded rosters')
// }

// const getRosterData = async (url: string) => {
//     let data: any
//     try {
//         const response = await fetch(url)
//         const json = await response.json()
//         data = json
//         console.log('Retrieved JSON')
//     } catch (error) {
//         console.log('ERROR', error)
//         data = []
//     }

//     const allPlayersObj = await readPlayers() 

//     data.forEach(async (roster : any) => {
//         const id = roster.owner_id
//         const players = roster.players
//         players.forEach(async (p: any) => {
//             if (allPlayersObj[p]) {
//                 allPlayersObj[p].ownerId = id
//             }
//         })
//     })

//     writePlayers(allPlayersObj)
// }
