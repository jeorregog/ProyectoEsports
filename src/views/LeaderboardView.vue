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
          <p class="text-sm font-semibold uppercase text-lime-300">Ranking</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Leaderboard</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Clasificación por rendimiento individual y victorias de equipos.
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

      <section class="mb-6 flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          class="flex-1 rounded px-4 py-2 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'players'
              ? 'bg-cyan-400 text-neutral-950'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          "
          @click="activeTab = 'players'"
        >
          Jugadores
        </button>
        <button
          type="button"
          class="flex-1 rounded px-4 py-2 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'teams'
              ? 'bg-cyan-400 text-neutral-950'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          "
          @click="activeTab = 'teams'"
        >
          Equipos
        </button>
      </section>

      <section v-if="activeTab === 'players'" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div class="mb-4">
            <p class="text-sm font-semibold uppercase text-cyan-300">Jugadores</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Ranking por wins</h2>
          </div>
          <DataTable :columns="playerRankingColumns" :data="playerRankingRows" />
        </div>

        <ChartPanel title="Top jugadores por wins" type="bar" :chart-data="playerRankingChartData" />
      </section>

      <section v-else class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div class="mb-4">
            <p class="text-sm font-semibold uppercase text-lime-300">Equipos</p>
            <h2 class="mt-1 text-2xl font-bold text-white">Ranking por victorias</h2>
          </div>
          <DataTable :columns="teamRankingColumns" :data="teamRankingRows" />
        </div>

        <ChartPanel title="Top equipos por victorias" type="bar" :chart-data="teamRankingChartData" />
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
import { useAuthStore } from '../stores/auth.store'
import { useMatchStore } from '../stores/match.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

type LeaderboardTab = 'players' | 'teams'

interface PlayerRankingRow {
  rank: number
  name: string
  nickname: string
  team: string
  wins: string
  earnings: string
}

interface TeamRankingRow {
  rank: number
  team: string
  country: string
  victories: string
  followers: string
}

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const matchStore = useMatchStore()
const router = useRouter()

const activeTab = ref<LeaderboardTab>('players')

const numberFormatter = new Intl.NumberFormat('es-CO')
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const playerRankingColumns: ColumnDefinition<PlayerRankingRow>[] = [
  { key: 'rank', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'team', label: 'Team' },
  { key: 'wins', label: 'Wins' },
  { key: 'earnings', label: 'Earnings' },
]

const teamRankingColumns: ColumnDefinition<TeamRankingRow>[] = [
  { key: 'rank', label: '#' },
  { key: 'team', label: 'Team' },
  { key: 'country', label: 'Country' },
  { key: 'victories', label: 'Victorias' },
  { key: 'followers', label: 'Followers' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
  matchStore.fetchMatches()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const playerRanking = computed(() =>
  [...playerStore.players].sort((firstPlayer, secondPlayer) => {
    const winsDifference = secondPlayer.getWins() - firstPlayer.getWins()

    if (winsDifference !== 0) {
      return winsDifference
    }

    return secondPlayer.getEarnings() - firstPlayer.getEarnings()
  }),
)

const teamVictories = computed(() => {
  const victories = new Map<string, number>()

  matchStore.matches.forEach((match) => {
    const winnerId = match.getWinner().getId()
    victories.set(winnerId, (victories.get(winnerId) ?? 0) + 1)
  })

  return victories
})

const teamRanking = computed(() =>
  [...teamStore.teams]
    .map((team) => ({
      team,
      victories: teamVictories.value.get(team.getId()) ?? 0,
    }))
    .sort((firstTeam, secondTeam) => {
      const victoriesDifference = secondTeam.victories - firstTeam.victories

      if (victoriesDifference !== 0) {
        return victoriesDifference
      }

      return secondTeam.team.getFollowers() - firstTeam.team.getFollowers()
    }),
)

const playerRankingRows = computed<PlayerRankingRow[]>(() =>
  playerRanking.value.map((player, index) => ({
    rank: index + 1,
    name: player.getName(),
    nickname: player.getNickname(),
    team: player.getTeam().getName(),
    wins: numberFormatter.format(player.getWins()),
    earnings: currencyFormatter.format(player.getEarnings()),
  })),
)

const teamRankingRows = computed<TeamRankingRow[]>(() =>
  teamRanking.value.map((item, index) => ({
    rank: index + 1,
    team: item.team.getName(),
    country: item.team.getCountry(),
    victories: numberFormatter.format(item.victories),
    followers: numberFormatter.format(item.team.getFollowers()),
  })),
)

const playerRankingChartData = computed<ChartData<'bar', number[], string>>(() => {
  const topPlayers = playerRanking.value.slice(0, 6)

  return {
    labels: topPlayers.map((player) => player.getNickname()),
    datasets: [
      {
        label: 'Wins',
        data: topPlayers.map((player) => player.getWins()),
        backgroundColor: '#22d3ee',
      },
    ],
  }
})

const teamRankingChartData = computed<ChartData<'bar', number[], string>>(() => {
  const topTeams = teamRanking.value.slice(0, 6)

  return {
    labels: topTeams.map((item) => item.team.getName()),
    datasets: [
      {
        label: 'Victorias',
        data: topTeams.map((item) => item.victories),
        backgroundColor: '#84cc16',
      },
    ],
  }
})

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
