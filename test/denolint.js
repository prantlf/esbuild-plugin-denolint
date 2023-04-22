import { ok, rejects, strictEqual } from 'assert'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { build } from 'esbuild'
import tehanu from 'tehanu'
import { denolint } from '../lib/index.js'

const test = tehanu(fileURLToPath(import.meta.url))
const __dirname = dirname(fileURLToPath(import.meta.url))

test('exports', () => {
  strictEqual(typeof denolint, 'function')
})

test('pass', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/pass/ultimate.js')],
    plugins: [denolint({ configFile: 'test/.denolint.json' })]
  })
})

test('warn', async () => {
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolint({ ignoreConfig: true })]
  }))
})

test('warn silently', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolint({ ignoreConfig: true, throwOnWarning: false })]
  })
})

test('fail', async () => {
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/fail/ultimate.txt')],
    plugins: [denolint({ filter: /\.txt$/, ignoreConfig: true })]
  }))
})

test('fail compact', async () => {
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/fail/ultimate.txt')],
    plugins: [denolint({ filter: /\.txt$/, format: 'compact', ignoreConfig: true })]
  }))
})

test('fail silently', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/fail/ultimate.txt')],
    plugins: [denolint({ filter: /\.txt$/, ignoreConfig: true, throwOnError: false })]
  })
})

test('missing config', async () => {
  await build({
    entryPoints: [
      join(__dirname, 'samples/pass/ultimate.js'),
      join(__dirname, 'samples/warn/ultimate.js'),
    ],
    outdir: join(__dirname, 'out'),
    plugins: [denolint({ exclude: /warn/, configFile: 'missing' })]
  })
})

test('explicit rules', async () => {
  await build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolint({
      rules: { exclude: ['no-unused-vars', 'no-var']}
    })] 
  })
})

test('formatter of pretty warnings', async () => {
  let params
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolint({
      ignoreConfig: true,
      formatter: (warnings, path, source) => {
        params = { warnings, path, source }
        return warnings
      }
    })] 
  }))
  strictEqual(params.warnings.length, 2)
  ok(/\n.+\n/g.test(params.warnings[0]))
  ok(params.path.endsWith('test/samples/warn/ultimate.js'))
  strictEqual(typeof params.source, 'string')
})

test('formatter of compact warnings', async () => {
  let params
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/warn/ultimate.js')],
    plugins: [denolint({
      ignoreConfig: true,
      format: 'compact',
      formatter: (warnings, path, source) => {
        params = { warnings, path, source }
        return warnings
      }
    })] 
  }))
  strictEqual(params.warnings.length, 2)
  ok(!/\n.+\n/g.test(params.warnings[0]))
  ok(params.path.endsWith('test/samples/warn/ultimate.js'))
  strictEqual(typeof params.source, 'string')
})

test('formatter of pretty errors', async () => {
  let params
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/fail/ultimate.txt')],
    plugins: [denolint({
      filter: /\.txt$/, ignoreConfig: true,
      formatter: (errors, path, source) => {
        params = { errors, path, source }
        return errors
      }
    })]
  }))
  strictEqual(params.errors.length, 1)
  ok(/\n.+\n/g.test(params.errors[0]))
  ok(params.path.endsWith('test/samples/fail/ultimate.txt'))
  strictEqual(typeof params.source, 'string')
})

test('formatter of compact errors', async () => {
  let params
  await rejects(build({
    entryPoints: [join(__dirname, 'samples/fail/ultimate.txt')],
    plugins: [denolint({
      filter: /\.txt$/, ignoreConfig: true,
      format: 'compact',
      formatter: (errors, path, source) => {
        params = { errors, path, source }
        return errors
      }
    })]
  }))
  strictEqual(params.errors.length, 1)
  ok(!/\n.+\n/g.test(params.errors[0]))
  ok(params.path.endsWith('test/samples/fail/ultimate.txt'))
  strictEqual(typeof params.source, 'string')
})
