import { createRouter, createWebHistory } from 'vue-router'
// createRouter用于创建实例
// 配置history 模式
// 1.hisyory模式：createWebHistory 地址栏不带#
// 2.hash模式：createWebHashHistory地址栏带#号

// vite中的环境变量import.meta.env.BASE_URL 就是bite.config.js中的base配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/login',component:()=>import('./views/login/LoginPage.vue'),
      
    },//登录页
    {path:'/',component:()=>import('./views/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
        {path:'/article/manage', component:()=>import('./views/article/ArticleChannel.vue')},
        {path:'/article/channel', component:()=>import('./views/article/ArticleChannel.vue')},
        {path:'/views/user/vatar', component:()=>import('./views/user/UserAvatar.vue')},
        {path:'/views/user/password', component:()=>import('./views/user/UserPassword.vue')},
        {path:'/views/user/profile', component:()=>import('./views/user/UserProfile.vue')},
  
      ]
    }//架子
  ],
})

export default router
