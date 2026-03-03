<script setup lang="ts">
const route = useRoute()
const courseId = route.params.courseId as string

const course = ref<any>(null)
const lessons = ref<any[]>([])
const purchasing = ref(false)

const { data: courseData } = await useFetch(`/api/courses/${courseId}`)
const { data: lessonsData } = await useFetch(`/api/lessons`, { query: { course_id: courseId } })

course.value = courseData.value as any
lessons.value = (lessonsData.value as any[]) ?? []

async function buyCourse() {
  purchasing.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/stripe/checkout', {
      method: 'POST',
      body: { courseId },
    })
    if (url) window.location.href = url
  } catch (e: any) {
    console.error(e)
    alert(e?.data?.message ?? 'Checkout failed')
  } finally {
    purchasing.value = false
  }
}

useHead({ title: () => (course.value ? course.value.title : 'Course') })
</script>

<template>
  <div class="container py-8 px-4">
    <div v-if="!course" class="text-muted-foreground">Loading...</div>
    <template v-else>
      <h1 class="text-3xl font-bold">{{ course.title }}</h1>
      <p class="mt-2 text-muted-foreground">{{ course.description }}</p>
      <p class="mt-2">
        <span class="font-medium">{{ course.is_free ? 'Free' : `€${((course.price || 0) / 100).toFixed(2)}` }}</span>
      </p>
      <div v-if="!course.is_free" class="mt-4">
        <UiButton :disabled="purchasing" @click="buyCourse">
          {{ purchasing ? 'Redirecting...' : 'Buy Course' }}
        </UiButton>
      </div>
      <h2 class="text-xl font-semibold mt-8">Lessons</h2>
      <ul class="mt-4 space-y-2">
        <li v-for="l in lessons" :key="l.id">
          <NuxtLink :to="`/lesson/${l.id}`" class="text-primary hover:underline">
            {{ l.title }}
          </NuxtLink>
        </li>
      </ul>
      <p v-if="lessons.length === 0" class="text-muted-foreground">No lessons yet.</p>
    </template>
  </div>
</template>
