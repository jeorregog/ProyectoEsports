<template>
  <nav class="border-b border-white/10 bg-neutral-950 text-white">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <RouterLink to="/" class="inline-flex items-center gap-2 text-lg font-bold text-white">
        <Gamepad2 class="h-5 w-5 text-cyan-300" />
        E-Sports Dashboard
      </RouterLink>

      <div v-if="isAuthenticated" class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="flex flex-wrap items-center gap-2">
          <RouterLink
            to="/dashboard"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <LayoutDashboard class="h-4 w-4" />
            Dashboard
          </RouterLink>
          <RouterLink
            to="/players"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <Users class="h-4 w-4" />
            Players
          </RouterLink>
          <RouterLink
            to="/teams"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <Shield class="h-4 w-4" />
            Teams
          </RouterLink>
          <RouterLink
            to="/matches"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <Swords class="h-4 w-4" />
            Matches
          </RouterLink>
          <RouterLink
            to="/leaderboard"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <Trophy class="h-4 w-4" />
            Leaderboard
          </RouterLink>
          <RouterLink
            v-if="isAdmin"
            to="/admin/users"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <UserCog class="h-4 w-4" />
            Users
          </RouterLink>
          <RouterLink
            v-if="isAdmin"
            to="/admin/players"
            :class="navLinkClass"
            :exact-active-class="activeNavLinkClass"
          >
            <UsersRound class="h-4 w-4" />
            Admin Players
          </RouterLink>
        </div>

        <div
          class="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0"
        >
          <span class="inline-flex items-center gap-2 text-sm font-medium text-gray-300">
            <UserRound class="h-4 w-4 text-cyan-300" />
            {{ username }}
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            @click="$emit('logout')"
          >
            <LogOut class="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Shield,
  Swords,
  Trophy,
  UserCog,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

/**
 * AppNavbar: Componente de presentacion puro.
 * Recibe el estado de autenticacion, rol y nombre de usuario.
 */
withDefaults(
  defineProps<{
    isAuthenticated: boolean
    isAdmin: boolean
    username?: string
  }>(),
  {
    username: '',
  },
)

defineEmits<{
  (e: 'logout'): void
}>()

const navLinkClass =
  'inline-flex h-9 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white'
const activeNavLinkClass =
  '!bg-cyan-400 !text-neutral-950 shadow shadow-cyan-500/20 hover:!bg-cyan-300 hover:!text-neutral-950'
</script>
