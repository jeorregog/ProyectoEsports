<template>
  <nav class="app-navbar flex justify-between items-center p-4 bg-gray-800 text-white">
    <div class="navbar-brand text-xl font-bold">E-Sports Dashboard</div>
    <div v-if="isAuthenticated" class="navbar-actions flex gap-4 items-center">
      <span class="user-greeting">Hola, {{ username }}</span>
      <button
        class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
        @click="$emit('logout')"
      >
        Cerrar Sesión
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * AppNavbar: Componente de presentación puro.
 * Recibe el estado de autenticación y el nombre de usuario.
 */
defineProps<{
  isAuthenticated: boolean
  username?: string
}>()

defineEmits<{
  (e: 'logout'): void
}>()
</script>
