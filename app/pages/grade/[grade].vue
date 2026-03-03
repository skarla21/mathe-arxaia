<script setup lang="ts">
const route = useRoute()
const gradeId = route.params.grade as string

const grade = ref<{ id: string; name: string; order: number } | null>(null)
const subjects = ref<{ id: string; name: string; grade_id: string }[]>([])
const courses = ref<{ id: string; title: string; subject_id: string; is_free: boolean; price: number }[]>([])

const { data: gradeData } = await useFetch(`/api/grades`)
const gradeFromList = computed(() => (gradeData.value as any[])?.find((g: any) => g.id === gradeId))

// Fetch subjects for this grade
const { data: subjectsData } = await useFetch('/api/subjects', { query: { grade_id: gradeId } })
subjects.value = (subjectsData.value as any[]) ?? []
grade.value = gradeFromList.value ?? null

// Fetch all courses for this grade
const { data: coursesData } = await useFetch('/api/courses', { query: { grade_id: gradeId } })
courses.value = (coursesData.value as any[]) ?? []

function coursesForSubject(subjectId: string) {
  return courses.value.filter((c) => c.subject_id === subjectId)
}

useHead({ title: () => (grade.value ? `${grade.value.name} - Grades` : 'Grade') })
</script>

<template>
  <div class="container py-8 px-4">
    <h1 class="text-3xl font-bold">{{ grade?.name ?? 'Grade' }}</h1>
    <p class="mt-2 text-muted-foreground">Subjects and courses</p>
    <div class="mt-8 space-y-8">
      <section v-for="subj in subjects" :key="subj.id">
        <h2 class="text-xl font-semibold mb-4">{{ subj.name }}</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtLink
            v-for="c in coursesForSubject(subj.id)"
            :key="c.id"
            :to="`/course/${c.id}`"
            class="block p-4 rounded-lg border bg-card hover:border-primary/50"
          >
            <span class="font-medium">{{ c.title }}</span>
            <span class="text-muted-foreground text-sm ml-2">{{ c.is_free ? 'Free' : `€${(c.price / 100).toFixed(2)}` }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
    <p v-if="subjects.length === 0" class="text-muted-foreground">No subjects for this grade yet.</p>
  </div>
</template>
