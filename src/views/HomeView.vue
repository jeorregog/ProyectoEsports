<template>
  <main class="min-h-screen bg-neutral-950 text-white">
    <section class="border-b border-white/10">
      <div class="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div class="flex flex-col justify-center">
          <p class="text-sm font-semibold uppercase text-cyan-300">Dashboard E-Sports</p>
          <h1 class="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">ProyectoEsports</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Centraliza equipos, jugadores, partidas y ranking competitivo en una sola vista clara
            para el seguimiento del torneo.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/login"
              class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
            >
              <LogIn class="h-4 w-4" />
              Iniciar sesión
            </RouterLink>
            <RouterLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300 hover:text-cyan-200"
            >
              Explorar Dashboard
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>
        </div>

        <div class="rounded-lg border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p class="text-sm font-medium text-gray-300">Resumen competitivo</p>
              <p class="text-xs text-gray-500">Equipos, jugadores y partidas</p>
            </div>
            <Activity class="h-5 w-5 text-lime-300" />
          </div>

          <div class="mt-5 space-y-4">
            <div
              class="flex items-center justify-between rounded border border-white/10 bg-neutral-900 p-4"
            >
              <div>
                <p class="text-xs uppercase text-gray-500">Jugador lider</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ featuredPlayerName }}</p>
              </div>
              <p class="text-sm font-semibold text-cyan-300">{{ featuredPlayerWins }}</p>
            </div>

            <div
              class="flex items-center justify-between rounded border border-white/10 bg-neutral-900 p-4"
            >
              <div>
                <p class="text-xs uppercase text-gray-500">Equipo con más alcance</p>
                <p class="mt-1 text-lg font-semibold text-white">{{ featuredTeamName }}</p>
              </div>
              <p class="text-sm font-semibold text-lime-300">{{ featuredTeamFollowers }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>

    <section class="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-2 lg:px-8">
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

    <section class="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase text-cyan-300">Partidas recientes</p>
          <h2 class="mt-1 text-2xl font-bold text-white">Últimos encuentros registrados</h2>
        </div>
        <RouterLink
          to="/matches"
          class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Ver partidas
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>

      <DataTable :columns="recentMatchColumns" :data="recentMatchRows" />
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-14 lg:px-8">
      <div class="mb-4">
        <p class="text-sm font-semibold uppercase text-lime-300">Módulos del sistema</p>
        <h2 class="mt-1 text-2xl font-bold text-white">Accesos principales</h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <RouterLink
          to="/dashboard"
          class="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300 hover:bg-white/10"
        >
          <BarChart3 class="h-6 w-6 text-cyan-300" />
          <h3 class="mt-4 font-semibold text-white">Dashboard</h3>
          <p class="mt-2 text-sm text-gray-400">Vista general</p>
        </RouterLink>

        <RouterLink
          to="/players"
          class="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300 hover:bg-white/10"
        >
          <Users class="h-6 w-6 text-cyan-300" />
          <h3 class="mt-4 font-semibold text-white">Players</h3>
          <p class="mt-2 text-sm text-gray-400">Jugadores</p>
        </RouterLink>

        <RouterLink
          to="/teams"
          class="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300 hover:bg-white/10"
        >
          <Shield class="h-6 w-6 text-cyan-300" />
          <h3 class="mt-4 font-semibold text-white">Teams</h3>
          <p class="mt-2 text-sm text-gray-400">Equipos</p>
        </RouterLink>

        <RouterLink
          to="/matches"
          class="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300 hover:bg-white/10"
        >
          <Gamepad2 class="h-6 w-6 text-cyan-300" />
          <h3 class="mt-4 font-semibold text-white">Matches</h3>
          <p class="mt-2 text-sm text-gray-400">Partidas</p>
        </RouterLink>

        <RouterLink
          to="/leaderboard"
          class="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-300 hover:bg-white/10"
        >
          <Trophy class="h-6 w-6 text-cyan-300" />
          <h3 class="mt-4 font-semibold text-white">Leaderboard</h3>
          <p class="mt-2 text-sm text-gray-400">Ranking</p>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Gamepad2,
  LogIn,
  Medal,
  Shield,
  Star,
  Trophy,
  Users,
} from 'lucide-vue-next'

import DataTable, { type ColumnDefinition } from '../components/common/DataTable.vue'
import StatCard from '../components/common/StatCard.vue'
import { useMatchStore } from '../stores/match.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

interface RecentMatchRow {
  date: string
  game: string
  team1: string
  team2: string
  winner: string
}

const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const matchStore = useMatchStore()

const numberFormatter = new Intl.NumberFormat('es-CO')
const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const recentMatchColumns: ColumnDefinition<RecentMatchRow>[] = [
  { key: 'date', label: 'Fecha' },
  { key: 'game', label: 'Juego' },
  { key: 'team1', label: 'Team 1' },
  { key: 'team2', label: 'Team 2' },
  { key: 'winner', label: 'Ganador' },
]

onMounted(() => {
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
  matchStore.fetchMatches()
})

const totalVictories = computed(() =>
  matchStore.matches.reduce((total, match) => {
    const winnerId = match.getWinner().getId()

    return winnerId.trim().length > 0 ? total + 1 : total
  }, 0),
)

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

const recentMatchRows = computed<RecentMatchRow[]>(() =>
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

const featuredPlayerName = computed(() => {
  const player = featuredPlayer.value

  return player ? player.getNickname() : 'Sin jugadores registrados'
})

const featuredPlayerWins = computed(() => {
  const player = featuredPlayer.value

  return player ? `${numberFormatter.format(player.getWins())} wins` : '0 wins'
})

const featuredPlayerDetail = computed(() => {
  const player = featuredPlayer.value

  if (!player) {
    return 'Aún no hay jugadores disponibles para calcular el destacado.'
  }

  return `${player.getName()} compite para ${player.getTeam().getName()} con ${numberFormatter.format(
    player.getWins(),
  )} victorias registradas.`
})

const featuredTeamName = computed(() => {
  const team = featuredTeam.value

  return team ? team.getName() : 'Sin equipos registrados'
})

const featuredTeamFollowers = computed(() => {
  const team = featuredTeam.value

  return team ? `${numberFormatter.format(team.getFollowers())} followers` : '0 followers'
})

const featuredTeamDetail = computed(() => {
  const team = featuredTeam.value

  if (!team) {
    return 'Aún no hay equipos disponibles para calcular el destacado.'
  }

  return `${team.getName()} lidera por alcance con ${numberFormatter.format(
    team.getFollowers(),
  )} followers y representa a ${team.getCountry()}.`
})
</script>
