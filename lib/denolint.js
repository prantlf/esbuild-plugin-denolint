import { relative, sep } from 'path'
import { readFile } from 'fs/promises'
import { lint } from 'libdenolint'

const cwd = process.cwd()

function normalizePath(path) {
  path = relative(cwd, path)
  /* c8 ignore next */
  if (sep !== '/') path = path.split(sep).join('/')
  return path
}

export default ({
  filter = /\.(?:jsx?|tsx?)$/, exclude = /node_modules/,
  configFile = '.denolint.json', ignoreConfig, rules,
  format, formatter, throwOnWarning = true, throwOnError = true
} = {}) => ({
  name: 'denolint',
  setup: async build => {
    let allRules, excludeRules, includeRules
    if (rules) {
      ({ all: allRules, exclude: excludeRules, include: includeRules } = rules)
    } else if (!ignoreConfig) {
      try {
        const config = JSON.parse(await readFile(configFile, 'utf8'))
        const { tags = [], rules = {} } = config
        if (allRules === undefined) allRules = !tags.includes('recommended')
        ({ exclude: excludeRules, include: includeRules } = rules)
        // eslint-disable-next-line no-empty
      } catch {}
    }

    build.onLoad({ filter }, async ({ path }) => {
      if (exclude && exclude.test(path)) return
      const relPath = normalizePath(path)
      let source, warnings
      try {
        source = await readFile(path, 'utf8')
        warnings = await lint(relPath, source, {
          allRules, excludeRules, includeRules, format
        })
        if (formatter) warnings = formatter(warnings, path, source)
        for (const warning of warnings) console.warn(warning)
      } catch ({ message }) {
        /* c8 ignore next */
        const suffix = message.includes(relPath) ? '' : `, at: ${relPath}`
        const messages = [`Lint failed: ${message}${suffix}\n`]
        if (formatter) messages = formatter(messages, path, source)
        for (const message of messages) console.error(message)
        if (throwOnError) throw Error('Errors were found')
      }
      if (warnings && warnings.length && throwOnWarning) throw Error('Warnings were found')
    })
  }
})
