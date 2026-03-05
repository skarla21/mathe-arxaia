<script setup lang="ts">
import UiCard from '~/components/ui/Card.vue'
import UiCardContent from '~/components/ui/CardContent.vue'

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
    <ul class="mt-4 space-y-2 list-none p-0">
      <li v-for="c in courses" :key="c.id">
        <UiCard>
          <UiCardContent class="py-3">
            {{ c.title }} ({{ c.is_free ? t('course.free') : t('admin.paid') }})
          </UiCardContent>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
