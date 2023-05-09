import { makeConfig } from './webpack.config-base.js'

export default makeConfig('mjs', {
  library: {
    type: 'umd',
    umdNamedDefine: true
  }
})
