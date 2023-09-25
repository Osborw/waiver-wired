<<<<<<< HEAD
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
=======
import { EligiblePositions } from '../../shared/types'

export const top50 = async (position: EligiblePositions) => {
  const res = await fetch(`http://localhost:3001/allSeason/${position}`)
  const data = await res.json()
  return data
}

export const fiveWeekTop50 = async (position: EligiblePositions)=> {
  const res = await fetch(`http://localhost:3001/fiveWeeks/${position}`)
  const data = await res.json()
>>>>>>> 8a50390 (start ts conversion for ui)
  return data
}