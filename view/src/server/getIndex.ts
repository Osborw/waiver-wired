import { LeagueReturn } from '../../../shared/api-types'

export const getLeague = async (leagueId: string, userId: string) => {
  const res = await fetch(`http://localhost:3001/league/${leagueId}/${userId}`)
  const data: LeagueReturn = await res.json()
  return data
}

export const getLeaguesForUser = async (userId: string) => {

}

// export const topPlayers = async (position: SearchPosition) => {
//   const res = await fetch(`http://localhost:3001/allSeason/${position}`)
//   const data: TopPlayerReturn = await res.json()
//   return data
// }

// export const fiveWeekTopPlayers = async (position: SearchPosition)=> {
//   const res = await fetch(`http://localhost:3001/fiveWeeks/${position}`)
//   const data: TopPlayerReturn = await res.json()
//   return data
// }

// export const getRosters = async () => {
//   const res = await fetch(`http://localhost:3001/rosters`)
//   const data: RostersReturn = await res.json()
//   return data
// }

// export const getTrades = async () => {
//   const res = await fetch(`http://localhost:3001/trades`)
//   const data: TradesReturn = await res.json()
//   return data
// }