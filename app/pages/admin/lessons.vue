<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin - Lessons' })

const lessons = ref<any[]>([])

onMounted(async () => {
  try {
    lessons.value = await $fetch('/api/admin/lessons')
  } catch {
    lessons.value = []
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Lessons</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="l in lessons" :key="l.id" class="p-2 rounded border">{{ l.title }}</li>
    </ul>
  </div>
</template>
