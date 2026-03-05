<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: `${t('admin.nav')} - ${t('admin.subjectsTitle')}` }))

const subjects = ref<any[]>([])

onMounted(async () => {
  try {
    subjects.value = await $fetch('/api/admin/subjects')
  } catch {
    subjects.value = []
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">{{ t('admin.subjectsTitle') }}</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="s in subjects" :key="s.id" class="p-2 rounded border">{{ s.name }} (grade: {{ s.grade_id }})</li>
    </ul>
  </div>
</template>
