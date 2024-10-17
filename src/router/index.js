import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore}from '@/stores/index'
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
        {path:'/article/manage', component:()=>import('./views/article/ArticleManage.vue')},
        {path:'/article/channel', component:()=>import('./views/article/ArticleChannel.vue')},
        {path:'/user/avatar', component:()=>import('./views/user/UserAvatar.vue')},
        {path:'/user/password', component:()=>import('./views/user/UserPassword.vue')},
        {path:'/user/profile', component:()=>import('./views/user/UserProfile.vue')},
  
      ]
    }//架子
  ],
})

// 登录访问拦截 =>默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1.undefined/ture 直接放行
// 2.false 拦回from的地址页面
// 3.具体路径 或 路径对象 拦截到对应的地址去
// '/login'{name:'login'}
router.beforeEach((to)=>{
  // 如果没有token，是访问的非登录页，拦截到登录，其他情况正常放行
const useStore = useUserStore();
if(!useStore.token&& to.path !== '/login') return '/login'
return true
})

export default router
