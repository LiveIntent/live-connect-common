const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const OUTPUT_DIR = 'dist'

module.exports = (libName, compress = {}) => ({
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: false
        }
      }
    }]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve('.', OUTPUT_DIR),
    library: libName,
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          typeofs: false,
          ...compress
        },
        safari10: true
      }
    })]
  },
  plugins: [
    new ESLintPlugin(),
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
})
