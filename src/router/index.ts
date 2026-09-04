import { createRouter, createWebHistory } from 'vue-router'

import AdminPlayersView from '../views/AdminPlayersView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import DashboardView from '../views/DashboardView.vue'
import HomeView from '../views/HomeView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import LoginView from '../views/LoginView.vue'
import MatchesView from '../views/MatchesView.vue'
import PlayersView from '../views/PlayersView.vue'
import TeamsView from '../views/TeamsView.vue'
import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/players',
      component: PlayersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/teams',
      component: TeamsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/matches',
      component: MatchesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/leaderboard',
      component: LeaderboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/users',
      component: AdminUsersView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/players',
      component: AdminPlayersView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  authStore.loadCurrentUser()

  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/dashboard'
  }

  if (!to.meta.requiresAuth) {
    return true
  }

  if (!authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/dashboard'
  }

  return true
})

export default router
