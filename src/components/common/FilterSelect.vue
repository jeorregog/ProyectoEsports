<template>
  <div class="filter-select flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :value="modelValue"
      class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      @change="handleChange"
    >
      <option value="" disabled>{{ placeholder || 'Seleccione una opción...' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
/* global Event, HTMLSelectElement */

/**
 * FilterSelect: Select genérico compatible con v-model.
 */
export interface SelectOption {
  label: string
  value: string | number
}

defineProps<{
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
