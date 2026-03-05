<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: `${t('admin.nav')} - ${t('admin.purchasesTitle')}` }))

const purchases = ref<any[]>([])

onMounted(async () => {
  try {
    purchases.value = await $fetch('/api/admin/purchases')
  } catch {
    purchases.value = []
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">{{ t('admin.purchasesTitle') }}</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="p in purchases" :key="p.id" class="p-2 rounded border">{{ t('admin.purchaseLine', { userId: p.user_id, courseId: p.course_id }) }}</li>
    </ul>
  </div>
</template>
