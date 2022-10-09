import { denolint } from 'libdenolint'

export default ({
  include, exclude, configFile = '.denolint.json', ignoreConfig,
  format, formatter, throwOnWarning = true, throwOnError = true
} = {}) => ({
  name: 'denolint-all',
  setup: build => {
    const cwd = process.cwd()

    build.onStart(async () => {
      let ok
      try {
        ok = await denolint(cwd, ignoreConfig ? '' : configFile, {
          scanDirs: include, ignorePatterns: exclude, format
        })
      /* c8 ignore next 18 */
      } catch (error) {
        let { message } = error
        if (format === 'compact') {
          const loc = message.indexOf(` at ${path}`)
          if (loc > 0) {
            message = `${message.substring(loc + 4)}: ${message.substring(0, loc)}`
          } else {
            message = `${path}: ${message}`
          }
        } else {
          const suffix = message.includes(path) ? '' : ` at ${path}`
          message = `${message}${suffix}\n`
        }
        let messages = [message]
        if (formatter) messages = formatter(messages)
        for (const message of messages) console.error(message)
        if (throwOnError) throw Error('Errors were found')
      }
      if (!ok && throwOnWarning) throw Error('Warnings were found')
    })
  }
})
