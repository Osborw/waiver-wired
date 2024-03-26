import { std, round } from "mathjs"
import { FantasyStats, CalculatedPlayer, Player, SleeperPosition, TieredPlayer } from "../../shared/types"

const calculateAverage = (array: number[]) => {
  return array.reduce((a,b) => a + b) / array.length
}

export const calculateBasicStatsForPlayers = (players: Player[], startWeek: number, endWeek: number, ownerId: string) => {
  const calculatedPlayers: CalculatedPlayer[] = []

  players.forEach(p => {
    const avgPoints = calculateAvgPoints(p, startWeek, endWeek) 
    const stdDev = calculateStdDev(p, startWeek, endWeek)
    const gp = calculateGP(p, startWeek, endWeek)

    calculatedPlayers.push({
      ...p,
      ownerId,
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



export const calculatePPR = (data: Partial<FantasyStats>) => {

    let ptsPPR = 
    (data.passYd || 0) * .04 +
    (data.passTd || 0) * 4 +
    (data.pass2pt || 0) * 2 +
    (data.passInt || 0) * -1 +
    (data.rushYd || 0) * .1 +
    (data.rushTd || 0) * 6 +
    (data.rush2pt || 0) * 2 +
    (data.rec || 0) * 1 +
    (data.recYd || 0) * .1 +
    (data.recTd || 0) * 6 +
    (data.rec2pt || 0) * 2 +
    (data.fgm0_19 || 0) * 3 +
    (data.fgm20_29 || 0) * 3 +
    (data.fgm30_39 || 0) * 3 +
    (data.fgm40_49 || 0) * 4 +
    (data.fgm50p || 0) * 5 +
    (data.xpm || 0) * 1 +
    (data.fgMiss || 0) * -1 +
    (data.xpMiss || 0) * -1 +
    (data.fum || 0) * -1

    ptsPPR = round((ptsPPR + Number.EPSILON) * 100) / 100
    return ptsPPR
}

export const calculateDefPPR = (data: Partial<FantasyStats>) => {

    let ptsPPR = 
    (data.ptsAllow0 || 0) * 10 + 
    (data.ptsAllow1_6 || 0) * 7 + 
    (data.ptsAllow7_13 || 0) * 4 + 
    (data.ptsAllow14_20 || 0) + 
    (data.ptsAllow28_34 || 0) * -1 + 
    (data.ptsAllow35p || 0) * -4 + 
    (data.defStFF || 0) +
    (data.ff || 0) + 
    (data.fumRec || 0) * 2 + 
    (data.int || 0) * 2 + 
    (data.sack || 0) + 
    (data.defTd || 0) * 6 + 
    (data.defStTd|| 0) * 6 + 
    (data.safe || 0) * 2 + 
    (data.def2Pt || 0) * 2

    return ptsPPR
}