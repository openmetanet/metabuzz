const webpack = require('webpack'),
  config = require('./config.js'),
  TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
  VueLoaderPlugin = require('vue-loader/lib/plugin.js')

// function resolve(dir) {
//   return path.join('_dirname', '..', dir);
// }
const { entry, alias, esLint, layouts } = config
const { cssPublicPath } = config[process.env.TYPE]
const isExtract = ['test', 'prod'].indexOf(process.env.TYPE) !== -1
// isProduction = process.env.TYPE === 'prod'

let baseConfig = {
  entry,
  output: {
    hashDigestLength: 5
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias,
    plugins: [
      new TsconfigPathsPlugin({
        // configFile: "./path/to/tsconfig.json"
      }),
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {}
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'cache-loader',
            options: {}
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
              happyPackMode: true
            }
          },
        ]
      },
      {
        test: /\.(js|vue|ts|tsx|jsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: esLint.autoFix,
          extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
          cache: false,
          emitWarning: true,
          emitError: false
        }
      },
      ...require('./utils.js').styleLoaders({ extract: isExtract, cssPublicPath: cssPublicPath }),
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.TYPE': JSON.stringify(process.env.TYPE)
    }),
  ]
}

baseConfig = require('./utils.js').layoutConfig(baseConfig, layouts)

module.exports = baseConfig
