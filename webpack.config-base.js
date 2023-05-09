import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const OUTPUT_DIR = 'dist'

export const makeConfig = (ext, lib = {}) => ({
  mode: 'production',
  entry: {
    'live-connect-common': './src/index.ts'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: [
        /node_modules/,
        /\.d\.ts$/
      ],
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          configFile: `tsconfig-${ext}.json`
        }
      }
    }]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: `index.${ext}`,
    path: path.resolve('.', OUTPUT_DIR),
    ...lib
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new ESLintPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        mode: 'write-dts',
        build: true,
        configFile: `tsconfig-${ext}.json`,
        configOverwrite: {
          compilerOptions: {
            declarationMap: true
          }
        }
      }
    })
  ]
})
