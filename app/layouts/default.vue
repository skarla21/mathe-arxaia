<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster, toast } from 'vue-sonner'
import LayoutAppHeader from '~/components/layout/AppHeader.vue'
import LayoutAppFooter from '~/components/layout/AppFooter.vue'

const theme = useTheme()
const { init: initI18n, t } = useI18n()
const route = useRoute()

onMounted(() => {
  theme.init()
  initI18n()
})

watch(
  () => route.query.toast,
  (value) => {
    if (value === 'registered') {
      toast.success(t('auth.register.success'))
      navigateTo({ path: '/', query: {} }, { replace: true })
    } else if (value === 'login') {
      toast.success(t('auth.login.success'))
      navigateTo({ path: '/', query: {} }, { replace: true })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-background text-foreground">
    <Toaster />
    <LayoutAppHeader />
    <main class="flex-1 min-h-0 min-w-0 overflow-auto w-full flex flex-col">
      <div class="flex-1 min-h-0 flex flex-col">
        <slot />
      </div>
      <LayoutAppFooter v-if="route.path !== '/'" />
    </main>
  </div>
</template>
