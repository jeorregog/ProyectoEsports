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
          <p class="text-sm font-semibold uppercase text-cyan-300">Administración</p>
          <h1 class="mt-1 text-3xl font-bold text-white">Usuarios</h1>
          <p class="mt-2 max-w-2xl text-sm text-gray-400">
            Gestiona cuentas, correos y permisos de administrador.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
          @click="openCreateUser"
        >
          <Plus class="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      <p
        v-if="pageError"
        class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ pageError }}
      </p>

      <section>
        <DataTable
          :columns="userColumns"
          :data="userRows"
          show-actions
          @edit="openEditUser"
          @delete="handleDeleteUser"
        />
      </section>
    </main>

    <EntityFormModal
      :is-open="isModalOpen"
      :title="modalTitle"
      :submit-text="modalSubmitText"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleSubmitUser"
    >
      <p
        v-if="formError"
        class="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ formError }}
      </p>

      <div>
        <label for="user-username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="user-username"
          v-model.trim="userForm.username"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="user-email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="user-email"
          v-model.trim="userForm.email"
          type="email"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="user-password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="user-password"
          v-model="userForm.password"
          type="password"
          :required="!selectedUserId"
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="selectedUserId" class="mt-1 text-xs text-gray-500">
          Deja este campo vacío para mantener la contraseña actual.
        </p>
      </div>

      <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          v-model="userForm.isAdmin"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Administrador
      </label>
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
import { useAuthStore } from '../stores/auth.store'
import { useUserStore } from '../stores/user.store'

interface UserRow {
  id: string
  username: string
  email: string
  isAdmin: string
  createdAt: string
}

interface UserFormState {
  username: string
  email: string
  password: string
  isAdmin: boolean
}

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const selectedUserId = ref<string | null>(null)
const pageError = ref('')
const formError = ref('')

const userForm = reactive<UserFormState>({
  username: '',
  email: '',
  password: '',
  isAdmin: false,
})

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const userColumns: ColumnDefinition<UserRow>[] = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'isAdmin', label: 'Admin' },
  { key: 'createdAt', label: 'Created At' },
]

onMounted(() => {
  authStore.loadCurrentUser()
  userStore.fetchUsers()
})

const currentUsername = computed(() => authStore.currentUser?.getUsername() ?? '')

const modalTitle = computed(() => (selectedUserId.value ? 'Editar usuario' : 'Nuevo usuario'))
const modalSubmitText = computed(() => (selectedUserId.value ? 'Actualizar' : 'Crear'))

const userRows = computed<UserRow[]>(() =>
  userStore.users.map((user) => ({
    id: user.getId(),
    username: user.getUsername(),
    email: user.getEmail(),
    isAdmin: user.getIsAdmin() ? 'Sí' : 'No',
    createdAt: dateFormatter.format(user.getCreatedAt()),
  })),
)

const resetForm = () => {
  userForm.username = ''
  userForm.email = ''
  userForm.password = ''
  userForm.isAdmin = false
}

const openCreateUser = () => {
  pageError.value = ''
  formError.value = ''
  selectedUserId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEditUser = (row: UserRow) => {
  const user = userStore.getUserById(row.id)

  if (!user) {
    pageError.value = 'No fue posible encontrar el usuario seleccionado.'
    return
  }

  pageError.value = ''
  formError.value = ''
  selectedUserId.value = user.getId()
  userForm.username = user.getUsername()
  userForm.email = user.getEmail()
  userForm.password = ''
  userForm.isAdmin = user.getIsAdmin()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedUserId.value = null
  formError.value = ''
  resetForm()
}

const handleSubmitUser = () => {
  formError.value = ''
  isSubmitting.value = true

  try {
    const username = userForm.username.trim()
    const email = userForm.email.trim()
    const password = userForm.password

    if (!username || !email) {
      formError.value = 'Username y email son obligatorios.'
      return
    }

    if (!selectedUserId.value && !password) {
      formError.value = 'Password es obligatorio para crear un usuario.'
      return
    }

    if (selectedUserId.value) {
      const updatedUser = userStore.updateUser(selectedUserId.value, {
        username,
        email,
        isAdmin: userForm.isAdmin,
        ...(password ? { password } : {}),
      })

      if (!updatedUser) {
        formError.value = 'No fue posible actualizar el usuario.'
        return
      }
    } else {
      userStore.createUser({
        username,
        email,
        password,
        isAdmin: userForm.isAdmin,
      })
    }

    closeModal()
  } catch (error: unknown) {
    formError.value =
      error instanceof Error ? error.message : 'No fue posible guardar el usuario.'
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteUser = (row: UserRow) => {
  pageError.value = ''

  try {
    const deleted = userStore.deleteUser(row.id)

    if (!deleted) {
      pageError.value = 'No fue posible eliminar el usuario seleccionado.'
    }
  } catch (error: unknown) {
    pageError.value =
      error instanceof Error ? error.message : 'No fue posible eliminar el usuario.'
  }
}

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
