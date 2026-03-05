<script setup lang="ts">
import { NuxtLink } from "#components";

interface Grade {
  id: string;
  name: string;
  order: number;
}

interface Subject {
  id: string;
  name: string;
  grade_id: string;
}

const grades = ref<Grade[]>([]);
const subjects = ref<Subject[]>([]);
const open = ref(false);
const { t } = useI18n();

async function load() {
  try {
    const [gRes, sRes] = await Promise.all([
      $fetch<Grade[]>("/api/grades"),
      $fetch<Subject[]>("/api/subjects"),
    ]);
    grades.value = (gRes || []).sort((a, b) => a.order - b.order);
    subjects.value = sRes || [];
  } catch {
    grades.value = [];
    subjects.value = [];
  }
}

function subjectsForGrade(gradeId: string) {
  return subjects.value.filter((s) => s.grade_id === gradeId);
}

function gradeSlug(grade: Grade) {
  return grade.id;
}

onMounted(load);
</script>

<template>
  <div class="relative" @mouseenter="open = true" @mouseleave="open = false">
    <button
      type="button"
      class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
    >
      <VIcon name="bi-journal-text" class="size-4" aria-hidden="true" />
      {{ t("nav.notes") }}
      <VIcon name="bi-chevron-down" class="size-3.5 text-muted-foreground" aria-hidden="true" />
    </button>
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="absolute top-full left-0 mt-1 w-56 rounded-md border bg-card py-2 shadow-lg"
      >
        <template v-for="grade in grades" :key="grade.id">
          <div
            class="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {{ grade.name }}
          </div>
          <NuxtLink
            v-for="subj in subjectsForGrade(grade.id)"
            :key="subj.id"
            :to="`/grade/${gradeSlug(grade)}/${subj.id}`"
            class="block px-4 py-2 text-sm hover:bg-accent"
          >
            {{ subj.name }}
          </NuxtLink>
        </template>
        <p
          v-if="grades.length === 0"
          class="px-4 py-2 text-sm text-muted-foreground"
        >
          {{ t("notes.empty") }}
        </p>
      </div>
    </Transition>
  </div>
</template>
