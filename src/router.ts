import { createWebHistory, createRouter } from 'vue-router'

import { api } from './api/client'
import Activity from './pages/Activity.vue'
import SignIn from './pages/SignIn.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  {
    name: 'Activity',
    path: '/',
    component: Activity,
  },
  {
    name: 'SignIn',
    path: '/signin',
    component: SignIn,
    beforeEnter: async () => {
      const { data } = await api.auth.getSession()
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
  const { data } = await api.auth.getSession()
  const isAuthenticated = !!data.session

  if (!isAuthenticated && to.name !== 'SignIn') {
    return { name: 'SignIn' }
  }
})