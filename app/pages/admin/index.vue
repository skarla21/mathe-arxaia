<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Admin Overview</h1>
    <p class="mt-2 text-muted-foreground">Manage grades, subjects, courses, lessons, and view purchases.</p>
  </div>
</template>
