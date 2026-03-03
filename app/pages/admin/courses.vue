<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin - Courses' })

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
    <h1 class="text-2xl font-bold">Courses</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="c in courses" :key="c.id" class="p-2 rounded border">{{ c.title }} ({{ c.is_free ? 'Free' : 'Paid' }})</li>
    </ul>
  </div>
</template>
