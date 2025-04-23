import { createWebHistory, createRouter } from 'vue-router'

import { db } from './db'
import Home from './pages/Home.vue'
import SignIn from './pages/SignIn.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home,
  },
  {
    name: 'SignIn',
    path: '/signin',
    component: SignIn,
    beforeEnter: async () => {
      const { data } = await db.auth.getSession()
      const isAuthenticated = !!data.session

      if (isAuthenticated) {
        return { name: 'Home', hash: '' }
      }
    },
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { data } = await db.auth.getSession()
  const isAuthenticated = !!data.session

  if (!isAuthenticated && to.name !== 'SignIn') {
    return { name: 'SignIn' }
  }
})