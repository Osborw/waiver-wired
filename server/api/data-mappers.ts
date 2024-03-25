import { SearchPosition } from "../../shared/types"
import { getLeague, getOwner } from "./external-calls"

//TOOD: add error checking
export const getOwnerName = async (ownerId: string): Promise<string> => {
  const owner = await getOwner(ownerId)
  
  const displayName = owner.display_name

  return displayName 
}

export const getLeaguePositionsFromExternal = async (leagueId: string): Promise<SearchPosition[]> => {
  const league = await getLeague(leagueId)

  //really we should verify that league has the format we're expecting. Or at least, roster positions is.
  const positionsArray = league.roster_positions as any[]

  const keys = Object.keys(SearchPosition)

  const onlySearchPositions = positionsArray.filter(pos => pos !== "BN")
  const validSearchPositions = onlySearchPositions.filter(pos => keys.includes(pos))

  if(onlySearchPositions.length !== validSearchPositions.length) {
    console.error(`Error retrieving positions from league request with leagueId: ${leagueId}`, JSON.stringify(league))
    throw new Error(`invalid positions recieved from league request with leagueId; ${leagueId}`)
  }

  return validSearchPositions
}