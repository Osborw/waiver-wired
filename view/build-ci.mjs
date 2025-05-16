import * as esbuild from 'esbuild'
import { rmSync } from 'fs'

const main = async () => {
  //Remove old build folder
  rmSync('build', { recursive: true, force: true })

  //Build project
  await esbuild.build({
    entryPoints: [
      {out: 'bundle', in: 'src/index.tsx'},
      'src/index.html',
      'src/index.css'
    ],
    bundle: true,
    minify: true,
    outdir: 'build',
    outbase: 'src',
    loader: {
      '.html': 'copy',
      '.css': 'copy'
    }
  })
}

main()