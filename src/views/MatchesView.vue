<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <AppNavbar
      :is-authenticated="authStore.isAuthenticated"
      :is-admin="authStore.isAdmin"
      :username="currentUsername"
      @logout="handleLogout"
    />

    <main class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase text-cyan-300">Partidas</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Matches</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Filtra encuentros por juego, equipo participante o ganador.
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
          <FilterSelect v-model="selectedGame" label="Game" :options="gameOptions" />
          <FilterSelect v-model="selectedTeamId" label="Team" :options="teamOptions" />
          <FilterSelect v-model="selectedWinnerId" label="Winner" :options="winnerOptions" />
        </div>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Partidas por game" type="bar" :chart-data="matchesByGameChartData" />
        <ChartPanel title="Victorias por team" type="doughnut" :chart-data="victoriesByTeamChartData" />
      </section>

      <section class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase text-cyan-300">Registro</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Partidas encontradas</h2>
          </div>
          <p class="text-sm text-gray-400">{{ filteredMatches.length }} resultados</p>
        </div>

        <DataTable :columns="matchColumns" :data="matchRows" />
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
import { useMatchStore } from '../stores/match.store'
import { useTeamStore } from '../stores/team.store'

type FilterValue = string | number

interface MatchRow {
  date: string
  game: string
  team1: string
  team2: string
  winner: string
}

const authStore = useAuthStore()
const matchStore = useMatchStore()
const teamStore = useTeamStore()
const router = useRouter()

const selectedGame = ref<FilterValue>('')
const selectedTeamId = ref<FilterValue>('')
const selectedWinnerId = ref<FilterValue>('')

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})
const chartColors = ['#22d3ee', '#84cc16', '#f97316', '#a855f7', '#ef4444', '#14b8a6']

const matchColumns: ColumnDefinition<MatchRow>[] = [
  { key: 'date', label: 'Date' },
  { key: 'game', label: 'Game' },
  { key: 'team1', label: 'Team1' },
  { key: 'team2', label: 'Team2' },
  { key: 'winner', label: 'Winner' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  teamStore.fetchTeams()
  matchStore.fetchMatches()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const createAllOption = (): SelectOption => ({ label: 'Todos', value: '' })

const gameOptions = computed<SelectOption[]>(() => [
  createAllOption(),
  ...Array.from(new Set(matchStore.matches.map((match) => match.getGame())))
    .sort((firstGame, secondGame) => firstGame.localeCompare(secondGame))
    .map((game) => ({ label: game, value: game })),
])

const teamOptions = computed<SelectOption[]>(() => [
  createAllOption(),
  ...teamStore.teams.map((team) => ({
    label: team.getName(),
    value: team.getId(),
  })),
])

const winnerOptions = computed<SelectOption[]>(() => [
  createAllOption(),
  ...teamStore.teams.map((team) => ({
    label: team.getName(),
    value: team.getId(),
  })),
])

const filteredMatches = computed(() =>
  matchStore.matches.filter((match) => {
    const game = String(selectedGame.value)
    const teamId = String(selectedTeamId.value)
    const winnerId = String(selectedWinnerId.value)

    const matchesGame = game === '' || match.getGame() === game
    const matchesTeam =
      teamId === '' || match.getTeam1().getId() === teamId || match.getTeam2().getId() === teamId
    const matchesWinner = winnerId === '' || match.getWinner().getId() === winnerId

    return matchesGame && matchesTeam && matchesWinner
  }),
)

const matchRows = computed<MatchRow[]>(() =>
  [...filteredMatches.value]
    .sort(
      (firstMatch, secondMatch) => secondMatch.getDate().getTime() - firstMatch.getDate().getTime(),
    )
    .map((match) => ({
      date: dateFormatter.format(match.getDate()),
      game: match.getGame(),
      team1: match.getTeam1().getName(),
      team2: match.getTeam2().getName(),
      winner: match.getWinner().getName(),
    })),
)

const matchesByGameChartData = computed<ChartData<'bar', number[], string>>(() => {
  const matchesByGame = new Map<string, number>()

  filteredMatches.value.forEach((match) => {
    const game = match.getGame()
    matchesByGame.set(game, (matchesByGame.get(game) ?? 0) + 1)
  })

  return {
    labels: [...matchesByGame.keys()],
    datasets: [
      {
        label: 'Partidas',
        data: [...matchesByGame.values()],
        backgroundColor: '#22d3ee',
      },
    ],
  }
})

const victoriesByTeamChartData = computed<ChartData<'doughnut', number[], string>>(() => {
  const victoriesByTeam = new Map<string, number>()

  filteredMatches.value.forEach((match) => {
    const winnerName = match.getWinner().getName()
    victoriesByTeam.set(winnerName, (victoriesByTeam.get(winnerName) ?? 0) + 1)
  })

  return {
    labels: [...victoriesByTeam.keys()],
    datasets: [
      {
        label: 'Victorias',
        data: [...victoriesByTeam.values()],
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
