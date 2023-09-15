import { readPlayers, readWeeks, readSeason } from './readFile'
import { std } from 'mathjs'
import { isFlexPosition } from '../../shared/common'
import { Player } from '../../shared/types'

export const getTop50 = async (position: string) => {
  const players = await readPlayers() as Record<string, Player>
  const season = await readSeason()

  let final

  if (position === 'FLEX') {
    const flexPlayers = Object.values(players).filter((player) => {
      return isFlexPosition(player.position)
    })
    const activeFlexPlayers = flexPlayers.filter(
      (player) => season[player.id] && season[player.id]['gms_active'] > 0 && season[player.id]['gp'] > 0
    )
    const selected = activeFlexPlayers.map((player) => {
      const ptsPPR = season[player.id]['pts_ppr']
      const gamesPlayed = season[player.id]['gp']
      const avgPoints = gamesPlayed > 0 && ptsPPR ? ptsPPR / gamesPlayed : 0

      return {
        id: player.id,
        name: player.name,
        position: player.position,
        gamesPlayed: season[player.id]['gp'],
        avgPoints,
        stdDev: season[player.id]['std_dev'],
        ownerId: player.owner_id,
      }
    })
    const ordered = selected.sort((a, b) => b.avgPoints - a.avgPoints)
    const limited = ordered.slice(0, 100)
    final = limited
  } else if (position === 'DEF') {
    const positionPlayers = Object.values(players).filter((player) => player.position === position)
    const selected = positionPlayers.map((player) => {
      const ptsPPR = season[player.id]['pts_ppr']
      const gamesPlayed = season[player.id]['gp']
      const avgPoints = gamesPlayed > 0 && ptsPPR ? ptsPPR / gamesPlayed : 0

      return {
        id: player.id,
        name: player.name,
        position: player.position,
        gamesPlayed: season[player.id]['gp'],
        avgPoints,
        stdDev: season[player.id]['std_dev'],
        ownerId: player.owner_id,
      }
    })
    const ordered = selected.sort((a, b) => b.avgPoints - a.avgPoints)
    const limited = ordered.slice(0, 50)
    final = limited
  } else {
    const positionPlayers = Object.values(players).filter((player) => player.position === position)
    const activePositionPlayers = positionPlayers.filter(
      (player) => season[player.id] && season[player.id]['gms_active'] > 0 && season[player.id]['gp'] > 0
    )
    const selected = activePositionPlayers.map((player) => {
      const ptsPPR = season[player.id]['pts_ppr']
      const gamesPlayed = season[player.id]['gp']
      const avgPoints = gamesPlayed > 0 && ptsPPR ? ptsPPR / gamesPlayed : 0

      return {
        id: player.id,
        name: player.name,
        position: player.position,
        gamesPlayed: season[player.id]['gp'],
        avgPoints,
        stdDev: season[player.id]['std_dev'],
        ownerId: player.owner_id,
      }
    })
    const ordered = selected.sort((a, b) => b.avgPoints - a.avgPoints)
    const limited = ordered.slice(0, 50)
    final = limited
  }

  return final
}

export const getFiveWeekTop50 = async (position: string, max_week: number) => {
  const players = await readPlayers() as Record<string, Player>
  const weeks = await readWeeks()

  const playersRet: Record<string, any> = {}
  const fiveWeeks = Object.keys(weeks).filter((weekNumber) => parseInt(weekNumber) > max_week - 5 && parseInt(weekNumber) <= max_week)
  const relevantWeeks = Object.fromEntries(Object.entries(weeks).filter(([key]) => fiveWeeks.includes(key)))

  Object.entries(relevantWeeks).map(([weekNumber, stats]: [string, any]) => {
    console.log('calc week number', weekNumber)
    Object.entries(stats).map(([id, playersStats]: [string, any]) => {
      if ((position === 'FLEX' && isFlexPosition(players[id].position)) || players[id].position === position) {
        if (playersStats.gp) {
          if (playersRet[id]) {
            const incGamesPlayed = playersRet[id].gamesPlayed + 1
            playersRet[id].avgPoints =
              (playersRet[id].avgPoints * playersRet[id].gamesPlayed + (playersStats.pts_ppr || 0)) /
              incGamesPlayed
            playersRet[id].gamesPlayed = incGamesPlayed
            playersRet[id].pprPointsPerWeek.push(playersStats.pts_ppr || 0)
          } else {
            playersRet[id] = {
              id,
              name: players[id].name,
              position: players[id].position,
              ownerId: players[id].owner_id,
              gamesPlayed: 1,
              avgPoints: playersStats.pts_ppr || 0,
              pprPointsPerWeek: [playersStats.pts_ppr || 0],
            }
          }
        }
      }
    })
  })

  const realArrayRet = Object.entries(playersRet).map(([key, val]) => val)
  const ordered = realArrayRet.sort((a, b) => b.avgPoints - a.avgPoints)
  const limited = position === 'FLEX' ? ordered.slice(0, 100) : ordered.slice(0, 50)

  const withStdDev = limited.map((player) => ({
    ...player,
    stdDev: std(player.pprPointsPerWeek),
  }))

  return withStdDev
}

export const getWeeks = async (id: string, start: number) => {
  const weeks = await readWeeks()

  const allWeeks = Object.keys(weeks).slice(start - 1)
  const allWeeksForPlayer = allWeeks
    .map((week) => {
      if (weeks[week][id]) return { stats: weeks[week][id], weekNumber: week }
    })
    .filter((week) => week !== undefined && week.stats !== undefined)
  const selected = allWeeksForPlayer.map((statsObj, idx) => {
    if (!statsObj) return
    const { stats, weekNumber } = statsObj
    return {
      ptsPPR: stats['pts_ppr'] || 0,
      weekNumber: parseInt(weekNumber),
    }
  })

  return selected
}