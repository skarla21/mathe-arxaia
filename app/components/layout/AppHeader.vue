<script setup lang="ts">
import { NuxtLink } from "#components";
import LayoutNotesDropdown from "~/components/layout/NotesDropdown.vue";
import SearchGlobalSearch from "~/components/search/GlobalSearch.vue";
import UiButton from "~/components/ui/Button.vue";

const { toggle, colorMode } = useTheme();
const { t } = useI18n();

const logoRef = ref<HTMLElement | null>(null);

function onLogoHover() {
  if (import.meta.client && logoRef.value) {
    const { iconWiggle } = useGsapReveal();
    iconWiggle(logoRef.value);
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-header-border bg-header-bg/95 backdrop-blur-sm shadow-sm transition-colors duration-500"
  >
    <div class="container flex h-16 sm:h-20 items-center gap-4 px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 shrink-0 text-foreground transition-colors group/logo"
        @mouseenter="onLogoHover"
      >
        <span
          ref="logoRef"
          class="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          aria-hidden="true"
        >
          <VIcon name="bi-journal-bookmark-fill" class="size-5" />
        </span>
        <span class="font-heading font-bold text-lg sm:text-xl leading-tight group-hover/logo:text-primary transition-colors">
          {{ t("brand.logo") }}
        </span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
        <NuxtLink
          to="/"
          class="font-heading flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground nav-link-underline transition-colors"
        >
          <VIcon name="bi-house-door" class="size-4" aria-hidden="true" />
          {{ t("nav.main") }}
        </NuxtLink>
        <LayoutNotesDropdown />
        <NuxtLink
          to="/about"
          class="font-heading flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground nav-link-underline transition-colors"
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
