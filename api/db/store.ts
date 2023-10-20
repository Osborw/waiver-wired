import { readPlayers } from './readFile'
import { CalculatedPlayer, Player, SearchPosition, SleeperPosition } from '../../shared/types'
import { calculateAvgPoints, calculateGP, calculateStdDev } from './calculators'
import { getPlayersByPosition } from '../../shared/position-logic'

export const getTopPlayers = async (position: SearchPosition, startWeek: number, endWeek: number) => {
  const players = await readPlayers()

  const positionPlayers: Player[] = getPlayersByPosition(players, position)
  const calculatedPlayers: CalculatedPlayer[] = []

  //given weeks, determine avgPtsPPR and stdDev
  positionPlayers.forEach(p => {
    //calculatePPR
    const avgPoints = calculateAvgPoints(p, startWeek, endWeek) 
    
    //calculateStdDev
    const stdDev = calculateStdDev(p, startWeek, endWeek)
    
    //calculateGamesPlayed
    const gp = calculateGP(p, startWeek, endWeek)

    calculatedPlayers.push({
      ...p,
      fantasyPositions: p.fantasyPositions as SleeperPosition[],
      avgPoints,
      stdDev,
      gp,
    })
  })  

  const ordered = calculatedPlayers.sort((a, b) => b.avgPoints - a.avgPoints)
  const numPlayersToShow = position === SearchPosition.FLEX ? 200 : 100
  const limited = ordered.slice(0, numPlayersToShow)

  return limited
}