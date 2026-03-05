<script setup lang="ts">
import { NuxtLink } from '#components'
import UiDropdownMenu from '~/components/ui/dropdown-menu/DropdownMenu.vue'
import UiDropdownMenuTrigger from '~/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import UiDropdownMenuContent from '~/components/ui/dropdown-menu/DropdownMenuContent.vue'
import UiDropdownMenuLabel from '~/components/ui/dropdown-menu/DropdownMenuLabel.vue'
import UiDropdownMenuItem from '~/components/ui/dropdown-menu/DropdownMenuItem.vue'

interface Grade {
  id: string
  name: string
  order: number
}

interface Subject {
  id: string
  name: string
  grade_id: string
}

const grades = ref<Grade[]>([])
const subjects = ref<Subject[]>([])
const { t } = useI18n()

async function load() {
  try {
    const [gRes, sRes] = await Promise.all([
      $fetch<Grade[]>('/api/grades'),
      $fetch<Subject[]>('/api/subjects'),
    ])
    grades.value = (gRes || []).sort((a, b) => a.order - b.order)
    subjects.value = sRes || []
  } catch {
    grades.value = []
    subjects.value = []
  }
}

function subjectsForGrade(gradeId: string) {
  return subjects.value.filter((s) => s.grade_id === gradeId)
}

function gradeSlug(grade: Grade) {
  return grade.id
}

onMounted(load)
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger class="cursor-pointer">
      <VIcon name="bi-journal-text" class="size-4" aria-hidden="true" />
      {{ t('nav.notes') }}
      <VIcon name="bi-chevron-down" class="size-3.5 text-muted-foreground" aria-hidden="true" />
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent class="w-56 py-2">
      <template v-for="grade in grades" :key="grade.id">
        <UiDropdownMenuLabel>{{ grade.name }}</UiDropdownMenuLabel>
        <UiDropdownMenuItem v-for="subj in subjectsForGrade(grade.id)" :key="subj.id">
          <NuxtLink :to="`/grade/${gradeSlug(grade)}/${subj.id}`">
            {{ subj.name }}
          </NuxtLink>
        </UiDropdownMenuItem>
      </template>
      <p
        v-if="grades.length === 0"
        class="px-4 py-2 text-sm text-muted-foreground"
      >
        {{ t('notes.empty') }}
      </p>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
