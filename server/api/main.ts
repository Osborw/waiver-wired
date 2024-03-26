import cors from '@fastify/cors'
import { getLeaguePositions, getRosters, getTopPlayers, getTrades } from './store'
import { LeagueReturn, RostersReturn, TopPlayerReturn, TradesReturn } from '../../shared/api-types'
import { SearchPosition, TieredPlayer } from '../../shared/types'
const fastify = require('fastify')({ logger: true })
require('dotenv').config({ path: '../.env' })

const MAX_WEEK = process.env.WEEK
if(!MAX_WEEK) throw new Error('No WEEK provided, please include a .env file with WEEK')

const WEEK = parseInt(MAX_WEEK)

const OWNER_ID = process.env.OWNER_ID
if(!OWNER_ID) console.info('No OWNER_ID provided, please include a .env file with OWNER_ID if you would like to use that feature.')

const LEAGUE_ID = process.env.SLEEPER_LEAGUE_ID
if (!LEAGUE_ID) console.info('No SLEEPER_LEAGUE_ID provided, please include a .env file with SLEEPER_LEAGUE_ID if you want to use the roster feature')

fastify.register(cors, {
  origin: true,
})

fastify.get('/league/:userid/:leagueid', async (request: any, reply: any): Promise<LeagueReturn> => {
  console.log('--Call made from', request.hostname, '--')

  //TODO: Value sanitization/checking
  const ownerId = request.params.userId
  const leagueId = request.params.leagueId

  const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 

  // get list of positions for league
  let positions: SearchPosition[] 
  try {
    positions = await getLeaguePositions(leagueId)
  } catch (err) {
    throw new Error('oops, failure to get this league information') 
  }

  //make calculations
  const players: TopPlayerReturn[] = []
  positions.map(async (pos) => {
    //get topPlayers for season
    //get topPlayers for 5 weeks
    const topPlayersPromise = getTopPlayers(pos, 1, WEEK)
    const top5WeekPlayersPromise = getTopPlayers(pos, startWeek, WEEK)

    const promisesComplete = await Promise.all([topPlayersPromise, top5WeekPlayersPromise])

    const positionsObject: TopPlayerReturn= {
      position: pos,
      topPlayers: promisesComplete[0],
      top5WeekPlayers: promisesComplete[1]
    }

    players.push(positionsObject)
  })

  //get rosters
  const rosters = await getRosters(startWeek, WEEK, ownerId, positions) //not sure why we need startweek here
  //get trades
  const trades = getTrades(rosters, userId)

  const ret: LeagueReturn = {
    players,
    rosters,
    trades
  }

  return ret
})

// fastify.get('/allSeason/:position', async (request: any, reply: any): Promise<TopPlayerReturn> => {
//   console.log('--Call made from', request.hostname, '--')
//   const topPlayers = await getTopPlayers(request.params.position, 1, WEEK)

//   const ret: TopPlayerReturn = {
//     players: topPlayers,
//     ownerId: OWNER_ID
//   }

//   return ret
// })

// fastify.get('/fiveWeeks/:position', async (request: any, reply: any): Promise<TopPlayerReturn> => {
//   console.log('--Call made from', request.hostname, '--')
//   const topPlayers = await getTopPlayers(request.params.position, startWeek, WEEK)

//   return {
//     players: topPlayers,
//     ownerId: OWNER_ID
//   } 
// })

// fastify.get('/rosters', async (request: any, reply: any): Promise<RostersReturn> => {
//   console.log('--Call made from', request.hostname, '--')
//   const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
//   const rosters = await getRosters(startWeek, WEEK)

//   return {
//     rosters,
//     ownerId: OWNER_ID
//   } 
// })

// fastify.get('/trades', async (request: any, reply: any): Promise<TradesReturn> => {
//   console.log('--Call made from', request.hostname, '--')
//   const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
//   const rosters = await getRosters(startWeek, WEEK)
//   const trades = getTrades(rosters, OWNER_ID)

//   return {
//     rosters,
//     trades,
//     ownerId: OWNER_ID
//   } 
// })

const start = async () => {
  try {
    await fastify.listen({port: 3001})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
