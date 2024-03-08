import cors from '@fastify/cors'
import { getRosters, getTopPlayers, getTrades } from './store'
import { RostersReturn, TopPlayerReturn, TradesReturn } from '../../shared/api-types'
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

fastify.get('/allSeason/:position', async (request: any, reply: any): Promise<TopPlayerReturn> => {
  console.log('--Call made from', request.hostname, '--')
  const topPlayers = await getTopPlayers(request.params.position, 1, WEEK)

  const ret: TopPlayerReturn = {
    players: topPlayers,
    ownerId: OWNER_ID
  }

  return ret
})

fastify.get('/fiveWeeks/:position', async (request: any, reply: any): Promise<TopPlayerReturn> => {
  console.log('--Call made from', request.hostname, '--')
  const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
  const topPlayers = await getTopPlayers(request.params.position, startWeek, WEEK)

  return {
    players: topPlayers,
    ownerId: OWNER_ID
  } 
})

fastify.get('/rosters', async (request: any, reply: any): Promise<RostersReturn> => {
  console.log('--Call made from', request.hostname, '--')
  const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
  const rosters = await getRosters(startWeek, WEEK)
  const trades = getTrades(rosters, OWNER_ID)

  return {
    rosters,
    ownerId: OWNER_ID
  } 
})

fastify.get('/trades', async (request: any, reply: any): Promise<TradesReturn> => {
  console.log('--Call made from', request.hostname, '--')
  const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
  const rosters = await getRosters(startWeek, WEEK)
  const trades = getTrades(rosters, OWNER_ID)

  return {
    rosters,
    trades,
    ownerId: OWNER_ID
  } 
})

const start = async () => {
  try {
    await fastify.listen({port: 3001})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
