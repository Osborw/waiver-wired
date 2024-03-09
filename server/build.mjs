import * as esbuild from 'esbuild'

const DIRECTORIES = {
    read: 'read',
    api: 'api'
}

const main = async () => {
  const args = process.argv

  if(args.length != 3) {
    console.error('ERROR BUILDING: Build command must be `node build.mjs -[read/api]`')
    return
  }

  const directoryArg = args[2]

  if(directoryArg === '-read') await build(DIRECTORIES.read)
  else if(directoryArg === '-api') await build(DIRECTORIES.api)
  else {
    console.error('ERROR BUILDING: Build command must be `node build.mjs -[read/api]`')
    return
  } 

}

const build = async (directory) => {
  await esbuild.build({
    entryPoints: [`${directory}/main.ts`],
    bundle: true,
    outfile: `${directory}/build/main.js`,
    platform: 'node'
  })
}

main()