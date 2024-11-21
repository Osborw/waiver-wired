import {
  CalculatedPlayer,
  FantasyStats,
  Player,
  Roster,
  SearchPosition,
  // SleeperPosition,
  Trade,
  TimeFrame,
} from '../../shared/types'
import { calculateBasicStatsForPlayers, calculateTiers } from './calculators'
import {
  getPlayersByPosition,
  isFlexPosition,
} from '../../shared/position-logic'
import {
  createStartingLineup,
  fillInRosterRanks,
  initPositionRanks,
  rosterSumAvgStats,
  rosterSumStdDev,
  sortByPoints,
} from './roster-logic'
import {
  SleeperUser,
  getLeagueRulesFromExternal,
  getRosteredPlayersFromExternal,
  getUserMetatdataFromExternal,
} from './data-mappers'

export const getLeagueRules = async (leagueId: string) => {
  return await getLeagueRulesFromExternal(leagueId)
}

export const getRosters = async (leagueId: string) => {
  return await getRosteredPlayersFromExternal(leagueId)
}

export const getUserMetatdata = async (leagueId: string) => {
  return await getUserMetatdataFromExternal(leagueId)
}

interface MakeTopPlayersProps {
  endWeek: number
  players: Record<string, Player>
  leagueScoringSettings: Partial<FantasyStats>
  rosteredPlayers: Record<string, string>
}

export const makePlayers = async ({
  endWeek,
  players,
  leagueScoringSettings,
  rosteredPlayers,
}: MakeTopPlayersProps) => {
  const calculatedPlayers = calculateBasicStatsForPlayers({
    players: Object.values(players),
    startWeek: 1,
    endWeek,
    leagueScoringSettings,
    rosteredPlayers,
  })

  return calculatedPlayers
}

interface GetTopPlayersProps {
  position: SearchPosition
  timeFrame: TimeFrame
  players: CalculatedPlayer[]
}

export const makeTopPlayers = ({
  position,
  timeFrame,
  players,
}: GetTopPlayersProps) => {
  const positionPlayers = getPlayersByPosition(players, position)

  const ordered = positionPlayers.sort((a, b) => sortByPoints(a, b, timeFrame))

  const numPlayersToShow = isFlexPosition(position) ? 200 : 100
  const limited = ordered.slice(0, numPlayersToShow)

  const tiered = calculateTiers(limited, timeFrame)

  return tiered
}

interface MakeRostersProps {
  players: CalculatedPlayer[]
  leagueRosterSpots: SearchPosition[]
  leagueValidRosterPositions: SearchPosition[]
  sleeperUserMetadata: Record<string, SleeperUser>
}

export const makeRosters = async ({
  players,
  leagueRosterSpots,
  leagueValidRosterPositions,
  sleeperUserMetadata,
}: MakeRostersProps) => {
  const ownedPlayers = players.filter((p) => !!p.ownerId)

  const owners = Array.from(
    new Set(ownedPlayers.map((p) => p.ownerId)) as Set<string>,
  )

  const rosters: Roster[] = []

  //TODO: This object has to be more generic and better
  owners.forEach(async (ownerId) => {
    const fullRoster = ownedPlayers.filter((p) => p.ownerId === ownerId)
    const startingLineup = createStartingLineup(fullRoster, leagueRosterSpots)
    const startingPlayers = Object.values(startingLineup)

    //For each owner id create a Roster object
    const roster: Roster = {
      ownerId,
      ownerName: sleeperUserMetadata[ownerId]?.displayName ?? `Owner ${ownerId}`,
      teamName: sleeperUserMetadata[ownerId]?.teamName ?? `Team ${ownerId}`,
      fullRoster,
      starters: startingLineup,
      avgPoints: {
        totalPoints: rosterSumAvgStats(startingPlayers),
        rank: 999,
      },
      stdDev: {
        totalPoints: rosterSumStdDev(startingPlayers),
        rank: 999,
      },
      positionRanks: initPositionRanks(
        startingPlayers,
        leagueValidRosterPositions,
      ),
    }

    rosters.push(roster)
  })

  fillInRosterRanks(rosters, leagueValidRosterPositions)

  rosters.sort((a, b) => b.avgPoints.totalPoints - a.avgPoints.totalPoints)

  return rosters
}

export const getTrades = (rosters: Roster[], leagueRosterSpots: SearchPosition[], ownerId?: string) => {
  const myRoster = rosters.find((r) => r.ownerId === ownerId)

  if (!ownerId || !myRoster) return []

  const trades: Trade[] = []
  rosters.forEach((oppRoster) => {
    for (let i = 0; i < myRoster.fullRoster.length; i++) {
      for (let j = i + 1; j < myRoster.fullRoster.length + 1; j++) {
        const myTradePlayers = [myRoster.fullRoster[i]]
        if (j !== myRoster.fullRoster.length)
          myTradePlayers.push(myRoster.fullRoster[j])
        for (let k = 0; k < oppRoster.fullRoster.length; k++) {
          for (let l = k + 1; l < oppRoster.fullRoster.length + 1; l++) {
            const oppTradePlayers = [oppRoster.fullRoster[k]]
            if (l !== oppRoster.fullRoster.length)
              oppTradePlayers.push(oppRoster.fullRoster[l])

            const myFullRoster = myRoster.fullRoster.slice(0)
            if (j !== myRoster.fullRoster.length) myFullRoster.splice(j, 1)
            myFullRoster.splice(i, 1)
            const oppFullRoster = oppRoster.fullRoster.slice(0)
            if (l !== oppRoster.fullRoster.length) oppFullRoster.splice(l, 1)
            oppFullRoster.splice(k, 1)

            myFullRoster.push(...oppTradePlayers)
            oppFullRoster.push(...myTradePlayers)

            const myNewStartingLineup = createStartingLineup(myFullRoster, leagueRosterSpots)
            const oppNewStartingLineup = createStartingLineup(oppFullRoster, leagueRosterSpots)

            const myNewAvgPoints = rosterSumAvgStats(Object.values(myNewStartingLineup))
            const oppNewAvgPoints = rosterSumAvgStats(Object.values(oppNewStartingLineup))

            const trade: Trade = {
              team1Owner: myRoster.ownerName,
              team2Owner: oppRoster.ownerName,
              team1Players: myTradePlayers,
              team2Players: oppTradePlayers,
              team1Improvement:
                myNewAvgPoints - myRoster.avgPoints.totalPoints,
              team2Improvement:
                oppNewAvgPoints - oppRoster.avgPoints.totalPoints
            }

            if (
              myNewAvgPoints - myRoster.avgPoints.totalPoints > 2 &&
              oppNewAvgPoints - oppRoster.avgPoints.totalPoints > 2
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
