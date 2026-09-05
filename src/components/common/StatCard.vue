<template>
  <div
    class="stat-card bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center justify-between"
  >
    <div>
      <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
      <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
    </div>
    <!-- Slot opcional para inyectar un icono de lucide-vue-next desde la View -->
    <div v-if="$slots.icon" class="icon-container text-blue-500">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * StatCard: Tarjeta de métricas genérica.
 */
defineProps<{
  title: string
  value: string | number
}>()
</script>
