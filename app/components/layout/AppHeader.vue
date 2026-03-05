<script setup lang="ts">
import { NuxtLink } from "#components";
import LayoutNotesDropdown from "~/components/layout/NotesDropdown.vue";
import SearchGlobalSearch from "~/components/search/GlobalSearch.vue";
import UiButton from "~/components/ui/Button.vue";

const { toggle, colorMode } = useTheme();
const { t } = useI18n();
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 items-center gap-4 px-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold shrink-0 text-foreground hover:opacity-90 transition-opacity">
        <VIcon name="bi-journal-bookmark-fill" class="size-6 text-primary" aria-hidden="true" />
        <span>{{ t("brand.logo") }}</span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-6 flex-1 justify-center">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
        >
          <VIcon name="bi-house-door" class="size-4" aria-hidden="true" />
          {{ t("nav.main") }}
        </NuxtLink>
        <LayoutNotesDropdown />
        <NuxtLink
          to="/about"
          class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
        >
          <VIcon name="bi-info-circle" class="size-4" aria-hidden="true" />
          {{ t("nav.about") }}
        </NuxtLink>
      </nav>
      <div class="flex items-center gap-2 shrink-0">
        <SearchGlobalSearch class="w-48 lg:w-64" />
        <UiButton variant="ghost" size="icon" @click="toggle">
          <Transition name="theme-icon" mode="out-in">
            <VIcon
              v-if="colorMode === 'light'"
              key="sun"
              name="bi-sun-fill"
              class="text-yellow-500"
            />
            <VIcon
              v-else
              key="moon"
              name="bi-moon-fill"
              class="text-blue-400"
            />
          </Transition>
        </UiButton>
        <NuxtLink to="/login">
          <UiButton variant="outline" size="sm">
            {{ t("nav.login") }}
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 0.2s ease;
}
.theme-icon-enter-from,
.theme-icon-leave-to {
  opacity: 0;
}
</style>
