//@ts-ignore
import * as mysql from 'mysql2/promise'

export const getSomething = async () => {

  const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
  })
  console.log('made connection')

  const query = `SELECT DISTINCT s.id, s.pts_ppr, p.name, s.pts_ppr/s.gms_active AS avg_points
  FROM JSXR.season s INNER JOIN JSXR.players p ON s.id = p.id
  WHERE p.position = 'RB' ORDER BY avg_points DESC LIMIT 50;`

  let ret = await con.execute(query, [])

  // console.log(ret[0])

  console.log('trying to close')
  await con.end(err => {
    console.log('Good-bye!')
  })

  return ret[0]
}
