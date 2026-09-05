<template>
  <main class="min-h-screen bg-neutral-950 text-white">
    <section class="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-8">
      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          <ArrowLeft class="h-4 w-4" />
          Volver a Home
        </RouterLink>

        <div class="mt-10">
          <div class="inline-flex rounded border border-cyan-300/30 bg-cyan-300/10 p-3 text-cyan-300">
            <ShieldCheck class="h-7 w-7" />
          </div>
          <p class="mt-6 text-sm font-semibold uppercase text-cyan-300">Dashboard E-Sports</p>
          <h1 class="mt-3 text-4xl font-bold sm:text-5xl">ProyectoEsports</h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-gray-300">
            Accede al panel competitivo para consultar métricas, rankings, equipos, jugadores y
            partidas registradas.
          </p>
        </div>
      </div>

      <form
        class="rounded-lg border border-white/10 bg-white p-6 text-gray-900 shadow-2xl shadow-black/30"
        @submit.prevent="handleLogin"
      >
        <div class="mb-6">
          <h2 class="text-2xl font-bold">Iniciar sesión</h2>
          <p class="mt-2 text-sm text-gray-600">Ingresa tus credenciales para continuar.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="login-email"
              v-model.trim="email"
              type="email"
              autocomplete="username"
              required
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@correo.com"
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
            />
          </div>

          <p
            v-if="errorMessage"
            class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex w-full items-center justify-center gap-2 rounded bg-cyan-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn class="h-4 w-4" />
            {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, LogIn, ShieldCheck } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    authStore.login({
      email: email.value,
      password: password.value,
    })
    await router.push('/dashboard')
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No fue posible iniciar sesión.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
