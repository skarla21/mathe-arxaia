<script setup lang="ts">
const route = useRoute()
const courseId = route.params.courseId as string
const { t } = useI18n()

const course = ref<any>(null)
const lessons = ref<any[]>([])
const purchasing = ref(false)
const checkoutError = ref<string | null>(null)

const { data: courseData } = await useFetch(`/api/courses/${courseId}`)
const { data: lessonsData } = await useFetch(`/api/lessons`, { query: { course_id: courseId } })

course.value = courseData.value as any
lessons.value = (lessonsData.value as any[]) ?? []

async function buyCourse() {
  checkoutError.value = null
  purchasing.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/stripe/checkout', {
      method: 'POST',
      body: { courseId },
    })
    if (url) window.location.href = url
  } catch (e: any) {
    console.error(e)
    checkoutError.value = e?.data?.message ?? t('course.checkoutError')
  } finally {
    purchasing.value = false
  }
}

useHead(() => ({ title: course.value ? course.value.title : t('course.title') }))
</script>

<template>
  <div class="container py-8 px-4">
    <div v-if="!course" class="text-muted-foreground">{{ t('common.loading') }}</div>
    <template v-else>
      <h1 class="text-3xl font-bold">{{ course.title }}</h1>
      <p class="mt-2 text-muted-foreground">{{ course.description }}</p>
      <p class="mt-2">
        <span class="font-medium">{{ course.is_free ? t('course.free') : `€${((course.price || 0) / 100).toFixed(2)}` }}</span>
      </p>
      <div v-if="!course.is_free" class="mt-4">
        <UiButton :disabled="purchasing" @click="buyCourse">
          {{ purchasing ? t('course.redirecting') : t('course.buy') }}
        </UiButton>
        <p v-if="checkoutError" class="mt-2 text-destructive text-sm">{{ checkoutError }}</p>
      </div>
      <h2 class="text-xl font-semibold mt-8">{{ t('course.lessons') }}</h2>
      <ul class="mt-4 space-y-2">
        <li v-for="l in lessons" :key="l.id">
          <NuxtLink :to="`/lesson/${l.id}`" class="text-primary hover:underline">
            {{ l.title }}
          </NuxtLink>
        </li>
      </ul>
      <p v-if="lessons.length === 0" class="text-muted-foreground">{{ t('course.noLessonsYet') }}</p>
    </template>
  </div>
</template>
