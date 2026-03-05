<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: t('admin.nav') }))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">{{ t('admin.overviewTitle') }}</h1>
    <p class="mt-2 text-muted-foreground">{{ t('admin.overviewBody') }}</p>
  </div>
</template>
