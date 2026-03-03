<script setup lang="ts">
import LessonPdfViewer from '~/components/lesson/PdfViewer.vue'

const route = useRoute()
const lessonId = route.params.lessonId as string

const lesson = ref<any>(null)
const canAccess = ref(false)

const { data } = await useFetch(`/api/lessons/${lessonId}`)
lesson.value = data.value as any
canAccess.value = (data.value as any)?.can_access ?? false

useHead({ title: () => (lesson.value ? lesson.value.title : 'Lesson') })
</script>

<template>
  <div class="container py-8 px-4">
    <div v-if="!lesson" class="text-muted-foreground">Loading...</div>
    <template v-else>
      <h1 class="text-3xl font-bold">{{ lesson.title }}</h1>
      <div v-if="lesson.content" class="mt-4 prose dark:prose-invert max-w-none" v-html="lesson.content" />
      <div v-if="canAccess && lesson.pdf_url" class="mt-8">
        <LessonPdfViewer :src="lesson.pdf_url" />
      </div>
      <p v-else-if="lesson.pdf_url && !canAccess" class="mt-4 text-muted-foreground">
        Purchase the course to view the PDF.
      </p>
    </template>
  </div>
</template>
