<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: `${t('admin.nav')} - ${t('admin.coursesTitle')}` }))

const courses = ref<any[]>([])

onMounted(async () => {
  try {
    courses.value = await $fetch('/api/admin/courses')
  } catch {
    courses.value = []
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">{{ t('admin.coursesTitle') }}</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="c in courses" :key="c.id" class="p-2 rounded border">{{ c.title }} ({{ c.is_free ? t('course.free') : t('admin.paid') }})</li>
    </ul>
  </div>
</template>
