<template>
  <div class="filter-select flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :value="selectedOptionIndex"
      class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      @change="handleChange"
    >
      <option v-if="showPlaceholder" :value="-1" disabled>{{ placeholder }}</option>
      <option v-for="(option, optionIndex) in options" :key="option.value" :value="optionIndex">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
/* global Event, HTMLSelectElement */
import { computed } from 'vue'

/**
 * FilterSelect: Select genérico compatible con v-model.
 */
export interface SelectOption {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectedOptionIndex = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue),
)

const showPlaceholder = computed(
  () => Boolean(props.placeholder) && selectedOptionIndex.value === -1,
)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const optionIndex = target.selectedIndex - (showPlaceholder.value ? 1 : 0)
  const selectedOption = props.options[optionIndex]

  if (!selectedOption) {
    return
  }

  emit('update:modelValue', selectedOption.value)
}
</script>
