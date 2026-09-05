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
          <p class="text-sm font-semibold uppercase text-cyan-300">Panel principal</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Dashboard competitivo</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Métricas generales, actividad reciente y rendimiento resumido del ecosistema.
          </p>
        </div>
        <RouterLink
          to="/leaderboard"
          class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Ver ranking
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Equipos" :value="teamStore.teamCount">
          <template #icon>
            <Shield class="h-6 w-6" />
          </template>
        </StatCard>
        <StatCard title="Jugadores" :value="playerStore.playerCount">
          <template #icon>
            <Users class="h-6 w-6" />
          </template>
        </StatCard>
        <StatCard title="Partidas" :value="matchStore.matchCount">
          <template #icon>
            <Gamepad2 class="h-6 w-6" />
          </template>
        </StatCard>
        <StatCard title="Victorias" :value="totalVictories">
          <template #icon>
            <Trophy class="h-6 w-6" />
          </template>
        </StatCard>
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Victorias por equipo" type="bar" :chart-data="victoriesByTeamChartData" />
        <ChartPanel title="Partidas por juego" type="doughnut" :chart-data="matchesByGameChartData" />
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2">
        <article class="rounded-lg border border-white/10 bg-white p-6 text-gray-900 shadow">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase text-cyan-700">Jugador destacado</p>
              <h2 class="mt-2 text-2xl font-bold">{{ featuredPlayerName }}</h2>
            </div>
            <Medal class="h-8 w-8 text-cyan-600" />
          </div>
          <p class="mt-4 text-sm text-gray-600">{{ featuredPlayerDetail }}</p>
        </article>

        <article class="rounded-lg border border-white/10 bg-white p-6 text-gray-900 shadow">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase text-lime-700">Equipo destacado</p>
              <h2 class="mt-2 text-2xl font-bold">{{ featuredTeamName }}</h2>
            </div>
            <Star class="h-8 w-8 text-lime-600" />
          </div>
          <p class="mt-4 text-sm text-gray-600">{{ featuredTeamDetail }}</p>
        </article>
      </section>

      <section class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase text-cyan-300">Actividad reciente</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Partidas recientes</h2>
          </div>
        </div>
        <DataTable :columns="recentMatchColumns" :data="recentMatchRows" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { ChartData } from 'chart.js'
import {
  ArrowRight,
  Gamepad2,
  Medal,
  Shield,
  Star,
  Trophy,
  Users,
} from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'

import ChartPanel from '../components/charts/ChartPanel.vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import DataTable, { type ColumnDefinition } from '../components/common/DataTable.vue'
import StatCard from '../components/common/StatCard.vue'
import { useAuthStore } from '../stores/auth.store'
import { useMatchStore } from '../stores/match.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

interface MatchRow {
  date: string
  game: string
  team1: string
  team2: string
  winner: string
}

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const matchStore = useMatchStore()
const router = useRouter()

const numberFormatter = new Intl.NumberFormat('es-CO')
const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const chartColors = ['#22d3ee', '#84cc16', '#f97316', '#a855f7', '#ef4444', '#14b8a6']

const recentMatchColumns: ColumnDefinition<MatchRow>[] = [
  { key: 'date', label: 'Fecha' },
  { key: 'game', label: 'Juego' },
  { key: 'team1', label: 'Team 1' },
  { key: 'team2', label: 'Team 2' },
  { key: 'winner', label: 'Ganador' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
  matchStore.fetchMatches()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const totalVictories = computed(() => matchStore.matches.length)

const featuredPlayer = computed(() => {
  const sortedPlayers = [...playerStore.players].sort(
    (firstPlayer, secondPlayer) => secondPlayer.getWins() - firstPlayer.getWins(),
  )

  return sortedPlayers.length > 0 ? sortedPlayers[0] : undefined
})

const featuredTeam = computed(() => {
  const sortedTeams = [...teamStore.teams].sort(
    (firstTeam, secondTeam) => secondTeam.getFollowers() - firstTeam.getFollowers(),
  )

  return sortedTeams.length > 0 ? sortedTeams[0] : undefined
})

const featuredPlayerName = computed(() => {
  const player = featuredPlayer.value

  return player ? player.getNickname() : 'Sin jugadores registrados'
})

const featuredPlayerDetail = computed(() => {
  const player = featuredPlayer.value

  if (!player) {
    return 'Aún no hay jugadores disponibles para calcular el destacado.'
  }

  return `${player.getName()} suma ${numberFormatter.format(player.getWins())} victorias con ${player
    .getTeam()
    .getName()}.`
})

const featuredTeamName = computed(() => {
  const team = featuredTeam.value

  return team ? team.getName() : 'Sin equipos registrados'
})

const featuredTeamDetail = computed(() => {
  const team = featuredTeam.value

  if (!team) {
    return 'Aún no hay equipos disponibles para calcular el destacado.'
  }

  return `${team.getName()} lidera por alcance con ${numberFormatter.format(
    team.getFollowers(),
  )} followers.`
})

const recentMatchRows = computed<MatchRow[]>(() =>
  [...matchStore.matches]
    .sort(
      (firstMatch, secondMatch) => secondMatch.getDate().getTime() - firstMatch.getDate().getTime(),
    )
    .slice(0, 5)
    .map((match) => ({
      date: dateFormatter.format(match.getDate()),
      game: match.getGame(),
      team1: match.getTeam1().getName(),
      team2: match.getTeam2().getName(),
      winner: match.getWinner().getName(),
    })),
)

const victoriesByTeamChartData = computed<ChartData<'bar', number[], string>>(() => {
  const victoriesByTeam = new Map<string, number>()

  teamStore.teams.forEach((team) => {
    victoriesByTeam.set(team.getName(), 0)
  })

  matchStore.matches.forEach((match) => {
    const winnerName = match.getWinner().getName()
    victoriesByTeam.set(winnerName, (victoriesByTeam.get(winnerName) ?? 0) + 1)
  })

  return {
    labels: [...victoriesByTeam.keys()],
    datasets: [
      {
        label: 'Victorias',
        data: [...victoriesByTeam.values()],
        backgroundColor: '#22d3ee',
      },
    ],
  }
})

const matchesByGameChartData = computed<ChartData<'doughnut', number[], string>>(() => {
  const matchesByGame = new Map<string, number>()

  matchStore.matches.forEach((match) => {
    const game = match.getGame()
    matchesByGame.set(game, (matchesByGame.get(game) ?? 0) + 1)
  })

  return {
    labels: [...matchesByGame.keys()],
    datasets: [
      {
        label: 'Partidas',
        data: [...matchesByGame.values()],
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
