<script setup lang="ts">
import UiButton from '~/components/ui/Button.vue'
import UiInput from '~/components/ui/Input.vue'
import UiLabel from '~/components/ui/Label.vue'

definePageMeta({
  // Cast so TS plugin doesn't need to know about every named middleware
  middleware: 'guest-only' as any,
})

const { t } = useI18n()

useHead(() => ({
  title: t('auth.login.title'),
}))

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const onGoogleLogin = () => {
  window.location.href = '/api/auth/signin/google'
}

const onSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await $fetch('/api/auth/callback/credentials', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
      credentials: 'include',
    })

    if ((result as any)?.error) {
      error.value = (result as any).error as string
      return
    }

    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.message ?? t('auth.login.error.generic')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container max-w-sm py-16 px-4">
    <h1 class="text-2xl font-bold">
      {{ t('auth.login.title') }}
    </h1>
    <p class="mt-2 text-muted-foreground text-sm">
      {{ t('auth.login.subtitle') }}
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <UiLabel for="email">{{ t('auth.login.email') }}</UiLabel>
        <UiInput id="email" v-model="email" type="email" required />
      </div>

      <div class="space-y-2">
        <UiLabel for="password">{{ t('auth.login.password') }}</UiLabel>
        <UiInput id="password" v-model="password" type="password" required />
      </div>

      <p v-if="error" class="text-sm text-destructive">
        {{ error }}
      </p>

      <UiButton type="submit" class="w-full" :disabled="loading">
        <span v-if="!loading">
          {{ t('auth.login.submit') }}
        </span>
        <span v-else>
          {{ t('auth.login.submitting') }}
        </span>
      </UiButton>
    </form>

    <div class="mt-4">
      <UiButton type="button" variant="outline" class="w-full" @click="onGoogleLogin">
        {{ t('auth.login.google') }}
      </UiButton>
    </div>

    <NuxtLink to="/" class="mt-4 inline-block text-primary hover:underline">
      ← {{ t('auth.back') }}
    </NuxtLink>
  </div>
</template>
