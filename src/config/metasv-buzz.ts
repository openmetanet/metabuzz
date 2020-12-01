
export interface ConfigTypes {
  readonly baseUrl: string; // 当前项目基本Url
  readonly showMoneyUrl: string; // Showmoney 钱包地址
  readonly metaFileServiceUrl: string; // MetaFile 服务Url
  readonly metaIdServiceUrl: string; // MetaId 数据服务Url
  readonly metaIdCenterUrl: string; // MetaId tag 服务Url
  readonly metaIdTag: string;
  readonly env: string;
  readonly basePath: string; // Vue router basePath
  readonly projectAddress: string; // 项目方收款地址
  readonly payCurrency: string; // 结算币种，支持bsv/usd，bsv的结算单位为聪
  readonly simpleBlogFee: number; // 发表Buzz项目方收取的费用
  readonly payLikeAmount: number; // 点赞支付给原作者的金额
  readonly payLikeFee: number; // 点赞项目方收取的费用
  readonly payCommentAmount: number; // 评论支付给原作者的金额
  readonly payCommentFee: number; // 评论项目方收取的费用
  readonly payFollowAmount: number; // 关注支付给原作者的金额
  readonly payFollowFee: number; // 关注项目方收取的费用
  readonly rePostAmount: number; // 转发支付给原作者的金额
  readonly rePostFee: number; // 转发项目方收取的费用
  readonly oauthSettings: OauthSettings;
  readonly recommandUsers: string[];
  readonly hotBuzz: string[];
}
interface OauthSettings {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
}

// const domain: string = getBaseDomain()

const type: string = process.env.TYPE || 'test'

const testRecommandUsers = [
  '3e83f04a92c7a8c0e051fc6b813f3f59e643b1a64e8f75b030da8f0969b3ee4f',
  '0a9d30a38c44aba79b2d023d667ca4558350727eb0b71efdff6aa6695200f78f',
  '0a1d64ddc4c2b4f42f90f8bd9d7455ad14a0b0f52cf485b45e5421f23a131c8b',
]
const prodRecommandUsers: string[] = [
  '2df27132058cd24ff9ef2939315c9ca0d8ec88733f5bda0df130b7798efea972',
  'ece4ee8945fecd67c49eaab633c8bf36926692bbdb80b60db5a4063ee7b561eb',
  'a7cc5c67d67e792bedeb6e2f7dee30a8159bd893a5207fc01646b0565a5d93d9',
  'ff7ab1d48e34355eefb7356ba0b9f6fc517fc37d514e544bc8f524596aa008ad',
  'ca6bd3eb2bc6abb6c50c4e6a09b1eaf51ac74a2648df5d1f79285f527f8df056',
  '851c39cc0e9ff33e800451164bf5d384196b782361e11be42fc2f8bca251971f',
  'b0724df68cbe2851059c7345759e926de877e734d0991993a2d340f9e4e33940',
  '9d92fecde784d6e81a578b1f8dfd29a7ca9a295d0cf1368209271f0ece300e1e',
]
const testHotBuzz = [
  'd05ae4a4f1d4cf7eb9ee878d64964058dd309690401ebdb27256039e16268312',
  '0a95a4c9f0e8a1517efe7586fc96d994ab39dacaf229d77768dd0d70bff2d394',
]
const prodHotBuzz: string[] = [
  '999f095807f347c26f59fce4c54125b64645f6fe544f85846f90d301bda9fd8c',
  '4ba3579d6d0f54c9518984c46bef7f2a3864a62eddedd3a25adfe224adb1b265',
  '371476a0f776c2a24f42975f7b20671265e08ee210e3b815ace6b87b1cc02a85',
  '5e9932bb9adbf18227a25100c467e50c1425dcfba52b826d2604bb41e9792d76',
  '5b591c94516091d8cbe16b8c75fa9abecc332e06b1e0be8449aa2a9ce81c6737',
  '78f780df6e53742810853063154d46505fbc33280016c3b50112fda411654585',
  '64b6185f419705d87ac4a6d0fd04c96747da3d326c6e88b8914a28c3e73fcded',
  '6ec3e16e233aac5fcd369bafa174ff9f49e90c7f26d1c5ab90cdb68b71d36ee5',
  '5029774a287d0420d6800487707c766b6cdc082caca24790847d92d64f144f86',
  'fa64c3512a2c778408f8052b2b914a54c51971b788bb1a8d0eb53efaf90a22ee',
  '0afc3400c326317a96fa0458f11f6876804223007c697fc0e661ca5f08937191',
  '8e4e6e27102118d04716f258342af66d7c9d0d076bdc02ac16bbe4b9424f8e90',
  'c0c82f4761b5adf3503b183326ad603867afc24e83d78d4485c26bc2fe5bca56',
]
const config: ObjTypes<ConfigTypes> = {
  dev: {
    baseUrl: '',
    showMoneyUrl: '',
    metaFileServiceUrl: '',
    metaIdServiceUrl: '',
    metaIdCenterUrl: '',
    basePath: '/metasv-buzz/',
    metaIdTag: 'testshowid',
    env: type,
    projectAddress: '15XtDJMeaMAafuVHdxS7Vvu6F8uXF1EU4h',
    payCurrency: 'usd',
    simpleBlogFee: 0.0001,
    payLikeAmount: 0.0001,
    payLikeFee: 0.0001,
    payCommentFee: 0.0001,
    payCommentAmount: 0.0001,
    payFollowAmount: 0.0001,
    payFollowFee: 0.0001,
    rePostAmount: 0.0001,
    rePostFee: 0.0001,
    oauthSettings: {
      clientId: '********',
      clientSecret: '*************',
      redirectUri: '*************'
    },
    recommandUsers: testRecommandUsers,
    hotBuzz: testHotBuzz,
  },
  test: {
    baseUrl: '',
    showMoneyUrl: '',
    metaFileServiceUrl: '',
    metaIdServiceUrl: '',
    metaIdCenterUrl: '',
    basePath: '/metasv-buzz/',
    metaIdTag: 'testshowid',
    env: type,
    projectAddress: '15XtDJMeaMAafuVHdxS7Vvu6F8uXF1EU4h',
    payCurrency: 'usd',
    simpleBlogFee: 0.0001,
    payLikeAmount: 0.0001,
    payLikeFee: 0.0001,
    payCommentFee: 0.0001,
    payCommentAmount: 0.0001,
    payFollowAmount: 0.0001,
    payFollowFee: 0.0001,
    rePostAmount: 0.0001,
    rePostFee: 0.0001,
    oauthSettings: {
      clientId: '********',
      clientSecret: '*************',
      redirectUri: '*************'
    },
    recommandUsers: testRecommandUsers,
    hotBuzz: testHotBuzz,
  },
  prod: {
    baseUrl: 'https://buzz.metasv.com', 		    // 当前项目的基本 Url
    showMoneyUrl: 'https://www.showmoney.app',  // Showmoney 钱包地址 - 不需要变动
    metaFileServiceUrl: 'https://buzz-api.metasv.com/api',  // MetaFile 文件服务API地址 - 不需要变动
    metaIdServiceUrl: 'https://api.showmoney.app',      // Showmoney MetaId 数据服务服务API地址
    // metaIdServiceUrl: 'https://buzz-api.metasv.com',      // MetaSV MetaId 数据服务服务API地址
    metaIdCenterUrl: 'https://api.showmoney.app/tag',// Showmoney Tag 服务API地址
    // metaIdCenterUrl: 'https://buzz-api.metasv.com/tag',// MetaSV Tag 服务API地址
    basePath: '/metasv-buzz/',					// 默认 不需要变动
    metaIdTag: 'metaid',
    env: type,
    projectAddress: '12tfZ62i9GesyYWCA3nZuibFJCGsmxKyF2',
    payCurrency: 'usd',
    simpleBlogFee: 0.01,
    payLikeAmount: 0.02,
    payLikeFee: 0.005,
    payCommentAmount: 0.01,
    payCommentFee: 0.0025,
    payFollowAmount: 0.05,
    payFollowFee: 0.0125,
    rePostAmount: 0.01,
    rePostFee: 0.0025,
    oauthSettings: {
      clientId: 'metabuzz',
      clientSecret: '3aa03fa8-5c67-4bf4-b670-3b8a89ef879a',
      redirectUri: 'https://buzz.metasv.com/metasv-buzz/'
    },
    recommandUsers: prodRecommandUsers,
    hotBuzz: prodHotBuzz,
  },
}

export default config[type]
