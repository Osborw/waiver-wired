import { std } from "mathjs"
import { CalculatedPlayer, Player, SleeperPosition, TieredPlayer } from "../../shared/types"

const calculateAverage = (array: number[]) => {
  return array.reduce((a,b) => a + b) / array.length
}

export const calculateBasicStatsForPlayers = (players: Player[], startWeek: number, endWeek: number) => {
  const calculatedPlayers: CalculatedPlayer[] = []

  players.forEach(p => {
    const avgPoints = calculateAvgPoints(p, startWeek, endWeek) 
    const stdDev = calculateStdDev(p, startWeek, endWeek)
    const gp = calculateGP(p, startWeek, endWeek)

    calculatedPlayers.push({
      ...p,
      fantasyPositions: p.fantasyPositions as SleeperPosition[],
      avgPoints,
      stdDev,
      gp,
    })
  })

  return calculatedPlayers
}

const calculateAvgPoints = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return calculateAverage(relevantWeeks.map(w => w.ptsPPR))
}

const calculateStdDev = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return Number(std(relevantWeeks.map(w => w.ptsPPR)))
}

const calculateGP = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return relevantWeeks.length 
}

export const calculateTiers = (players: CalculatedPlayer[]) => {
  /**
   * I tried to write this so it didn't need documentation, but the algo isn't really readable
   * Algo:
   * For any given array of players = [p1, p2, p3, ..., pn]
   * Start at Tier 1, and begin at the first player p1
   * starting at p1, iteraate to the next player (p2)
   * if the stdDev of their values is less than the stdDevGoal (chosen by trial and error):
   *  iterate to the next player (p3), and find the standard deviation between all 3 values.
   * if the stdDev of these values is ever greater than the stdDevGoal (chosen by trial and error):
   *  it means the values are too different and the last should not be part of the tier (group)
   * 
   * save the tier within those grouped values, adding the number of the difference between the tiers to the first
   * 
   */
  const tiersList: TieredPlayer[] = []
  let tier = 1
  let tier1Score = 0
  let startingIndex = 0
  while(startingIndex < players.length-1) {
    for(let endingIndex = startingIndex; endingIndex < players.length; endingIndex = endingIndex + 1) {
      const selection = players.slice(startingIndex,endingIndex+1).map(p => p.avgPoints)
      const stdDev = Number(std(selection))
      const avg = selection.reduce((a,b) => a + b) / selection.length

      const stdDevGoal = .8

      if(stdDev > stdDevGoal || endingIndex === players.length - 1) {
        for(let iterator = startingIndex; iterator < endingIndex; iterator = iterator + 1){
          if(iterator === startingIndex) tiersList[iterator] = {...players[iterator], tier, tierDiff: tier === 1 ? 0 : tier1Score - avg}
          else tiersList[iterator] = {...players[iterator], tier}
        }
        if(endingIndex === players.length - 1) tiersList[endingIndex] = {...players[endingIndex], tier}

        if (tier === 1) tier1Score = avg

        startingIndex = endingIndex 
        tier = tier + 1
        break
      }
    }
  }

  return tiersList
}