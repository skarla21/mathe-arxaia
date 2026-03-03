<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin - Purchases' })

const purchases = ref<any[]>([])

onMounted(async () => {
  try {
    purchases.value = await $fetch('/api/admin/purchases')
  } catch {
    purchases.value = []
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Purchases</h1>
    <ul class="mt-4 space-y-2">
      <li v-for="p in purchases" :key="p.id" class="p-2 rounded border">User {{ p.user_id }} – Course {{ p.course_id }}</li>
    </ul>
  </div>
</template>
