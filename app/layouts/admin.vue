<script setup lang="ts">
import { NuxtLink } from '#components'

const links = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/grades', label: 'Grades' },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/lessons', label: 'Lessons' },
  { to: '/admin/uploads', label: 'Uploads' },
  { to: '/admin/purchases', label: 'Purchases' },
]
</script>

<template>
  <div class="min-h-screen bg-muted/30 flex">
    <aside class="w-56 border-r bg-card shrink-0 flex flex-col">
      <div class="p-4 border-b">
        <NuxtLink to="/admin" class="font-semibold text-lg">Admin</NuxtLink>
      </div>
      <nav class="p-2 flex-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 rounded-md text-sm hover:bg-accent"
          active-class="bg-accent font-medium"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="p-2 border-t">
        <NuxtLink to="/" class="block px-3 py-2 rounded-md text-sm hover:bg-accent">
          Back to site
        </NuxtLink>
      </div>
    </aside>
    <main class="flex-1 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>
