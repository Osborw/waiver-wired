import {
  CalculatedPlayer,
  LineupSlot,
  Metrics,
  PositionRosterStat,
  Roster,
  SearchPosition,
  SearchPositionToSleeperPositionMapper,
  SleeperInjuryStatus,
  TempRoster,
  TimeFrame,
} from '../../../shared/types'

const isOut = (p: CalculatedPlayer) => {
  return (
    p.injuryStatus === SleeperInjuryStatus.IR ||
    p.injuryStatus === SleeperInjuryStatus.Out ||
    p.injuryStatus === SleeperInjuryStatus.PUP ||
    p.injuryStatus === SleeperInjuryStatus.Sus
  )
}

const playsPosition = (player: CalculatedPlayer, pos: SearchPosition) => {
  const sleeperPositions = SearchPositionToSleeperPositionMapper[pos]

  let matching = false
  sleeperPositions.forEach((sleeperPosition) => {
    if (player.fantasyPositions && player.fantasyPositions.includes(sleeperPosition)) matching = true
  })

  return matching
}

export const sortByPoints = (
  a: CalculatedPlayer,
  b: CalculatedPlayer,
  timeFrame: TimeFrame,
) => {
  const sort = (a: Metrics, b: Metrics) => {
    if (a.avgPoints === b.avgPoints) return b.stdDev - a.stdDev
    return b.avgPoints - a.avgPoints
  }

  if (timeFrame === TimeFrame.FiveWeek)
    return sort(a.fiveWeekMetrics, b.fiveWeekMetrics)
  else return sort(a.seasonMetrics, b.seasonMetrics)
}

export const createTempRoster = (ownerId: string, players: CalculatedPlayer[], leagueRosterSpots: SearchPosition[]): TempRoster => {
  const starters = createStartingLineup(players, leagueRosterSpots)
  const avgPoints = rosterSumAvgStats(Object.values(starters))

  return {
    ownerId,
    fullRoster: players,
    starters,
    avgPoints
  }  
}

export const createStartingLineup = (
  players: CalculatedPlayer[],
  leagueRosterSpots: SearchPosition[],
) => {
  const startingLineup: Record<string, LineupSlot> = {}
  const alreadyPickedPlayers: string[] = []

  leagueRosterSpots.forEach((rosterSpot, idx) => {
    const bestPlayer = grabBestPlayer(rosterSpot, players, alreadyPickedPlayers)
    if (bestPlayer) alreadyPickedPlayers.push(bestPlayer.id)

    startingLineup[idx] = {
      position: rosterSpot,
      player: bestPlayer,
    }
  })

  return startingLineup
}

const grabBestPlayer = (
  pos: SearchPosition,
  players: CalculatedPlayer[],
  alreadyPickedPlayers: string[],
) => {
  const positionPlayers = players.filter(
    (player) =>
      playsPosition(player, pos) &&
      !isOut(player) &&
      !alreadyPickedPlayers.includes(player.id),
  )

  if (positionPlayers.length === 0) return

  const sortedPositionPlayers = positionPlayers.sort((a, b) =>
    sortByPoints(a, b, TimeFrame.FiveWeek),
  )

  return sortedPositionPlayers[0]
}

export const rosterSumAvgStats = (startingLineup: LineupSlot[]) => {
  const sum = startingLineup.reduce((acc, lineupSlot) => {
    const player = lineupSlot.player
    if (player == undefined) return acc + 0
    return acc + player.fiveWeekMetrics.avgPoints
  }, 0)

  return sum
}

export const rosterSumStdDev = (startingLineup: LineupSlot[]) => {
  const sum = startingLineup.reduce((acc, lineupSlot) => {
    const player = lineupSlot.player
    if (player == undefined) return acc + 0
    return acc + player.fiveWeekMetrics.stdDev
  }, 0)

  return sum
}

export const initPositionRanks = (
  startingLineup: LineupSlot[],
  leagueValidRosterPositions: SearchPosition[],
) => {
  return leagueValidRosterPositions.map((pos): PositionRosterStat => {
    const positionPlayers = startingLineup.filter(
      (lineupSlot) => lineupSlot.position === pos,
    )
    const totalPoints = rosterSumAvgStats(positionPlayers)
    return {
      position: pos,
      totalPoints: totalPoints,
      rank: 999,
    }
  })
}

export const fillInRosterRanks = (
  rosters: Roster[],
  leagueValidRosterPositions: SearchPosition[],
) => {

  //avgpts
  rosters.sort((a, b) => b.avgPoints.totalPoints - a.avgPoints.totalPoints)
  rosters.forEach((r, idx) => (r.avgPoints.rank = idx + 1))
  //stddev
  rosters.sort((a, b) => a.stdDev.totalPoints - b.stdDev.totalPoints)
  rosters.forEach((r, idx) => (r.stdDev.rank = idx + 1))

  //all positions
  leagueValidRosterPositions.forEach(pos => {
    rosters.sort((a, b) => {
      const aPositionRank = a.positionRanks.find(aRanks => aRanks.position === pos)
      const bPositionRank = b.positionRanks.find(aRanks => aRanks.position === pos)

      const aTotalPoints = aPositionRank?.totalPoints ?? 0
      const bTotalPoints = bPositionRank?.totalPoints ?? 0

      return bTotalPoints - aTotalPoints
    })
    rosters.forEach((r, idx) => {
      const positionIndex = r.positionRanks.findIndex(ranks => ranks.position === pos)
      r.positionRanks[positionIndex].rank = idx + 1
    })
  })
}
