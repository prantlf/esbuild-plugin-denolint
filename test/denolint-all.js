import { rejects, strictEqual } from 'assert'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { build } from 'esbuild'
import tehanu from 'tehanu'
import { denolintAll } from '../lib/index.js'

const test = tehanu(fileURLToPath(import.meta.url))
const __dirname = dirname(fileURLToPath(import.meta.url))

test('exports', () => {
  strictEqual(typeof denolintAll, 'function')
})

test('pass', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/pass/ultimate.js')],
    plugins: [denolintAll({
      exclude: ['test/samples/warn'],
      ignoreConfig: true
    })] 
  })
})

test('warn', async () => {
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolintAll({
      configFile: 'test/.denolint.json'
    })] 
  }))
})

test('warn silently', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolintAll({
      configFile: 'test/.denolint.json',
      throwOnWarning: false
    })] 
  })
})
