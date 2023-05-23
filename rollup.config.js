const strip = require('@rollup/plugin-strip')
const ts = require('@rollup/plugin-typescript')
const cleaner = require('rollup-plugin-cleaner')
const mjsEntry = require('rollup-plugin-mjs-entry')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const OUTPUT_DIR = './dist'

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: `${OUTPUT_DIR}/index.js`,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    cleaner({targets: [OUTPUT_DIR]}),
    ts(),
    resolve(),
    commonjs({ sourceMap: true }),
    strip(),
    mjsEntry({ includeDefault: true }) // https://nodejs.org/api/packages.html#packages_dual_commonjs_es_module_packages
  ]
}
