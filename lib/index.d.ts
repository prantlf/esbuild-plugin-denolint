interface Plugin {
  name: string,
  setup()
}

interface Rules {
  /**
   * Use all rules if set to `true`, otherwise only the recommended ones.
   * @default false
   */
   all?: boolean

  /**
   * List of rules to include extra, if only recommended rules are enabled.
   * @default []
   */
   include?: string[]

   /**
   * List of rules to exclude from all or recommended ones.
    * @default []
    */
   exclude?: string[]
}

declare type DenoLintFormatter = (messages: string[], path: string, source: string) => string[];

interface DenoLintOptions {
  /**
   * Regex for file names to match source files to include.
   * @default /\.(?:jsx?|tsx?)$/
   */
  filter?: RegExp

  /**
   * Regex for file names to match source files to exclude.
   * @default /node_modules/
   */
  exclude?: RegExp

  /**
   * Config file to load the tag and rule inclusion and exclusion lists from.
   * File inclusion and exclusion lists are ignored. Use `include` and `exclude`
   * options of this plugin.
   * @default '.denolint.json'
   */
  configFile?: string

  /**
   * Do not look for `.denolint.json` by default.
   * @default false
   */
  ignoreConfig?: boolean

  /**
   * Rules to include or exclude. If specified, the config file will be ignored.
   * @default undefined
   */
  rules?: Rules

  /**
   * Throw an error and abort if any warnings were reported.
   * @default false
   */
  throwOnWarning?: boolean

  /**
   * Throw an error and abort if source file parsing failed fatally.
   * @default true
   */
  throwOnError?: boolean
 
  /**
   * Custom warning and error formatter.
   * @default stylish
   */
  formatter?: DenoLintFormatter
}

declare type DenoLintAllFormatter = (messages: string[]) => string[];

interface DenoLintAllOptions {
  /**
   * Paths to source files to include. Overrides `files.include`.
   * @default undefined
   */
  include?: string[]

  /**
   * Paths to source files to exclude. Overrides `files.exclude`.
   * @default undefined
   */
  exclude?: string[]

  /**
   * Config file to load the tag, file and rule inclusion and exclusion lists from.
   * @default '.denolint.json'
   */
  configFile?: string

  /**
   * Do not look for `.denolint.json` by default.
   * @default false
   */
  ignoreConfig?: boolean

  /**
   * Throw an error and abort if any warnings were reported.
   * @default false
   */
  throwOnWarning?: boolean

  /**
   * Throw an error and abort if source file parsing failed fatally.
   * @default true
   */
  throwOnError?: boolean
 
  /**
   * Custom warning and error formatter.
   * @default stylish
   */
  formatter?: DenoLintAllFormatter
}

export function denolint(options?: DenoLintOptions): Plugin

export function denolintAll(options?: DenoLintAllOptions): Plugin
