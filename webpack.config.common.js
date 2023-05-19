// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./webpack.config.base')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const OUTPUT_DIR = 'dist'

module.exports = (libName, compress = {}) => {
  const baseConfig = base(compress)
  return {
    ...baseConfig,
    entry: './src/index.ts',
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: false
          }
        }]
      }, { test: /\.js$/, loader: 'source-map-loader' }]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: 'index.js',
      path: path.resolve('.', OUTPUT_DIR),
      library: libName,
      clean: true,
      globalObject: 'this'
    },
    plugins: [
      ...baseConfig.plugins,
      new ForkTsCheckerWebpackPlugin({
        async: false,
        typescript: {
          mode: 'write-dts',
          build: true,
          configOverwrite: {
            compilerOptions: {
              declarationMap: true
            }
          }
        }
      })
    ]
  }
}
