<script setup lang="ts">
import UiCard from '~/components/ui/Card.vue'
import UiCardContent from '~/components/ui/CardContent.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useI18n()
useHead(() => ({ title: `${t('admin.nav')} - ${t('admin.gradesTitle')}` }))

const grades = ref<any[]>([])
const loading = ref(true)

async function fetchGrades() {
  loading.value = true
  try {
    grades.value = await $fetch('/api/admin/grades')
  } catch {
    grades.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchGrades)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">{{ t('admin.gradesTitle') }}</h1>
    <p v-if="loading" class="mt-4 text-muted-foreground">{{ t('admin.gradesLoading') }}</p>
    <ul v-else class="mt-4 space-y-2 list-none p-0">
      <li v-for="g in grades" :key="g.id">
        <UiCard>
          <UiCardContent class="flex items-center gap-4 py-3">
            {{ g.name }} (order: {{ g.order }})
          </UiCardContent>
        </UiCard>
      </li>
    </ul>
    <p v-if="!loading && grades.length === 0" class="mt-4 text-muted-foreground">{{ t('admin.gradesEmpty') }}</p>
  </div>
</template>
