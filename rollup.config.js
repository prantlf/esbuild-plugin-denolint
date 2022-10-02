export default {
  input: 'lib/index.js',
  output: { file: 'lib/index.cjs', format: 'cjs', sourcemap: true },
  external: ['path', 'fs/promises', 'libdenolint']
}
