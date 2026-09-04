import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '../models/User'
import { AuthService, type LoginCredentials, type RegisterInput } from '../services/AuthService'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = shallowRef<User | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.getIsAdmin() ?? false)

  function login(credentials: LoginCredentials): User {
    const user = AuthService.login(credentials)
    currentUser.value = user
    return user
  }

  function register(input: RegisterInput): User {
    const user = AuthService.register(input)
    currentUser.value = user
    return user
  }

  function logout(): void {
    AuthService.logout()
    currentUser.value = null
  }

  function loadCurrentUser(): User | null {
    const user = AuthService.getCurrentUser()
    currentUser.value = user ?? null
    return currentUser.value
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    loadCurrentUser,
  }
})
