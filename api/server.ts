import * as Store from './db/store'
import cors from '@fastify/cors'
const fastify = require('fastify')({ logger: true })

const MAX_WEEK = process.env.WEEK

if(!MAX_WEEK) throw new Error('No WEEK provided, please include a .env file with WEEK')

const WEEK = parseInt(MAX_WEEK)

fastify.register(cors, {
  origin: true,
})

fastify.get('/allSeason/:position', async (request: any, reply: any) => {
  console.log('--Call made from', request.hostname, '--')
  const top50 = await Store.getTop50(request.params.position)
  const ret = Promise.all(
    top50.map(async p => ({
      weeks: await Store.getWeeks(p.id, 1),
      ...p,
    })),
  )
  return ret
})

fastify.get('/fiveWeeks/:position', async (request: any, reply: any) => {
  console.log('--Call made from', request.hostname, '--')
  const top50 = await Store.getFiveWeekTop50(request.params.position, WEEK)
  const startWeek = WEEK - 5 < 1 ? 1 : WEEK - 4 
  const ret = Promise.all(
    top50.map(async p => ({
      weeks: await Store.getWeeks(p.id, startWeek),
      ...p,
    })),
  )
  return ret
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