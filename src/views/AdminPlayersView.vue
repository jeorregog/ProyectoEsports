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
          <p class="text-sm font-semibold uppercase text-cyan-300">Administración</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Players</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Gestiona jugadores, rendimiento, rol y equipo asociado.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
          @click="openCreatePlayer"
        >
          <Plus class="h-4 w-4" />
          Nuevo player
        </button>
      </div>

      <section class="mb-6 rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
        <FilterSelect v-model="selectedTeamFilter" label="Team" :options="teamFilterOptions" />
      </section>

      <p
        v-if="pageError"
        class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ pageError }}
      </p>

      <DataTable
        :columns="playerColumns"
        :data="playerRows"
        show-actions
        @edit="openEditPlayer"
        @delete="handleDeletePlayer"
      />
    </main>

    <EntityFormModal
      :is-open="isModalOpen"
      :title="modalTitle"
      :submit-text="modalSubmitText"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleSubmitPlayer"
    >
      <p
        v-if="formError"
        class="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ formError }}
      </p>

      <div>
        <label for="player-name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="player-name"
          v-model.trim="playerForm.name"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="player-nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
        <input
          id="player-nickname"
          v-model.trim="playerForm.nickname"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="player-wins" class="block text-sm font-medium text-gray-700">Wins</label>
          <input
            id="player-wins"
            v-model.number="playerForm.wins"
            type="number"
            min="0"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="player-earnings" class="block text-sm font-medium text-gray-700">Earnings</label>
          <input
            id="player-earnings"
            v-model.number="playerForm.earnings"
            type="number"
            min="0"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="player-role" class="block text-sm font-medium text-gray-700">Role</label>
          <input
            id="player-role"
            v-model.trim="playerForm.role"
            type="text"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="player-country" class="block text-sm font-medium text-gray-700">Country</label>
          <input
            id="player-country"
            v-model.trim="playerForm.country"
            type="text"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <FilterSelect
        v-model="playerForm.teamId"
        label="Team"
        :options="teamFormOptions"
        placeholder="Selecciona un equipo"
      />
    </EntityFormModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import AppNavbar from '../components/common/AppNavbar.vue'
import DataTable, { type ColumnDefinition } from '../components/common/DataTable.vue'
import EntityFormModal from '../components/common/EntityFormModal.vue'
import FilterSelect, { type SelectOption } from '../components/common/FilterSelect.vue'
import { useAuthStore } from '../stores/auth.store'
import { usePlayerStore } from '../stores/player.store'
import { useTeamStore } from '../stores/team.store'

type FilterValue = string | number

interface PlayerRow {
  id: string
  name: string
  nickname: string
  team: string
  country: string
  role: string
  wins: string
  earnings: string
}

interface PlayerFormState {
  name: string
  nickname: string
  wins: number
  earnings: number
  role: string
  country: string
  teamId: FilterValue
}

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const router = useRouter()

const selectedTeamFilter = ref<FilterValue>('')
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const selectedPlayerId = ref<string | null>(null)
const pageError = ref('')
const formError = ref('')

const playerForm = reactive<PlayerFormState>({
  name: '',
  nickname: '',
  wins: 0,
  earnings: 0,
  role: '',
  country: '',
  teamId: '',
})

const numberFormatter = new Intl.NumberFormat('es-CO')
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

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

const modalTitle = computed(() => (selectedPlayerId.value ? 'Editar player' : 'Nuevo player'))
const modalSubmitText = computed(() => (selectedPlayerId.value ? 'Actualizar' : 'Crear'))

const teamFormOptions = computed<SelectOption[]>(() =>
  teamStore.teams.map((team) => ({
    label: team.getName(),
    value: team.getId(),
  })),
)

const teamFilterOptions = computed<SelectOption[]>(() => [
  { label: 'Todos', value: '' },
  ...teamFormOptions.value,
])

const filteredPlayers = computed(() =>
  playerStore.players.filter((player) => {
    const teamId = String(selectedTeamFilter.value)

    return teamId === '' || player.getTeam().getId() === teamId
  }),
)

const playerRows = computed<PlayerRow[]>(() =>
  filteredPlayers.value.map((player) => ({
    id: player.getId(),
    name: player.getName(),
    nickname: player.getNickname(),
    team: player.getTeam().getName(),
    country: player.getCountry(),
    role: player.getRole(),
    wins: numberFormatter.format(player.getWins()),
    earnings: currencyFormatter.format(player.getEarnings()),
  })),
)

const resetForm = () => {
  playerForm.name = ''
  playerForm.nickname = ''
  playerForm.wins = 0
  playerForm.earnings = 0
  playerForm.role = ''
  playerForm.country = ''
  playerForm.teamId = ''
}

const openCreatePlayer = () => {
  pageError.value = ''
  formError.value = ''
  selectedPlayerId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEditPlayer = (row: PlayerRow) => {
  const player = playerStore.getPlayerById(row.id)

  if (!player) {
    pageError.value = 'No fue posible encontrar el player seleccionado.'
    return
  }

  pageError.value = ''
  formError.value = ''
  selectedPlayerId.value = player.getId()
  playerForm.name = player.getName()
  playerForm.nickname = player.getNickname()
  playerForm.wins = player.getWins()
  playerForm.earnings = player.getEarnings()
  playerForm.role = player.getRole()
  playerForm.country = player.getCountry()
  playerForm.teamId = player.getTeam().getId()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedPlayerId.value = null
  formError.value = ''
  resetForm()
}

const handleSubmitPlayer = () => {
  formError.value = ''
  isSubmitting.value = true

  try {
    const teamId = String(playerForm.teamId)
    const name = playerForm.name.trim()
    const nickname = playerForm.nickname.trim()
    const role = playerForm.role.trim()
    const country = playerForm.country.trim()

    if (!name || !nickname || !role || !country || !teamId) {
      formError.value = 'Completa todos los campos obligatorios.'
      return
    }

    if (
      !Number.isFinite(playerForm.wins) ||
      !Number.isInteger(playerForm.wins) ||
      playerForm.wins < 0 ||
      !Number.isFinite(playerForm.earnings) ||
      playerForm.earnings < 0
    ) {
      formError.value = 'Wins debe ser un entero no negativo y earnings un número no negativo.'
      return
    }

    const input = {
      name,
      nickname,
      wins: playerForm.wins,
      earnings: playerForm.earnings,
      role,
      country,
      teamId,
    }

    if (selectedPlayerId.value) {
      const updatedPlayer = playerStore.updatePlayer(selectedPlayerId.value, input)

      if (!updatedPlayer) {
        formError.value = 'No fue posible actualizar el player.'
        return
      }
    } else {
      playerStore.createPlayer(input)
    }

    teamStore.fetchTeams()
    closeModal()
  } catch (error: unknown) {
    formError.value =
      error instanceof Error ? error.message : 'No fue posible guardar el player.'
  } finally {
    isSubmitting.value = false
  }
}

const handleDeletePlayer = (row: PlayerRow) => {
  pageError.value = ''

  try {
    const deleted = playerStore.deletePlayer(row.id)

    if (!deleted) {
      pageError.value = 'No fue posible eliminar el player seleccionado.'
      return
    }

    teamStore.fetchTeams()
  } catch (error: unknown) {
    pageError.value =
      error instanceof Error ? error.message : 'No fue posible eliminar el player.'
  }
}

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
