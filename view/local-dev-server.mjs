import * as esbuild from 'esbuild'
import * as http from 'http'
import { rmSync } from 'fs'

const PORT = 3000 

const main = async () => {
  rmSync('build', { recursive: true, force: true })

  //Build project
  let ctx = await esbuild.context({
    entryPoints: [
      {out: 'bundle', in: 'src/index.tsx'},
      'src/index.html',
      'src/index.css'
    ],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'build',
    outbase: 'src',
    loader: {
      '.html': 'copy',
      '.css': 'copy'
    }
  })

  //Watch for code changes
  await ctx.watch()

  //Start dev server
  let { host, port } = await ctx.serve({
    servedir: 'build/',
    fallback: 'build/index.html',
    host: 'localhost',
    port: PORT
  })

  console.log(`Running on http://localhost:${port}`)

  //Proxy that handles client requests to local api
  // http.createServer((req, res) => {

  //   const clientOptions = {
  //     hostname: host,
  //     port,
  //     path: req.url,
  //     method: req.method,
  //     headers: req.headers
  //   }

  //   console.log(req.url)

  //   if (req.url.startsWith('/api')) {
  //     return localAPIProxy(req, res)
  //   }

  //   const esbuildHandle = http.request(clientOptions, proxyRes => {
  //     res.writeHead(proxyRes.statusCode, proxyRes.headers)
  //     proxyRes.pipe(res, { end: true })
  //   })

  //   req.pipe(esbuildHandle, { end: true })
  // }).listen(PORT)
}

//Directs api calls to our local proxy
const localAPIProxy = (client_req, client_res) => {
  const serverOptions = {
    hostname: '0.0.0.0',
    port: 9000,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers,
  }

  try {
    const proxy = http.request(serverOptions, (res) => {
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res)
    })

    client_req.pipe(proxy)
  } catch (err) {
    console.log(err)
    throw new Error('LOCAL SERVER IS NOT RUNNING. Please `cd` into the server directory and run `npm start` to start the server.')
  }
} 

main()