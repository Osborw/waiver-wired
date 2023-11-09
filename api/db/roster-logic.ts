import { sort } from 'mathjs'
import {
  CalculatedPlayer,
  Lineup,
  Roster,
  SearchPosition,
  SleeperInjuryStatus,
  SleeperPosition,
} from '../../shared/types'

const isOut = (p: CalculatedPlayer) => {
  return (
    p.injuryStatus === SleeperInjuryStatus.IR ||
    p.injuryStatus === SleeperInjuryStatus.Out ||
    p.injuryStatus === SleeperInjuryStatus.PUP ||
    p.injuryStatus === SleeperInjuryStatus.Sus
  )
}

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
  const playersCopy = players.slice(0).sort(sortByPoints).filter(p => !isOut(p))

  const qb = grabBestPlayer(SearchPosition.QB, playersCopy)
  const rb1 = grabBestPlayer(SearchPosition.RB, playersCopy)
  const rb2 = grabBestPlayer(SearchPosition.RB, playersCopy)
  const wr1 = grabBestPlayer(SearchPosition.WR, playersCopy)
  const wr2 = grabBestPlayer(SearchPosition.WR, playersCopy)
  const te = grabBestPlayer(SearchPosition.TE, playersCopy)
  const flex1 = grabBestPlayer(SearchPosition.FLEX, playersCopy)
  const flex2 = grabBestPlayer(SearchPosition.FLEX, playersCopy)
  const k = grabBestPlayer(SearchPosition.K, playersCopy)
  const def = grabBestPlayer(SearchPosition.DEF, playersCopy)

  const startingLineup: Lineup = {
    QB: [qb].filter((p) => p !== undefined) as CalculatedPlayer[],
    RB: [rb1, rb2].filter((p) => p !== undefined) as CalculatedPlayer[],
    WR: [wr1, wr2].filter((p) => p !== undefined) as CalculatedPlayer[],
    TE: [te].filter((p) => p !== undefined) as CalculatedPlayer[],
    FLEX: [flex1, flex2].filter((p) => p !== undefined) as CalculatedPlayer[],
    K: [k].filter((p) => p !== undefined) as CalculatedPlayer[],
    DEF: [def].filter((p) => p !== undefined) as CalculatedPlayer[],
  }

  return startingLineup
}

const grabBestPlayer = (pos: SearchPosition, players: CalculatedPlayer[]) => {
  let idx = -1
  if (pos === SearchPosition.QB) idx = players.findIndex((p) => isQB(p))
  else if (pos === SearchPosition.RB) idx = players.findIndex((p) => isRB(p))
  else if (pos === SearchPosition.WR) idx = players.findIndex((p) => isWR(p))
  else if (pos === SearchPosition.TE) idx = players.findIndex((p) => isTE(p))
  else if (pos === SearchPosition.FLEX) idx = players.findIndex((p) => isFLEX(p))
  else if (pos === SearchPosition.K) idx = players.findIndex((p) => isK(p))
  else if (pos === SearchPosition.DEF) idx = players.findIndex((p) => isDEF(p))

  if (idx === -1) return

  const p = players.splice(idx, 1)
  return p[0]
}

export const rosterSumAvgStats = (startingLineup: Lineup, pos?: SearchPosition) => {
  let sum = 0

  if (pos === SearchPosition.QB || !pos) sum = sum + startingLineup.QB.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.RB || !pos) sum = sum + startingLineup.RB.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.WR || !pos) sum = sum + startingLineup.WR.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.TE || !pos) sum = sum + startingLineup.TE.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.FLEX || !pos) sum = sum + startingLineup.FLEX.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.K || !pos) sum = sum + startingLineup.K.reduce((acc, p) => acc + p.avgPoints, 0)
  if (pos === SearchPosition.DEF || !pos) sum = sum + startingLineup.DEF.reduce((acc, p) => acc + p.avgPoints, 0)

  return sum
}

export const rosterSumStdDev = (startingLineup: Lineup, pos?: SearchPosition) => {
  let sum = 0

  if (pos === SearchPosition.QB || !pos) sum = sum + startingLineup.QB.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.RB || !pos) sum = sum + startingLineup.RB.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.WR || !pos) sum = sum + startingLineup.WR.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.TE || !pos) sum = sum + startingLineup.TE.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.FLEX || !pos) sum = sum + startingLineup.FLEX.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.K || !pos) sum = sum + startingLineup.K.reduce((acc, p) => acc + p.stdDev, 0)
  if (pos === SearchPosition.DEF || !pos) sum = sum + startingLineup.DEF.reduce((acc, p) => acc + p.stdDev, 0)

  return sum
}

export const fillInRosterRanks = (rosters: Roster[]) => {
  //avgpts
  rosters.sort((a, b) => b.avgPoints.startingStatSum - a.avgPoints.startingStatSum)
  rosters.forEach((r, idx) => (r.avgPoints.rank = idx + 1))
  //stddev
  rosters.sort((a, b) => b.stdDev.startingStatSum - a.stdDev.startingStatSum)
  rosters.forEach((r, idx) => (r.stdDev.rank = idx + 1))
  //qb
  rosters.sort((a, b) => b.QB.startingStatSum - a.QB.startingStatSum)
  rosters.forEach((r, idx) => (r.QB.rank = idx + 1))
  //rb
  rosters.sort((a, b) => b.RB.startingStatSum - a.RB.startingStatSum)
  rosters.forEach((r, idx) => (r.RB.rank = idx + 1))
  //wr
  rosters.sort((a, b) => b.WR.startingStatSum - a.WR.startingStatSum)
  rosters.forEach((r, idx) => (r.WR.rank = idx + 1))
  //te
  rosters.sort((a, b) => b.TE.startingStatSum - a.TE.startingStatSum)
  rosters.forEach((r, idx) => (r.TE.rank = idx + 1))
  //flex
  rosters.sort((a, b) => b.FLEX.startingStatSum - a.FLEX.startingStatSum)
  rosters.forEach((r, idx) => (r.FLEX.rank = idx + 1))
  //k
  rosters.sort((a, b) => b.K.startingStatSum - a.K.startingStatSum)
  rosters.forEach((r, idx) => (r.K.rank = idx + 1))
  //def
  rosters.sort((a, b) => b.DEF.startingStatSum - a.DEF.startingStatSum)
  rosters.forEach((r, idx) => (r.DEF.rank = idx + 1))
}
