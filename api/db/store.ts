import { readPlayers } from './readFile'
import { Player, Roster, SearchPosition } from '../../shared/types'
import { calculateBasicStatsForPlayers, calculateTiers } from './calculators'
import { getPlayersByPosition } from '../../shared/position-logic'
import { createStartingLineup, fillInRosterRanks, rosterSumAvgStats, rosterSumStdDev } from './roster-logic'
import { getOwnerName } from './external-calls'

export const getTopPlayers = async (position: SearchPosition, startWeek: number, endWeek: number) => {
  const players = await readPlayers()

  const positionPlayers: Player[] = getPlayersByPosition(players, position)
  const calculatedPlayers = calculateBasicStatsForPlayers(positionPlayers, startWeek, endWeek)

  const ordered = calculatedPlayers.sort((a, b) => b.avgPoints - a.avgPoints)
  const numPlayersToShow = position === SearchPosition.FLEX ? 200 : 100
  const limited = ordered.slice(0, numPlayersToShow)

  const tiered = calculateTiers(limited)

  return tiered
}

export const getRosters = async (startWeek: number, endWeek: number) => {
  const playersObj = await readPlayers()
  const players = Object.values(playersObj)

  const ownedPlayers = players.filter((p) => !!p.ownerId)

  const calculatedOwnedPlayers = calculateBasicStatsForPlayers(ownedPlayers, startWeek, endWeek)

  const owners = Array.from(new Set(calculatedOwnedPlayers.map((p) => p.ownerId)) as Set<string>)

  const ownerNames = await Promise.all(owners.map(async (ownerId) => await getOwnerName(ownerId)))

  const rosters: Roster[] = []

  owners.map(async (ownerId, idx) => {
    const fullRoster = calculatedOwnedPlayers.filter((p) => p.ownerId === ownerId)
    const startingLineup = createStartingLineup(fullRoster)

    //For each owner id create a Roster object
    const roster: Roster = {
      ownerId,
      ownerName: ownerNames[idx],
      fullRoster,
      startingLineup,
      avgPoints: {
        startingStatSum: rosterSumAvgStats(startingLineup),
        rank: 999,
      },
      stdDev: {
        startingStatSum: rosterSumStdDev(startingLineup),
        rank: 999,
      },
      QB: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.QB),
        rank: 999,
      },
      RB: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.RB),
        rank: 999,
      },
      WR: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.WR),
        rank: 999,
      },
      TE: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.TE),
        rank: 999,
      },
      FLEX: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.FLEX),
        rank: 999,
      },
      K: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.K),
        rank: 999,
      },
      DEF: {
        startingStatSum: rosterSumAvgStats(startingLineup, SearchPosition.DEF),
        rank: 999,
      },
    }

    rosters.push(roster)
  })

  //After all this
  //Sort the rosters each time by avg points, stdev, and positions
  //Add ranks of each roster after sorting
  fillInRosterRanks(rosters)
  return rosters
}
