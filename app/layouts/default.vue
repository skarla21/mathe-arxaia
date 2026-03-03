<script setup lang="ts">
import LayoutAppHeader from '~/components/layout/AppHeader.vue'

const theme = useTheme()
const { init: initI18n } = useI18n()

onMounted(() => {
  theme.init()
  initI18n()
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LayoutAppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
