// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ESLintPlugin = require('eslint-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = compress => ({
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: true,
    providedExports: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ecma: 5,
        module: true,
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'parsed'
    })
  ]
})
