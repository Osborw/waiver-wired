import { std } from "mathjs"
import { Player } from "../../shared/types"

export const calculateAverage = (array: number[]) => {
  return array.reduce((a,b) => a + b) / array.length
}

export const calculateAvgPoints = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return calculateAverage(relevantWeeks.map(w => w.ptsPPR))
}

export const calculateStdDev = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return Number(std(relevantWeeks.map(w => w.ptsPPR)))
}

export const calculateGP = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return relevantWeeks.length 
}
