import { Player, Roster, SearchPosition, Trade } from '../../shared/types'
import { calculateBasicStatsForPlayers, calculateTiers } from './calculators'
import { getPlayersByPosition } from '../../shared/position-logic'
import { createStartingLineup, fillInRosterRanks, rosterSumAvgStats, rosterSumStdDev } from './roster-logic'
import { getOwnerName } from './external-calls'
import { readPlayers } from '../dbs/main'

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

  fillInRosterRanks(rosters)
  rosters.sort((a, b) => b.avgPoints.startingStatSum - a.avgPoints.startingStatSum)
  return rosters
}

export const getTrades = (rosters: Roster[], ownerId?: string) => {
  const myRoster = rosters.find((r) => r.ownerId === ownerId)

  if (!ownerId || !myRoster) return []

  const trades: Trade[] = []
  rosters.forEach((oppRoster) => {
    for (let i = 0; i < myRoster.fullRoster.length; i++) {
      for (let j = i + 1; j < myRoster.fullRoster.length + 1; j++) {
        const myTradePlayers = [myRoster.fullRoster[i]]
        if (j !== myRoster.fullRoster.length) myTradePlayers.push(myRoster.fullRoster[j])
        for (let k = 0; k < oppRoster.fullRoster.length; k++) {
          for (let l = k + 1; l < oppRoster.fullRoster.length + 1; l++) {
            const oppTradePlayers = [oppRoster.fullRoster[k]]
            if (l !== oppRoster.fullRoster.length) oppTradePlayers.push(oppRoster.fullRoster[l])

            const myFullRoster = myRoster.fullRoster.slice(0)
            if (j !== myRoster.fullRoster.length) myFullRoster.splice(j, 1)
            myFullRoster.splice(i, 1)
            const oppFullRoster = oppRoster.fullRoster.slice(0)
            if (l !== oppRoster.fullRoster.length) oppFullRoster.splice(l, 1)
            oppFullRoster.splice(k, 1)

            myFullRoster.push(...oppTradePlayers)
            oppFullRoster.push(...myTradePlayers)

            const myNewStartingLineup = createStartingLineup(myFullRoster)
            const oppNewStartingLineup = createStartingLineup(oppFullRoster)

            const myNewAvgPoints = rosterSumAvgStats(myNewStartingLineup)
            const oppNewAvgPoints = rosterSumAvgStats(oppNewStartingLineup)

            const trade: Trade = {
              team1Owner: myRoster.ownerName,
              team2Owner: oppRoster.ownerName,
              team1Players: myTradePlayers,
              team2Players: oppTradePlayers,
              team1Improvement: myNewAvgPoints - myRoster.avgPoints.startingStatSum,
              team2Improvement: oppNewAvgPoints - oppRoster.avgPoints.startingStatSum,
            }

            if (
              myNewAvgPoints - myRoster.avgPoints.startingStatSum > 2 &&
              oppNewAvgPoints - oppRoster.avgPoints.startingStatSum > 2
            ) {
              trades.push(trade)
            }
          }
        }
      }
    }
  })

  trades.sort((a, b) => b.team1Improvement - a.team1Improvement)
  return trades
}
