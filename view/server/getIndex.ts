import { SearchPosition } from '../../shared/types'
import { TopPlayerReturn } from '../../shared/api-types'

export const topPlayers = async (position: SearchPosition) => {
  const res = await fetch(`http://localhost:3001/allSeason/${position}`)
  const data: TopPlayerReturn = await res.json()
  return data
}

export const fiveWeekTopPlayers = async (position: SearchPosition)=> {
  const res = await fetch(`http://localhost:3001/fiveWeeks/${position}`)
  const data: TopPlayerReturn = await res.json()
  return data
}