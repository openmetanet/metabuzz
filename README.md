# MetaBuzz

MetaBuzz 是一款基于 MetaID 的链上微博应用。

### 项目运行

```bash
# clone the project
git clone https://github.com/openmetanet/metabuzz.git

# enter the project directory
cd metabuzz

# install dependency
npm install

# develop
npm run dev

# production
npm run build-prod
```

打包后的文件位于 dist/[env] 目录。

### 项目目录结构

```
.
|-- dist                             // 编译后文件目录
|-- src                              // 源码目录
|   |-- assets                       // 各种资源文件
|       |-- scss                    // 样式表文件夹
|           |-- metasv-buzz.scss             // scss 样式入口文件
|       |-- images                   // 静态图片文件夹
|       |-- fonts                    // 字体文件夹
|   |-- build                       // webpack 打包配置文件夹
|   |-- components                   // 公共组件
|       |--                
|   |-- entries                        // 入口文件目录
|       |-- metasv-buzz.ts                    
|   |-- views                        // 页面组件
|       |-- metasv-buzz
|       		|-- index.vue
|   |-- routes                       // 路由配置和程序的基本信息配置
|       |-- metasv-buzz.ts                 // 配置页面路由
|   |-- templates                     // html模板目录
|       |-- metasv-buzz.html
|   |-- store                        // vuex的状态管理
|   |-- utils                       // 公共方法
|       |-- 
|-- README.md                        // 项目说明
|-- package.json                     // 配置项目相关信息
.
```


### 配置说明

项目配置文件位于  src/config/metasv-buzz.ts，根据不同的环境需要配置以下环境变量： 
```js
prod: {
    baseUrl: 'https://www.demo.com', 		    // 当前项目的基本 Uri
    showMoneyUrl: 'https://www.showmoney.app',  // Showmoney 钱包地址 - 不需要变动
    metaFileServiceUrl: 'https://showman.showpay.io/',  // Showman 文件服务API地址 - 不需要变动
    metaIdServiceUrl: 'https://api.showmoney.app/',      // ShowmanDB 服务API地址 
    metaIdCenterUrl: 'https://api.showmoney.app/tag',// Tag 服务API地址
    basePath: '/metasv-buzz/',					// 默认 不需要变动
    metaIdTag: 'metaid',
    projectAddress: 'XXXXXXXXXXXXXXXXXXXXXXX',  // 项目方收款地址
    payCurrency: 'usd',  // 结算币种，支持bsv/usd，bsv的结算单位为聪
    simpleBlogFee: 0.01, // 发表Buzz项目方收取的费用
    payLikeAmount: 0.02, // 点赞支付给原作者的金额
    payLikeFee: 0.005,  // 点赞项目方收取的费用
    payCommentAmount: 0.01, // 评论支付给原作者的金额
    payCommentFee: 0.0025, // 评论项目方收取的费用
    payFollowAmount: 0.05, // 关注支付给被关注者的金额
    payFollowFee: 0.0125, // 关注项目方收取的费用
    rePostAmount: 0.01, // 转发支付给原作者的金额
    rePostFee: 0.0025, // 转发项目方收取的费用
    oauthSettings: {                            // oAuth 配置，通过 https://www.showmoney.app/open 来创建
      clientId: '********',
      clientSecret: '*************',
      redirectUri: 'https://www.demo.com/metasv-buzz/'
    },
},
```
### oauth clientID申请

可在 https://www.showmoney.app/open 来创建您的ClientId和secret

### 推荐vscode插件

  - Auto Close Tag
  - Beautify
  - ESlint
  - Path Autocomplete
  - Sass
  - Prettier - Code formatter
  - Vetur
  - vue-i18n-ally: vue-i18n 多语言助手vscode插件，用于管理多语言翻译词条


推荐vscode用户自动定义设置
```json
    "search.followSymlinks": false,
    "extensions.ignoreRecommendations": true,
    "emmet.syntaxProfiles": {
        "vue-html": "html",
        "vue": "html"
    },
    "eslint.options": {
        "plugins": [
            "html"
        ]
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "html",
        { "language": "vue", "autoFix": true }
    ],
    "prettier.singleQuote": true,
    "prettier.semi": true,
    "explorer.confirmDelete": true,
    "terminal.integrated.shell.osx": "/bin/bash",
    "editor.tabSize": 2,
    "search.location": "sidebar",
    "files.watcherExclude": {
    },
    "window.zoomLevel": 0,
    "path-autocomplete.pathMappings": {
        "@": "${folder}/src"
    },
    "javascript.preferences.quoteStyle": "single",
    "vetur.experimental.templateInterpolationService": true,
    "vetur.format.defaultFormatterOptions": {
        "prettier": {
            "semi": true,
            "singleQuote": true
        },
        "prettyhtml": {
            "printWidth": 100,
            "singleQuote": false,
            "wrapAttributes": false,
            "sortAttributes": true,
            "tabWidth": 2
        }
    },
    "path-autocomplete.extensionOnImport": true,
    "extensions.autoUpdate": false,
    "editor.snippetSuggestions": "top",
    "emmet.showSuggestionsAsSnippets": true,
    "editor.tabCompletion": "on",
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "javascript.implicitProjectConfig.experimentalDecorators": true,
    "vetur.format.defaultFormatter.ts": "vscode-typescript",
    "vetur.useWorkspaceDependencies": true,
    "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "html.format.endWithNewline": true,
    "html.format.indentHandlebars": true,
    "html.format.wrapAttributes": "aligned-multiple"

```
