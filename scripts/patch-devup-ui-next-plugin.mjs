import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageDists = [
  join(projectRoot, 'node_modules', '@devup-ui', 'next-plugin', 'dist'),
  join(projectRoot, 'node_modules', '@devup-ui', 'webpack-plugin', 'dist'),
]

const files = ['loader.cjs', 'loader.mjs']
let patched = 0

for (const packageDist of packageDists) {
  for (const file of files) {
    const target = join(packageDist, file)

    if (!existsSync(target)) {
      continue
    }

    const source = readFileSync(target, 'utf8')
    const nextSource = source
      .replace(
        /return JSON\.parse\(([^)]+)\),\1/g,
        'let m=JSON.parse($1);return typeof m==="string"?JSON.parse(m):m',
      )
      .replace(
        /return JSON\.parse\(([^)]+)\)}/g,
        'let m=JSON.parse($1);return typeof m==="string"?JSON.parse(m):m}',
      )
      .replace(
        'this.addDependency(K),this.addDependency(Q),this.addDependency(H),this.addDependency(W)',
        'this.addDependency(v(process.cwd(),K)),this.addDependency(v(process.cwd(),Q)),this.addDependency(v(process.cwd(),H)),this.addDependency(v(process.cwd(),W))',
      )
      .replace(
        'this.addDependency(V),this.addDependency(X),this.addDependency(N),this.addDependency(_)',
        'this.addDependency(Q.join(process.cwd(),V)),this.addDependency(Q.join(process.cwd(),X)),this.addDependency(Q.join(process.cwd(),N)),this.addDependency(Q.join(process.cwd(),_))',
      )
      .replace(
        'this.addDependency(T),this.addDependency(V),this.addDependency(Y)',
        'this.addDependency($(process.cwd(),T)),this.addDependency($(process.cwd(),V)),this.addDependency($(process.cwd(),Y))',
      )
      .replace(
        'this.addDependency(_),this.addDependency($),this.addDependency(A)',
        'this.addDependency(H.join(process.cwd(),_)),this.addDependency(H.join(process.cwd(),$)),this.addDependency(H.join(process.cwd(),A))',
      )

    if (nextSource !== source) {
      writeFileSync(target, nextSource)
      patched += 1
    }
  }
}

if (patched > 0) {
  console.log(`[devup-ui] patched Next loader source maps in ${patched} file(s).`)
}
