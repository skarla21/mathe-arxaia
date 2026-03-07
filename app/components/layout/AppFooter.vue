<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="w-full border-t border-border bg-slate-950 dark:bg-slate-950 text-slate-300 dark:text-slate-400">
    <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="font-heading font-semibold text-white mb-4">
            {{ t('footer.brand') }}
          </h3>
          <p class="text-sm text-slate-500 font-heading leading-relaxed max-w-xs">
            {{ t('footer.tagline') }}
          </p>
        </div>
        <div>
          <h3 class="font-heading font-semibold text-white mb-4">
            {{ t('footer.nav') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('nav.main') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('nav.about') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/login" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('nav.login') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-heading font-semibold text-white mb-4">
            {{ t('footer.resources') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/#grades" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('home.section.grades') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#information" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('home.section.information') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#instructions" class="text-sm text-slate-400 hover:text-blue-400 font-heading transition-colors">
                {{ t('home.section.instructions') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-heading font-semibold text-white mb-4">
            {{ t('footer.contact') }}
          </h3>
          <p class="text-sm text-slate-500 font-heading leading-relaxed">
            {{ t('footer.contactText') }}
          </p>
          <NuxtLink
            to="/#communication"
            class="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:underline font-heading"
          >
            {{ t('footer.contactLink') }}
            <VIcon name="bi-arrow-right" class="size-3.5" />
          </NuxtLink>
        </div>
      </div>
      <div class="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-500 font-heading">
          {{ t('footer.copyright') }}
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="text-xs text-slate-500 hover:text-blue-400 font-heading transition-colors">
            {{ t('footer.privacy') }}
          </NuxtLink>
          <NuxtLink to="/#communication" class="text-xs text-slate-500 hover:text-blue-400 font-heading transition-colors">
            {{ t('footer.terms') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
