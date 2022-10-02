import { denolint } from 'libdenolint'

export default ({
  include, exclude, configFile = '.denolint.json', ignoreConfig,
  formatter, throwOnWarning = true, throwOnError = true
} = {}) => ({
  name: 'denolint-all',
  setup: build => {
    const cwd = process.cwd()

    build.onStart(async () => {
      let ok
      try {
        ok = await denolint(cwd, ignoreConfig ? '' : configFile, {
          scanDirs: include, ignorePatterns: exclude
        })
      /* c8 ignore next 6 */
      } catch ({ message }) {
        let messages = [message]
        if (formatter) messages = formatter(messages)
        for (const message of messages) console.error(message)
        if (throwOnError) throw Error('Errors were found')
      }
      if (!ok && throwOnWarning) throw Error('Warnings were found')
    })
  }
})
