<script setup lang="ts">
import { NuxtLink } from '#components'

const { t } = useI18n()

const links = computed(() => [
  { to: '/admin', label: t('admin.overview') },
  { to: '/admin/grades', label: t('admin.grades') },
  { to: '/admin/subjects', label: t('admin.subjects') },
  { to: '/admin/courses', label: t('admin.courses') },
  { to: '/admin/lessons', label: t('admin.lessons') },
  { to: '/admin/uploads', label: t('admin.uploads') },
  { to: '/admin/purchases', label: t('admin.purchases') },
])
</script>

<template>
  <div class="min-h-screen bg-muted/30 flex">
    <aside class="w-56 border-r bg-card shrink-0 flex flex-col">
      <div class="p-4 border-b">
        <NuxtLink to="/admin" class="font-semibold text-lg">{{ t('admin.nav') }}</NuxtLink>
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
          {{ t('admin.backToSite') }}
        </NuxtLink>
      </div>
    </aside>
    <main class="flex-1 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>
