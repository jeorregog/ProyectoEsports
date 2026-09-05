<template>
  <div class="data-table-container overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
          >
            {{ col.label }}
          </th>
          <th
            v-if="showActions"
            class="px-4 py-2 text-right text-sm font-semibold text-gray-700 border-b"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0">
          <td
            :colspan="showActions ? columns.length + 1 : columns.length"
            class="px-4 py-4 text-center text-gray-500"
          >
            No hay datos disponibles.
          </td>
        </tr>
        <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-2 text-sm text-gray-600 border-b"
          >
            {{ item[col.key] }}
          </td>
          <td v-if="showActions" class="px-4 py-2 text-right border-b">
            <button class="text-blue-600 hover:text-blue-800 mr-2" @click="$emit('edit', item)">
              Editar
            </button>
            <button class="text-red-600 hover:text-red-800" @click="$emit('delete', item)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
/**
 * DataTable: Tabla genérica reutilizable.
 * Usamos el generic T para mantener el tipado estricto sin usar `any`.
 */
export interface ColumnDefinition<T extends object> {
  key: keyof T
  label: string
}

defineProps<{
  columns: ColumnDefinition<T>[]
  data: T[]
  showActions?: boolean
}>()

defineEmits<{
  (e: 'edit', item: T): void
  (e: 'delete', item: T): void
}>()
</script>
