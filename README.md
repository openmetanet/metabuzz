# MetaBuzz

## 项目运行

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



## 说明

项目配置文件位于  src/config/metasv-buzz.ts，根据不同的环境需要配置以下环境变量： 
```js
prod: {
    baseUrl: 'https://www.demo.com', 		    // 当前项目的基本 Uri
    showMoneyUrl: 'https://www.showmoney.app',  // Showmoney 钱包地址 - 不需要变动
    metaFileServiceUrl: 'https://showman.showpay.io/',  // Showman 文件服务API地址 - 不需要变动
    metaIdServiceUrl: 'https://www.demo.com/',      // ShowmanDB 服务API地址 
    metaIdCenterUrl: 'https://www.demo.com/tag',// Tag 服务API地址
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
    oauthSettings: {                            // oAuth 配置
      clientId: '********',
      clientSecret: '*************',
      redirectUri: 'https://www.demo.com/metasv-buzz/'
    },
},
```
