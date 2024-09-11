import { mapWeekDataToFantasyStats } from "../../shared/stats-mapper"
import { FantasyStats, SearchPosition } from "../../shared/types"
import { getLeague, getLeagueUsers, getRosters } from "./external-calls"

interface LeagueRules {
  leagueRosterSpots: SearchPosition[]
  leagueValidRosterPositions: SearchPosition[]
  leagueScoringSettings: Partial<FantasyStats>
}

export const getLeagueRulesFromExternal = async (leagueId: string): Promise<LeagueRules> => {
  const league = await getLeague(leagueId)

  //TODO:
  //really we should verify that league has the format we're expecting. Or at least, roster positions is.
  const rawRosterPositionsArray = league.roster_positions as any[]
  const validSearchPositions = getLeaguePositions(rawRosterPositionsArray, leagueId)

  const rawScoringSettings = league.scoring_settings as any
  const validScoringSettings = getLeagueScoringSettings(rawScoringSettings, leagueId)

  return {
    leagueRosterSpots: validSearchPositions,
    leagueValidRosterPositions: validSearchPositions,
    leagueScoringSettings: validScoringSettings
  }
}

const getLeaguePositions = (rawRosterPositionsArray: any[], leagueId: string): SearchPosition[] => {
  const keys = Object.keys(SearchPosition)

  const onlySearchPositions = rawRosterPositionsArray.filter(pos => pos !== "BN")
  const validSearchPositions = onlySearchPositions.filter(pos => keys.includes(pos))

  if(onlySearchPositions.length !== validSearchPositions.length) {
    console.error(`Error retrieving positions from league request with leagueId: ${leagueId}`, JSON.stringify(rawRosterPositionsArray))
    throw new Error(`invalid positions recieved from league request with leagueId; ${leagueId}`)
  }

  return validSearchPositions
}

const getLeagueScoringSettings = (rawScoringSettings: any, leagueId: string): Partial<FantasyStats> => {
  const scoringSettings = mapWeekDataToFantasyStats(rawScoringSettings)

  //Error checking
  const givenScoringKeys = Object.keys(rawScoringSettings)
  const foundScoringKeys = Object.keys(scoringSettings)
  const missingKeys: string[] = []

  givenScoringKeys.forEach(given => {
    if (!foundScoringKeys.includes(given)) missingKeys.push(given)
  })

  if (missingKeys.length > 0){
    console.error(`Error getting scoring settings with leagueId: ${leagueId}`, `Given unknown keys: ${JSON.stringify(missingKeys)}`)
    throw new Error(`invalid settings recieved from league request with leagueId; ${leagueId}`)
  }

  return scoringSettings
}

type PlayerId = string
type OwnerId = string

export const getRosteredPlayersFromExternal = async (leagueId: string): Promise<Record<PlayerId, OwnerId>> => {
  const rosterData = await getRosters(leagueId)

  const rosteredPlayers: Record<string, string> = {} 

  rosterData.forEach((roster:any) => {
    const playerIds = roster.players as string[]
    const ownerId = roster.owner_id as string
    playerIds.forEach(id => rosteredPlayers[id] = ownerId)
  })

  return rosteredPlayers
}

export interface SleeperUser {
  teamName: string
  displayName: string
  userId: string
}

export const getUserMetatdataFromExternal = async (leagueId: string): Promise<Record<OwnerId, SleeperUser>> => {
  const leagueUsers = await getLeagueUsers(leagueId)

  //error checking
  if(leagueUsers.length === 0) throw new Error(`No users in league ${leagueId}`)

  const allUsersObject: Record<string, SleeperUser> = {}

  leagueUsers.forEach((user: any) => {
    const id = user.user_id as string

    const sleeperUser: SleeperUser = {
      teamName: user.metadata.team_name as string,
      displayName: user.display_name as string,
      userId: id 
    }

    allUsersObject[id] = sleeperUser
  })

  return  allUsersObject
}