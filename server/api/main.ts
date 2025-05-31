import cors from '@fastify/cors'
import {
  getLeagueRules,
  getRosters,
  makeTopPlayers,
  getUserMetatdata,
  makePlayers,
  makeRosters,
} from './store'
import { LeagueReturn, TopPlayerReturn } from '../../shared/api-types'
import { readPlayers } from '../dbs/main'
import { LeagueInfo, TimeFrame } from '../../shared/types'
const fastify = require('fastify')({ logger: true })
require('dotenv').config({ path: '../.env' })

const MAX_WEEK = process.env.WEEK
if (!MAX_WEEK)
  throw new Error('No WEEK provided, please include a .env file with WEEK')

const WEEK = parseInt(MAX_WEEK)

const OWNER_ID = process.env.OWNER_ID
if (!OWNER_ID)
  console.info(
    'No OWNER_ID provided, please include a .env file with OWNER_ID if you would like to use that feature.',
  )

const LEAGUE_ID = process.env.SLEEPER_LEAGUE_ID
if (!LEAGUE_ID)
  console.info(
    'No SLEEPER_LEAGUE_ID provided, please include a .env file with SLEEPER_LEAGUE_ID if you want to use the roster feature',
  )

fastify.register(cors, {
  origin: true,
})

fastify.get(
  '/league/:leagueid/:userid',
  async (request: any, reply: any): Promise<LeagueReturn> => {

    /**
     * TODO: This call should get a uuid value (perhaps with leagueId, userId)
     * So that, on any error, we can tell the user to send this UUID to me
     * and it's easier for me to look through the logs and find the error
     */
    console.log('--Call made from', request.hostname, '--')

    //TODO: Value sanitization/checking
    const leagueId = request.params.leagueid
    // const userId = request.params.userid

    //Make all network calls and form primitive objects
    const [sleeperRules, sleeperPlayers, sleeperRosters, sleeperUserMetadata] =
      await Promise.all([
        await getLeagueRules(leagueId),
        await readPlayers(),
        await getRosters(leagueId),
        await getUserMetatdata(leagueId),
      ])

    const {
      leagueName,
      leagueRosterSpots,
      leagueValidRosterPositions,
      leagueScoringSettings,
    } = sleeperRules

    const leagueInfo: LeagueInfo = {
      leagueId,
      leagueName,
      rosterSpots: leagueRosterSpots,
      validRosterPositions: leagueValidRosterPositions
    }

    /*****************************
     * Form more complex objects *
     *****************************/

    const calculatedPlayers = await makePlayers({
      endWeek: WEEK,
      players: sleeperPlayers,
      leagueScoringSettings: leagueScoringSettings,
      rosteredPlayers: sleeperRosters,
    })

    const playersReturn: TopPlayerReturn[] = []

    //topX YTD and topX 5weeks
    leagueValidRosterPositions.map((pos) => {
      //get topPlayers for season
      //get topPlayers for 5 weeks
      const topPlayers = makeTopPlayers({
        position: pos,
        players: calculatedPlayers,
        timeFrame: TimeFrame.Season,
      })
      const top5WeekPlayers = makeTopPlayers({
        position: pos,
        players: calculatedPlayers,
        timeFrame: TimeFrame.FiveWeek,
      })

      const positionsObject: TopPlayerReturn = {
        position: pos,
        topPlayers,
        top5WeekPlayers,
      }

      playersReturn.push(positionsObject)
    })

    //get rosters
    const rosters = await makeRosters({
      players: calculatedPlayers,
      leagueRosterSpots,
      leagueValidRosterPositions,
      sleeperUserMetadata,
    })

    //get trades
    // const trades = getTrades(rosters, leagueRosterSpots, userId)

    const ret: LeagueReturn = {
      players: playersReturn,
      league: leagueInfo,
      rosters,
    }

    reply.code(200)
    return ret
  },
)

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
