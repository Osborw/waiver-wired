import { LeagueReturn } from '../../../shared/api-types'

export const getLeague = async (leagueId: string, userId: string) => {
  const res = await fetch(`http://localhost:3001/league/${leagueId}/${userId}`)
  const data: LeagueReturn = await res.json()
  return data
}

interface GetLeaguesByUserIdReturn {
  league_id: string
  name: string
  avatar: string
}

export interface LeagueInfo {
  leagueId: string
  name: string
  avatar: string
}

export const getLeaguesByUserId = async (userId: string): Promise<LeagueInfo[]> => {
  //TODO: Make this by env or something
  const season = '2024'
  const res = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${season}`)
  const data: GetLeaguesByUserIdReturn[] = await res.json()

  const leagues: LeagueInfo[] = data.map(league => ({
    leagueId: league.league_id,
    name: league.name,
    avatar: league.avatar
  }))

  return leagues
}

interface GetUserFromSleeperReturn {
  display_name: string
  user_id: string
}

export const getUserIdByUsername = async (username: string) => {
  const res = await fetch(`https://api.sleeper.app/v1/user/${username}`)
  const data: GetUserFromSleeperReturn = await res.json()
  const userId = data?.user_id 
  return userId 
}