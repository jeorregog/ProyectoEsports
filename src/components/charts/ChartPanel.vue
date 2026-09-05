<template>
  <div class="chart-panel bg-white p-4 rounded-lg shadow border border-gray-100">
    <h3 v-if="title" class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h3>
    <div class="relative h-64 w-full">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
/* global HTMLCanvasElement */
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js'

/**
 * ChartPanel: Envoltura de Vue para Chart.js.
 * No accede a LocalStorage. Los datos (chartData) se pasan como props desde la View.
 */
const props = defineProps<{
  title?: string
  type: keyof ChartTypeRegistry
  chartData: ChartData
  options?: ChartOptions
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = shallowRef<Chart | null>(null)

const renderChart = () => {
  if (!canvasRef.value) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(canvasRef.value, {
    type: props.type,
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options,
    },
  })
}

onMounted(() => {
  renderChart()
})

// Re-renderizar si los datos cambian
watch(
  () => props.chartData,
  () => {
    renderChart()
  },
  { deep: true },
)

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>
