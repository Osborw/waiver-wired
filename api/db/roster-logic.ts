import { sort } from 'mathjs'
import { CalculatedPlayer, Lineup, Roster, SearchPosition, SleeperPosition, } from '../../shared/types'

const isQB = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.QB)
const isWR = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.WR)
const isRB = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.RB)
const isTE = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.TE)
const isK = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.K)
const isDEF = (p: CalculatedPlayer) => p.fantasyPositions.includes(SleeperPosition.DEF)
const isFLEX = (p: CalculatedPlayer) =>
  p.fantasyPositions.includes(SleeperPosition.RB) ||
  p.fantasyPositions.includes(SleeperPosition.WR) ||
  p.fantasyPositions.includes(SleeperPosition.TE)

const sortByPoints = (a: CalculatedPlayer, b: CalculatedPlayer) => {
  if (a.avgPoints === b.avgPoints) return b.stdDev - a.stdDev
  else return b.avgPoints - a.avgPoints
}

export const createStartingLineup = (players: CalculatedPlayer[]) => {
  const playersCopy = players.slice(0).sort(sortByPoints)

  const startingLineup: Lineup = {
    QB: grabBestPlayer(SearchPosition.QB, playersCopy),
    RB: grabBestPlayer(SearchPosition.RB, playersCopy),
    WR: grabBestPlayer(SearchPosition.WR, playersCopy),
    TE: grabBestPlayer(SearchPosition.TE, playersCopy),
    FLEX: grabBestPlayer(SearchPosition.FLEX, playersCopy),
    K: grabBestPlayer(SearchPosition.K, playersCopy),
    DEF: grabBestPlayer(SearchPosition.DEF, playersCopy),
  }

  return startingLineup

}

const grabBestPlayer = (pos: SearchPosition, players: CalculatedPlayer[]) => {

  let idx = -1
  if(pos === SearchPosition.QB) idx = players.findIndex((p) => isQB(p))
  else if(pos === SearchPosition.RB) idx = players.findIndex((p) => isRB(p))
  else if(pos === SearchPosition.WR) idx = players.findIndex((p) => isWR(p))
  else if(pos === SearchPosition.TE) idx = players.findIndex((p) => isTE(p))
  else if(pos === SearchPosition.FLEX) idx = players.findIndex((p) => isFLEX(p))
  else if(pos === SearchPosition.K) idx = players.findIndex((p) => isK(p))
  else if(pos === SearchPosition.DEF) idx = players.findIndex((p) => isDEF(p))
  
  if(idx === -1) return []

  const p = players.splice(idx, 1)
  return p

}

export const rosterSumAvgStats = (startingLineup: Lineup, pos?: SearchPosition) => {

  if(pos === SearchPosition.QB) return startingLineup.QB.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.RB) return startingLineup.RB.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.WR) return startingLineup.WR.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.TE) return startingLineup.TE.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.FLEX) return startingLineup.FLEX.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.K) return startingLineup.K.reduce((acc,p) => acc + p.avgPoints, 0)
  else if(pos === SearchPosition.DEF) return startingLineup.DEF.reduce((acc,p) => acc + p.avgPoints, 0)
  else return 0
}

export const rosterSumStdDev = (startingLineup: Lineup, pos?: SearchPosition) => {

  if(pos === SearchPosition.QB) return startingLineup.QB.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.RB) return startingLineup.RB.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.WR) return startingLineup.WR.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.TE) return startingLineup.TE.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.FLEX) return startingLineup.FLEX.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.K) return startingLineup.K.reduce((acc,p) => acc + p.stdDev, 0)
  else if(pos === SearchPosition.DEF) return startingLineup.DEF.reduce((acc,p) => acc + p.stdDev, 0)
  else return 0
}

export const fillInRosterRanks = (rosters: Roster[]) => {
  //avgpts
  rosters.sort((a,b) => b.avgPoints.startingStatSum - a.avgPoints.startingStatSum)
  rosters.forEach((r, idx) => r.avgPoints.rank = idx + 1 )
  //stddev
  rosters.sort((a,b) => b.stdDev.startingStatSum - a.stdDev.startingStatSum)
  rosters.forEach((r, idx) => r.stdDev.rank = idx + 1 )
  //qb
  rosters.sort((a,b) => b.QB.startingStatSum - a.QB.startingStatSum)
  rosters.forEach((r, idx) => r.QB.rank = idx + 1 )
  //rb
  rosters.sort((a,b) => b.RB.startingStatSum - a.RB.startingStatSum)
  rosters.forEach((r, idx) => r.RB.rank = idx + 1 )
  //wr
  rosters.sort((a,b) => b.WR.startingStatSum - a.WR.startingStatSum)
  rosters.forEach((r, idx) => r.WR.rank = idx + 1 )
  //te
  rosters.sort((a,b) => b.TE.startingStatSum - a.TE.startingStatSum)
  rosters.forEach((r, idx) => r.TE.rank = idx + 1 )
  //flex
  rosters.sort((a,b) => b.FLEX.startingStatSum - a.FLEX.startingStatSum)
  rosters.forEach((r, idx) => r.FLEX.rank = idx + 1 )
  //k
  rosters.sort((a,b) => b.K.startingStatSum - a.K.startingStatSum)
  rosters.forEach((r, idx) => r.K.rank = idx + 1 )
  //def
  rosters.sort((a,b) => b.DEF.startingStatSum - a.DEF.startingStatSum)
  rosters.forEach((r, idx) => r.DEF.rank = idx + 1 )
}