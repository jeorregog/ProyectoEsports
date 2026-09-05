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
          <p class="text-sm font-semibold uppercase text-cyan-300">Jugadores</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Players</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Explora el roster por equipo, país, rol y rendimiento competitivo.
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
        <div class="grid gap-4 md:grid-cols-3">
          <FilterSelect v-model="selectedTeamId" label="Team" :options="teamOptions" />
          <FilterSelect v-model="selectedCountry" label="Country" :options="countryOptions" />
          <FilterSelect v-model="selectedRole" label="Role" :options="roleOptions" />
        </div>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Wins por jugador" type="bar" :chart-data="winsByPlayerChartData" />
        <ChartPanel title="Jugadores por role" type="doughnut" :chart-data="playersByRoleChartData" />
      </section>

      <section class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase text-cyan-300">Roster filtrado</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Jugadores encontrados</h2>
          </div>
          <p class="text-sm text-gray-400">{{ filteredPlayers.length }} resultados</p>
        </div>

        <DataTable :columns="playerColumns" :data="playerRows" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ChartData } from 'chart.js'
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'

import ChartPanel from '../components/charts/ChartPanel.vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import DataTable, { type ColumnDefinition } from '../components/common/DataTable.vue'
import FilterSelect, { type SelectOption } from '../components/common/FilterSelect.vue'
import { useAuthStore } from '../stores/auth.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

type FilterValue = string | number

interface PlayerRow {
  name: string
  nickname: string
  team: string
  country: string
  role: string
  wins: string
  earnings: string
}

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const router = useRouter()

const selectedTeamId = ref<FilterValue>('')
const selectedCountry = ref<FilterValue>('')
const selectedRole = ref<FilterValue>('')

const numberFormatter = new Intl.NumberFormat('es-CO')
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const chartColors = ['#22d3ee', '#84cc16', '#f97316', '#a855f7', '#ef4444', '#14b8a6']

const playerColumns: ColumnDefinition<PlayerRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'team', label: 'Team' },
  { key: 'country', label: 'Country' },
  { key: 'role', label: 'Role' },
  { key: 'wins', label: 'Wins' },
  { key: 'earnings', label: 'Earnings' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const createAllOption = (): SelectOption => ({ label: 'Todos', value: '' })

const createTextOptions = (values: string[]): SelectOption[] => [
  createAllOption(),
  ...Array.from(new Set(values))
    .sort((firstValue, secondValue) => firstValue.localeCompare(secondValue))
    .map((value) => ({ label: value, value })),
]

const teamOptions = computed<SelectOption[]>(() => [
  createAllOption(),
  ...teamStore.teams.map((team) => ({
    label: team.getName(),
    value: team.getId(),
  })),
])

const countryOptions = computed<SelectOption[]>(() =>
  createTextOptions(playerStore.players.map((player) => player.getCountry())),
)

const roleOptions = computed<SelectOption[]>(() =>
  createTextOptions(playerStore.players.map((player) => player.getRole())),
)

const filteredPlayers = computed(() =>
  playerStore.players.filter((player) => {
    const teamId = String(selectedTeamId.value)
    const country = String(selectedCountry.value)
    const role = String(selectedRole.value)

    const matchesTeam = teamId === '' || player.getTeam().getId() === teamId
    const matchesCountry = country === '' || player.getCountry() === country
    const matchesRole = role === '' || player.getRole() === role

    return matchesTeam && matchesCountry && matchesRole
  }),
)

const playerRows = computed<PlayerRow[]>(() =>
  filteredPlayers.value.map((player) => ({
    name: player.getName(),
    nickname: player.getNickname(),
    team: player.getTeam().getName(),
    country: player.getCountry(),
    role: player.getRole(),
    wins: numberFormatter.format(player.getWins()),
    earnings: currencyFormatter.format(player.getEarnings()),
  })),
)

const winsByPlayerChartData = computed<ChartData<'bar', number[], string>>(() => ({
  labels: filteredPlayers.value.map((player) => player.getNickname()),
  datasets: [
    {
      label: 'Wins',
      data: filteredPlayers.value.map((player) => player.getWins()),
      backgroundColor: '#22d3ee',
    },
  ],
}))

const playersByRoleChartData = computed<ChartData<'doughnut', number[], string>>(() => {
  const playersByRole = new Map<string, number>()

  filteredPlayers.value.forEach((player) => {
    const role = player.getRole()
    playersByRole.set(role, (playersByRole.get(role) ?? 0) + 1)
  })

  return {
    labels: [...playersByRole.keys()],
    datasets: [
      {
        label: 'Jugadores',
        data: [...playersByRole.values()],
        backgroundColor: chartColors,
      },
    ],
  }
})

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
