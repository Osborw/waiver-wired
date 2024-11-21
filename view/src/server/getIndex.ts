import { LeagueReturn } from '../../../shared/api-types'

export const getLeague = async (leagueId: string, userId: string) => {
  const res = await fetch(`http://localhost:3001/league/${leagueId}/${userId}`)
  const data: LeagueReturn = await res.json()
  return data
}

//TODO: Be able to search for leagues by user
export const getLeaguesForUser = async (userId: string) => {
  return userId
}