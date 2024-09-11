import math, { std } from "mathjs"
import { FantasyStats, CalculatedPlayer, Player, SleeperPosition, TieredPlayer, WeekWindow } from "../../shared/types"

const calculateAverage = (array: number[]) => {
  return array.reduce((a,b) => a + b) / array.length
}

interface CalculateBasicStatsForPlayersProps {
  players: Player[],
  startWeek: number,
  endWeek: number,
  leagueScoringSettings: Partial<FantasyStats>
  rosteredPlayers: Record<string, string>
}

export const calculateBasicStatsForPlayers = ({
  players,
  endWeek,
  leagueScoringSettings,
  rosteredPlayers
}: CalculateBasicStatsForPlayersProps) => {
  const calculatedPlayers: CalculatedPlayer[] = []
  const fiveWeeksAgo = math.max(endWeek - 5, 1)

  players.forEach(p => {
    calculatePtsPerWeek(p, endWeek, leagueScoringSettings)

    calculatedPlayers.push({
      ...p,
      ownerId: rosteredPlayers[p.id] || null,
      fantasyPositions: p.fantasyPositions as SleeperPosition[],
      seasonMetrics: {
        avgPoints: calculateAvgPoints(p, 1, endWeek), 
        stdDev: calculateStdDev(p, 1, endWeek),
        gp: calculateGP(p, 1, endWeek)
      },
      fiveWeekMetrics: {
        avgPoints: calculateAvgPoints(p, fiveWeeksAgo, endWeek), 
        stdDev: calculateStdDev(p, fiveWeeksAgo, endWeek),
        gp: calculateGP(p, 1, endWeek)
      }
    })
  })

  return calculatedPlayers
}

const calculatePtsPerWeek = (player: Player, endWeek: number, leagueScoringSettings: Partial<FantasyStats>) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= 1 && w.weekNumber <= endWeek)
  relevantWeeks.forEach(week => {
    if(week.gp > 0){
      const stats = Object.entries(week.weekStats)
      let totalWeeklyPts = 0
      stats.forEach(([key, statValue]) => {
        const keyTyped = key as keyof FantasyStats;
        const pointValue = leagueScoringSettings[keyTyped] ?? 0 
        const score = pointValue * statValue 
        totalWeeklyPts += score
      })

      week.weekStats.weekScore = totalWeeklyPts
    }
  })
}

const calculateAvgPoints = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return calculateAverage(relevantWeeks.map(w => w.weekStats.weekScore ?? 0))
}

const calculateStdDev = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return Number(std(relevantWeeks.map(w => w.weekStats.weekScore ?? 0)))
}

const calculateGP = (player: Player, startWeek: number, endWeek: number) => {
  const relevantWeeks = player.weeklyStats.filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
  if(relevantWeeks.length === 0) return 0
  return relevantWeeks.length 
}

export const calculateTiers = (players: CalculatedPlayer[], weekWindow: WeekWindow) => {
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
      const selection = players.slice(startingIndex,endingIndex+1).map(p => {
        if(weekWindow === WeekWindow.FiveWeek) return p.fiveWeekMetrics.avgPoints
        else return p.seasonMetrics.avgPoints
      })
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