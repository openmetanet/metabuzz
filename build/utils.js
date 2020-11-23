const MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  path = require('path'),
  glob = require('glob'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

exports.cssLoaders = function(options) {
  options = options || {}
  const cssPublicPath = options.cssPublicPath || './'

  const cssLoader = {
    loader: 'css-loader'
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const px2remLoader = {
    loader: path.resolve(__dirname, './px-to-rem/index.js'),
    options: {
      remUnit: 16, // 设计稿宽度/10
      remPrecision: 3
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader]
    if (loader) {
      loaders.push(px2remLoader)
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    if (options.extract) {
      return [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: cssPublicPath
          }
        },
      ].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    sass: generateLoaders('sass', { indentedSyntax: true, implementation: require('sass') }),
    scss: generateLoaders('sass', { implementation: require('sass') })
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// 自动发现入口文件
exports.getEntry = function(globPath, pathDir) {
  const files = glob.sync(globPath)
  const entries = {}
  let entry, dirname, basename, pathname, extname

  for (let i = 0; i < files.length; i++) {
    entry = files[i]
    dirname = path.dirname(entry)
    extname = path.extname(entry)
    basename = path.basename(entry, extname)
    pathname = path.join(dirname, basename)
    pathname = pathDir
      ? pathname.replace(new RegExp('^' + pathDir), '')
      : pathname
    entries[basename] = ['./' + entry]
  }
  return entries
};

// 根据模板文件生成html
exports.layoutConfig = function(webpackConfig, layoutConfig) {
  const layouts = layoutConfig,
    configs = webpackConfig,
    defaultTitle = 'ShowPay'
  layouts.forEach(function(layout) {
    const conf = {
      title: defaultTitle,
      filename: layout.name + '/index.html', // 生成的html存放路径，相对于path
      template: 'src/templates/' + layout.tplName + '.html', // html模板路径
      chunks: layout.commonChunks || [],
      inject: false,	// js插入的位置，true/'head'/'body'/false
      meta: {
        keyworks: '',
        description: ''
      }
    }
    if (layout.seoMeta) {
      conf.title = layout.seoMeta.title
      conf.meta.keywords = layout.seoMeta.keywords
      conf.meta.description = layout.seoMeta.description
    }
    if (layout.name in webpackConfig.entry) {
      conf.inject = 'body'
      conf.chunks.push(layout.name)
      conf.hash = false
    }
    configs.plugins.push(new HtmlWebpackPlugin(conf))
  })
  return configs
}
