<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import UiButton from '~/components/ui/Button.vue'
import UiCard from '~/components/ui/Card.vue'
import UiCardHeader from '~/components/ui/CardHeader.vue'
import UiCardTitle from '~/components/ui/CardTitle.vue'
import UiCardContent from '~/components/ui/CardContent.vue'

const { t } = useI18n()

const sections = computed(() => [
  { id: 'welcome', label: t('home.section.welcome') },
  { id: 'information', label: t('home.section.information') },
  { id: 'grades', label: t('home.section.grades') },
  { id: 'instructions', label: t('home.section.instructions') },
  { id: 'more', label: t('home.section.more') },
  { id: 'communication', label: t('home.section.communication') },
])

const grades = ref<{ id: string; name: string; order: number }[]>([])

function scrollTo(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  try {
    const data = await $fetch<typeof grades.value>('/api/grades')
    grades.value = data ?? []
  } catch {
    grades.value = []
  }
  if (import.meta.client) {
    const { revealSection } = useGsapReveal()
    nextTick(() => {
      sections.value.forEach((s) => revealSection(`#${s.id}`))
    })
  }
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-3.5rem)]">
    <nav class="w-48 border-r p-4 shrink-0 hidden lg:block">
      <ul class="space-y-1">
        <li v-for="s in sections" :key="s.id">
          <button
            type="button"
            class="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent"
            @click="scrollTo(s.id)"
          >
            {{ s.label }}
          </button>
        </li>
      </ul>
    </nav>
    <div class="flex-1 overflow-auto">
      <section id="welcome" class="container py-16 px-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('home.welcome.title') }}
        </h1>
        <p class="mt-4 text-muted-foreground text-lg">
          {{ t('home.welcome.lead') }}
        </p>
      </section>
      <section id="information" class="container py-16 px-4 border-t">
        <h2 class="text-2xl font-semibold">
          {{ t('home.info.title') }}
        </h2>
        <p class="mt-4 text-muted-foreground">
          {{ t('home.info.body') }}
        </p>
      </section>
      <section id="grades" class="container py-16 px-4 border-t">
        <h2 class="text-2xl font-semibold mb-6">
          {{ t('home.grades.title') }}
        </h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="g in grades"
            :key="g.id"
            :to="`/grade/${g.id}`"
            class="block"
          >
            <UiCard class="hover:border-primary/50 transition-colors">
              <UiCardHeader>
                <UiCardTitle>{{ g.name }}</UiCardTitle>
              </UiCardHeader>
              <UiCardContent>
                <p class="text-sm text-muted-foreground">
                  {{ t('home.grades.cardHint') }}
                </p>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
        <p v-if="grades.length === 0" class="text-muted-foreground">
          {{ t('home.grades.empty') }}
        </p>
      </section>
      <section id="instructions" class="container py-16 px-4 border-t">
        <h2 class="text-2xl font-semibold">
          {{ t('home.instructions.title') }}
        </h2>
        <p class="mt-4 text-muted-foreground">
          {{ t('home.instructions.body') }}
        </p>
      </section>
      <section id="more" class="container py-16 px-4 border-t">
        <h2 class="text-2xl font-semibold">
          {{ t('home.more.title') }}
        </h2>
        <p class="mt-4 text-muted-foreground">
          {{ t('home.more.body') }}
        </p>
      </section>
      <section id="communication" class="container py-16 px-4 border-t">
        <h2 class="text-2xl font-semibold">
          {{ t('home.communication.title') }}
        </h2>
        <p class="mt-4 text-muted-foreground mb-6">
          {{ t('home.communication.lead') }}
        </p>
        <form
          action="https://formsubmit.co/your-email@example.com"
          method="POST"
          class="max-w-md space-y-4"
        >
          <input type="hidden" name="_subject" value="Contact from Mathe-Arxaia">
          <input type="hidden" name="_captcha" value="false">
          <div>
            <label class="block text-sm font-medium mb-1">
              {{ t('home.communication.emailLabel') }}
            </label>
            <input
              type="email"
              name="email"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">
              {{ t('home.communication.messageLabel') }}
            </label>
            <textarea
              name="message"
              rows="4"
              required
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <UiButton type="submit">
            {{ t('home.communication.submit') }}
          </UiButton>
        </form>
      </section>
    </div>
  </div>
</template>

