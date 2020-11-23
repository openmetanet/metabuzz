const baseConfig = require('./webpack.base.js'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./config.js')

const {
  port,
  proxy,
  outputPath,
  assetsPublicPath
} = config.dev

const customParams = JSON.parse(process.env.npm_config_argv).original,
  portParamsIndex = customParams.indexOf('-p')
let newPort = port

if (portParamsIndex > -1) {
  const tempPort = customParams[portParamsIndex + 1]
  if (tempPort > 0) {
    newPort = customParams[portParamsIndex + 1]
  } else {
    console.log('端口号设置错误, 正确方式: -p 8080')
    return
  }
}
if (customParams.indexOf('-o') > -1) {
  isAutoOpen = true
}
const devConfig = {
  output: {
    filename: 'js/[name].js',
    path: outputPath,
    publicPath: assetsPublicPath,
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  mode: 'development',
  devtool: '#eval-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
const webpackConfig = merge({}, baseConfig, devConfig)
const opts = {
  contentBase: [outputPath],
  watchContentBase: true,
  hot: true,
  host: '0.0.0.0',
  compress: true,
  noInfo: false,
  quiet: false,
  writeToDisk: true,
  disableHostCheck: true,
  publicPath: assetsPublicPath,
  overlay: {
    warnings: true,
    errors: true
  },
  proxy,
  stats: 'errors-only'
}
WebpackDevServer.addDevServerEntrypoints(webpackConfig, opts)
const compiler = webpack(webpackConfig)

new WebpackDevServer(compiler, opts)
  .listen(newPort, '0.0.0.0')
