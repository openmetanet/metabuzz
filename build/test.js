const webpack = require('webpack'),
  baseConfig = require('./webpack.base'),
  merge = require('webpack-merge'),
  config = require('./config.js'),
  Terser = require('terser-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const {
  sourceMap,
  outputPath,
  // assetsSubDirectory,
  assetsPublicPath
} = config.test

const buildConfig = {
  mode: 'production',
  externals: config.externals || {},
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:4].css',
      chunkFilename: 'css/[name].[chunkhash:4].css',
      publicPath: '../'
    }),
  ],
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/
  },
  output: {
    path: outputPath,
    publicPath: assetsPublicPath,
    chunkFilename: 'js/[name].[chunkhash:4].js',
    filename: 'js/[name].[chunkhash:4].js'
  },
  optimization: {
    minimizer: [
      new Terser({
        test: /\.m?js(\?.*)?$/i,
        chunkFilter: () => true,
        warningsFilter: () => true,
        extractComments: false,
        sourceMap,
        cache: true,
        cacheKeys: defaultCacheKeys => defaultCacheKeys,
        parallel: true,
        /* eslint-disable */
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i
          },
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        }
        /* eslint-disable */
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
};

let webpackConfig = merge({}, baseConfig, buildConfig);

// + 打包关系图表展示
if (process.env.Analyz === 1) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8899
    })
  );
}

webpack(webpackConfig, (err, stats) => {
  err && console.log(err);
  stats && process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    warnings: true
  }) + '\n\n');
  if (stats && stats.hasErrors()) {
    console.log('  Build failed with errors.\n');
    process.exit(1);
  }
});
