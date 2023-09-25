import { EligiblePositions } from '../../shared/types'

export const top50 = async (position: EligiblePositions) => {
  const res = await fetch(`http://localhost:3001/allSeason/${position}`)
  const data = await res.json()
  return data
}

export const fiveWeekTop50 = async (position: EligiblePositions)=> {
  const res = await fetch(`http://localhost:3001/fiveWeeks/${position}`)
  const data = await res.json()
  return data
}