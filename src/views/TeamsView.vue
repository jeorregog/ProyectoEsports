<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <AppNavbar
      :is-authenticated="authStore.isAuthenticated"
      :username="currentUsername"
      @logout="handleLogout"
    />

    <main class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase text-lime-300">Equipos</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Teams</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Consulta organizaciones, seguidores y composición de jugadores.
          </p>
        </div>
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Volver al Dashboard
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>

      <section class="rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
        <div class="grid gap-4 md:grid-cols-[1fr_2fr]">
          <FilterSelect v-model="selectedCountry" label="Country" :options="countryOptions" />
          <div>
            <label for="team-search" class="block text-sm font-medium text-gray-700">
              Buscar por team
            </label>
            <div class="relative mt-1">
              <Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                id="team-search"
                v-model.trim="searchTerm"
                type="search"
                class="w-full rounded border border-gray-300 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del equipo"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold uppercase text-lime-300">Directorio</p>
              <h2 class="mt-1 text-2xl font-bold text-white">Equipos encontrados</h2>
            </div>
            <p class="text-sm text-gray-400">{{ filteredTeams.length }} resultados</p>
          </div>
          <DataTable :columns="teamColumns" :data="teamRows" />
        </div>

        <aside class="rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
          <FilterSelect
            v-model="selectedTeamId"
            label="Detalle del equipo"
            :options="teamDetailOptions"
            placeholder="Selecciona un equipo"
          />

          <div v-if="selectedTeam" class="mt-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold">{{ selectedTeam.getName() }}</h2>
                <p class="mt-1 text-sm text-gray-500">{{ selectedTeam.getCountry() }}</p>
              </div>
              <Shield class="h-8 w-8 text-lime-600" />
            </div>

            <dl class="mt-5 grid grid-cols-2 gap-3">
              <div class="rounded border border-gray-200 p-3">
                <dt class="text-xs uppercase text-gray-500">Followers</dt>
                <dd class="mt-1 text-lg font-semibold">{{ formatNumber(selectedTeam.getFollowers()) }}</dd>
              </div>
              <div class="rounded border border-gray-200 p-3">
                <dt class="text-xs uppercase text-gray-500">Players</dt>
                <dd class="mt-1 text-lg font-semibold">{{ selectedTeamPlayers.length }}</dd>
              </div>
            </dl>

            <div class="mt-6">
              <h3 class="text-sm font-semibold uppercase text-gray-500">Jugadores</h3>
              <ul v-if="selectedTeamPlayers.length > 0" class="mt-3 space-y-2">
                <li
                  v-for="player in selectedTeamPlayers"
                  :key="player.getId()"
                  class="rounded border border-gray-200 px-3 py-2"
                >
                  <p class="font-medium">{{ player.getNickname() }}</p>
                  <p class="text-sm text-gray-500">{{ player.getName() }} · {{ player.getRole() }}</p>
                </li>
              </ul>
              <p v-else class="mt-3 rounded border border-gray-200 px-3 py-4 text-sm text-gray-500">
                Este equipo no tiene jugadores registrados.
              </p>
            </div>
          </div>

          <p v-else class="mt-6 rounded border border-gray-200 px-3 py-4 text-sm text-gray-500">
            No hay equipos disponibles para mostrar detalle.
          </p>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowRight, Search, Shield } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'

import AppNavbar from '../components/common/AppNavbar.vue'
import DataTable, { type ColumnDefinition } from '../components/common/DataTable.vue'
import FilterSelect, { type SelectOption } from '../components/common/FilterSelect.vue'
import { useAuthStore } from '../stores/auth.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

type FilterValue = string | number

interface TeamRow {
  team: string
  country: string
  followers: string
  players: number
}

const authStore = useAuthStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const router = useRouter()

const selectedCountry = ref<FilterValue>('')
const selectedTeamId = ref<FilterValue>('')
const searchTerm = ref('')

const numberFormatter = new Intl.NumberFormat('es-CO')

const teamColumns: ColumnDefinition<TeamRow>[] = [
  { key: 'team', label: 'Team' },
  { key: 'country', label: 'Country' },
  { key: 'followers', label: 'Followers' },
  { key: 'players', label: 'Players' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const createAllOption = (): SelectOption => ({ label: 'Todos', value: '' })

const countryOptions = computed<SelectOption[]>(() => [
  createAllOption(),
  ...Array.from(new Set(teamStore.teams.map((team) => team.getCountry())))
    .sort((firstCountry, secondCountry) => firstCountry.localeCompare(secondCountry))
    .map((country) => ({ label: country, value: country })),
])

const filteredTeams = computed(() =>
  teamStore.teams.filter((team) => {
    const country = String(selectedCountry.value)
    const normalizedSearch = searchTerm.value.toLowerCase()

    const matchesCountry = country === '' || team.getCountry() === country
    const matchesSearch = team.getName().toLowerCase().includes(normalizedSearch)

    return matchesCountry && matchesSearch
  }),
)

const teamRows = computed<TeamRow[]>(() =>
  filteredTeams.value.map((team) => ({
    team: team.getName(),
    country: team.getCountry(),
    followers: numberFormatter.format(team.getFollowers()),
    players: playerStore.players.filter(
      (player) => player.getTeam().getId() === team.getId(),
    ).length,
  })),
)

const teamDetailOptions = computed<SelectOption[]>(() =>
  filteredTeams.value.map((team) => ({
    label: team.getName(),
    value: team.getId(),
  })),
)

const selectedTeam = computed(() => {
  const teamId = String(selectedTeamId.value)

  return filteredTeams.value.find((team) => team.getId() === teamId)
})

const selectedTeamPlayers = computed(() => {
  const team = selectedTeam.value

  if (!team) {
    return []
  }

  return playerStore.players.filter((player) => player.getTeam().getId() === team.getId())
})

watch(
  filteredTeams,
  (teams) => {
    const currentTeamId = String(selectedTeamId.value)
    const selectedTeamStillVisible = teams.some((team) => team.getId() === currentTeamId)

    if (selectedTeamStillVisible) {
      return
    }

    const firstTeam = teams[0]
    selectedTeamId.value = firstTeam ? firstTeam.getId() : ''
  },
  { immediate: true },
)

const formatNumber = (value: number): string => numberFormatter.format(value)

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
