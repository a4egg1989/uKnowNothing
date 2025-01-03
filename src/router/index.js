import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/stocksAdmin',
    name: 'stocksAdmin',
    component: () => import('../views/stocksAdmin.vue')
  },
  {
    path: '/stocksView',
    name: 'stocksView',
    component: () => import('../views/stocksView.vue')
  },

  // 未設定的路由都導回首頁
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home', params: {} }
  }
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
})

export default router
