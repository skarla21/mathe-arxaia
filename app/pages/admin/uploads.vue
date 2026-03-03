<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin - Uploads' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Uploads</h1>
    <p class="mt-2 text-muted-foreground">Upload PDFs to Supabase Storage and attach to lessons.</p>
  </div>
</template>
