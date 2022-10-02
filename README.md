# esbuild-plugin-denolint

[![Latest version](https://img.shields.io/npm/v/esbuild-plugin-denolint)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/esbuild-plugin-denolint)
](https://www.npmjs.com/package/esbuild-plugin-denolint)
[![Coverage](https://codecov.io/gh/prantlf/esbuild-plugin-denolint/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/esbuild-plugin-denolint)

Lint your [esbuild] bundles with [denolint].

A lot faster than [esbuild-plugin-eslint], handling both JavaScript and TypeScript sources. Use [rollup-plugin-denolint] for [Rollup]. Use [webpack-loader-denolint] for [Webpack]. Or simpler, just the [command-line `denolint`].

## Synopsis

```js
import { build } from 'esbuild'
import { denolint } from 'esbuild-plugin-denolint'

await build({
  plugins: [denolint()]
  // the rest of the configuration
})
```

## Installation

Make sure that you use [Node.js] 14 or newer and [esbuild] 0 or newer. Use your favourite package manager - [NPM], [PNPM] or [Yarn]:

```sh
npm i -D esbuild-plugin-denolint
pnpm i -D esbuild-plugin-denolint
yarn add -D esbuild-plugin-denolint
```

## Usage

Create a [build script] and import the plugin:

```js
import { build } from 'esbuild'
import { denolint } from 'esbuild-plugin-denolint'

await build({
  entryPoints: ['src/index.js')],
  outdir: 'dist',
  plugins: [
    denolint({
      exclude: /node_modules|tests/,
      rules: {
        exclude: ['no-unused-vars']
      }
    })
  ]
})
```

Then call the build script.

## Options

The following options can be passed in an object to the plugin function to change the default values.

### `filter`

Type: `RegExp`<br>
Default: `/\.(?:jsx?|tsx?)$/`

Regex for file names to match source files to include.

### `exclude`

Type: `RegExp`<br>
Default: `/node_modules/`

Regex for file names to match source files to exclude.

### `configFile`

Type: `string`<br>
Default: `'.denolint.json'`

Config file to load the tag, rule inclusion and exclusion lists from. File inclusion and exclusion lists are ignored. Use `include` and `exclude` options of this plugin.

### `ignoreConfig`

Type: `boolean`<br>
Default: `false`

Do not look for `.denolint.json` by default.

### `rules`

Type: `object`<br>
Default: `undefined`

Rules to include or exclude. If specified, the config file will be ignored. See [Rules](#rules) below.

### `throwOnWarning`

Type: `boolean`<br>
Default: `true`

Throw an error and abort if any warnings were reported.

### `throwOnError`

Type: `boolean`<br>
Default: `true`

Throw an error and abort if source file parsing failed fatally.

### `formatter`

Type: `boolean`<br>
Default: `true`

Custom warning and error formatter:

    (messages: string[], id: string, source: string) => string[]

## Rules

The following properties are recognised in the rules object.

### `all`

Type: `boolean`<br>
Default: `false`

Use all rules if set to `true`, otherwise only the recommended ones.

### `include`

Type: `string[]`<br>
Default: `[]`

List of rules to include extra, if only recommended rules are enabled.

### `exclude`

Type: `string[]`<br>
Default: `[]`

List of rules to exclude from all or recommended ones.

## Alternative

Instead of checking the source files as they are processed, you can check all sources, when the bundler starts. It resembles more how the [command-line `denolint`] works and you can reuse the `files.include` and `files.exclude` configuration from `.denolint.json`:

```js
import { build } from 'esbuild'
import { denolintAll } from 'esbuild-plugin-denolint'

await build({
  entryPoints: ['src/index.js')],
  outdir: 'dist',
  plugins: [
    denolintAll()
  ]
})
```

Optoins `include`, `exclude`, `configFile`, `formatter`, `throwOnWarning`, `throwOnError` are recognised. Options `include`, `exclude` override `files.include` and `files.exclude` from `.denolint.json` and have the same meaning. They are not passed to `esbuild`.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (C) 2022 Ferdinand Prantl

Licensed under the [MIT License].

[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[esbuild]: https://esbuild.github.io/
[denolint]: https://github.com/prantlf/denolint/tree/master/packages/libdenolint#readme
[esbuild-plugin-eslint]: https://github.com/robinloeffel/esbuild-plugin-eslint
[rollup-plugin-demolint]: https://github.com/prantlf/rollup-loader-denolint#readme
[Rollup]: https://rollupjs.org/
[webpack-loader-denolint]: https://github.com/prantlf/webpack-loader-denolint#readme
[Webpack]: https://webpack.js.org/
[command-line `denolint`]: https://github.com/prantlf/denolint/tree/master/packages/denolint#readme
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[build script]: https://esbuild.github.io/getting-started/#your-first-bundle
