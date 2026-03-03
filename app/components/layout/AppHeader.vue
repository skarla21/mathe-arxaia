<script setup lang="ts">
import { NuxtLink } from "#components";
import LayoutNotesDropdown from "~/components/layout/NotesDropdown.vue";
import SearchGlobalSearch from "~/components/search/GlobalSearch.vue";
import UiButton from "~/components/ui/Button.vue";

const { toggle } = useTheme();
const { t } = useI18n();
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 items-center gap-4 px-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold shrink-0">
        <span>{{ t("brand.logo") }}</span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-6 flex-1 justify-center">
        <NuxtLink
          to="/"
          class="text-sm font-medium hover:underline underline-offset-4"
        >
          {{ t("nav.main") }}
        </NuxtLink>
        <LayoutNotesDropdown />
        <NuxtLink
          to="/about"
          class="text-sm font-medium hover:underline underline-offset-4"
        >
          {{ t("nav.about") }}
        </NuxtLink>
      </nav>
      <div class="flex items-center gap-2 shrink-0">
        <SearchGlobalSearch class="w-48 lg:w-64" />
        <UiButton variant="ghost" size="icon" @click="toggle">
          <VIcon
            name="bi-sun-fill"
            class="dark:hidden text-yellow-500"
          />
          <VIcon
            name="bi-moon-fill"
            class="hidden dark:inline text-blue-400"
          />
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
