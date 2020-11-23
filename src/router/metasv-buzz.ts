import Vue from 'vue'
import Router from 'vue-router'
import index from '@views/metasv-buzz/index.vue'
import AppConfig from '@/config/metasv-buzz'

Vue.use(Router)

export default new Router({
  // base: '/projects/metasv-buzz/', // 测试服务器
  base: AppConfig.basePath,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'buzz',
      component: index,
      // redirect: { name: 'buzzList' },
      children: [
        {
          path: 'list',
          name: 'buzzList',
          component: (): Promise<any> => import('@views/metasv-buzz/list.vue'),
        },
        {
          path: 'users/:type',
          name: 'users',
          component: (): Promise<any> => import('@views/metasv-buzz/users.vue'),
        },
        {
          path: 'user/:metaId/:type',
          name: 'user',
          component: (): Promise<any> => import('@views/metasv-buzz/user.vue'),
        },
        {
          path: 'detail/:id',
          name: 'buzzDetail',
          component: (): Promise<any> => import('@views/metasv-buzz/detail.vue'),
        },
      ],
    },
  ],
})
