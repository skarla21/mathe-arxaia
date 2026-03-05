<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import UiButton from "~/components/ui/Button.vue";
import UiCard from "~/components/ui/Card.vue";
import UiCardHeader from "~/components/ui/CardHeader.vue";
import UiCardTitle from "~/components/ui/CardTitle.vue";
import UiCardContent from "~/components/ui/CardContent.vue";
import UiInput from "~/components/ui/Input.vue";
import UiTextarea from "~/components/ui/Textarea.vue";
import UiLabel from "~/components/ui/Label.vue";

const { t } = useI18n();

const sectionConfig = [
  { id: "welcome", labelKey: "home.section.welcome", icon: "bi-stars" },
  { id: "information", labelKey: "home.section.information", icon: "bi-info-circle" },
  { id: "grades", labelKey: "home.section.grades", icon: "bi-mortarboard" },
  { id: "instructions", labelKey: "home.section.instructions", icon: "bi-list-check" },
  { id: "more", labelKey: "home.section.more", icon: "bi-gem" },
  { id: "communication", labelKey: "home.section.communication", icon: "bi-chat-dots" },
];

const sections = computed(() =>
  sectionConfig.map((s) => ({ id: s.id, label: t(s.labelKey), icon: s.icon }))
);

const grades = ref<{ id: string; name: string; order: number }[]>([]);
const activeSection = ref<string>("welcome");
const scrollContainerRef = ref<HTMLElement | null>(null);

function scrollTo(id: string) {
  const container = scrollContainerRef.value;
  const el = document.getElementById(id);
  if (!container || !el) return;
  const targetTop = el.offsetTop;
  container.scrollTo({ top: targetTop, behavior: "smooth" });
}

onMounted(async () => {
  try {
    const data = await $fetch<typeof grades.value>("/api/grades");
    grades.value = data ?? [];
  } catch {
    grades.value = [];
  }
  if (import.meta.client) {
    const { revealSection, revealStagger, animateHero, iconWiggle } = useGsapReveal();
    nextTick(() => {
      sections.value.forEach((s) => revealSection(`#${s.id}`));
      const gradesGrid = document.querySelector("#grades-grid");
      if (gradesGrid && grades.value.length > 0) {
        revealStagger("#grades-grid", "a");
      }
      animateHero("#hero-title", "#hero-lead", "#hero-cta");
    });

    nextTick(() => {
      const container = scrollContainerRef.value;
      if (!container) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries.filter((e) => e.isIntersecting);
          if (intersecting.length === 0) return;
          const topmost = intersecting.reduce((a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top <
            (b.target as HTMLElement).getBoundingClientRect().top
              ? a
              : b
          );
          activeSection.value = topmost.target.id;
        },
        { root: container, rootMargin: "-15% 0px -60% 0px", threshold: 0 }
      );
      sections.value.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });
    });

    const route = useRoute();
    nextTick(() => {
      if (route.path === "/" && (route.hash === "#welcome" || !route.hash)) {
        scrollTo("welcome");
      }
    });
  }
});

function onNavClick(id: string, ev: MouseEvent) {
  const btn = (ev.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-icon]");
  if (btn && import.meta.client) {
    const { iconWiggle } = useGsapReveal();
    iconWiggle(btn);
  }
  scrollTo(id);
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)]">
    <nav
      class="sticky top-14 self-start w-52 border-r border-border/50 p-4 shrink-0 hidden lg:block bg-background"
    >
      <ul class="space-y-1">
        <li v-for="s in sections" :key="s.id">
          <UiButton
            type="button"
            variant="ghost"
            :class="[
              'w-full justify-start px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              activeSection === s.id
                ? 'bg-accent font-medium border-l-2 border-l-primary pl-[10px] -ml-px'
                : 'hover:bg-accent/70 border-l-2 border-l-transparent',
            ]"
            @click="onNavClick(s.id, $event)"
          >
            <VIcon :name="s.icon" class="size-4 shrink-0 text-primary" data-icon aria-hidden="true" />
            {{ s.label }}
          </UiButton>
        </li>
      </ul>
    </nav>
    <div ref="scrollContainerRef" class="flex-1 overflow-auto">
      <section
        id="welcome"
        class="container max-w-5xl py-24 px-4 md:px-6 bg-linear-to-b from-muted/40 to-transparent border-b border-border/50"
      >
        <h1
          id="hero-title"
          class="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
        >
          {{ t("home.welcome.title") }}
        </h1>
        <p
          id="hero-lead"
          class="mt-5 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          {{ t("home.welcome.lead") }}
        </p>
        <div id="hero-cta" class="mt-8">
          <UiButton variant="secondary" size="lg" class="rounded-xl" @click="scrollTo('grades')">
            <VIcon name="bi-mortarboard" class="size-4" aria-hidden="true" />
            {{ t("home.welcome.cta") }}
          </UiButton>
        </div>
      </section>

      <section id="information" class="container max-w-5xl py-20 px-4 md:px-6 border-b border-border/50">
        <h2 class="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
          <VIcon name="bi-info-circle" class="size-7 text-primary" aria-hidden="true" />
          {{ t("home.info.title") }}
        </h2>
        <p class="mt-3 text-muted-foreground max-w-2xl">
          {{ t("home.info.body") }}
        </p>
        <ul class="mt-6 space-y-4 max-w-2xl">
          <li class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <VIcon name="bi-check2-circle" class="size-5" />
            </span>
            <span class="text-muted-foreground leading-relaxed">{{ t("home.info.bullet1") }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <VIcon name="bi-check2-circle" class="size-5" />
            </span>
            <span class="text-muted-foreground leading-relaxed">{{ t("home.info.bullet2") }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <VIcon name="bi-check2-circle" class="size-5" />
            </span>
            <span class="text-muted-foreground leading-relaxed">{{ t("home.info.bullet3") }}</span>
          </li>
        </ul>
      </section>

      <section id="grades" class="container max-w-5xl py-20 px-4 md:px-6 border-b border-border/50">
        <h2 class="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground mb-6">
          <VIcon name="bi-mortarboard" class="size-7 text-primary" aria-hidden="true" />
          {{ t("home.grades.title") }}
        </h2>
        <div id="grades-grid" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="g in grades"
            :key="g.id"
            :to="`/grade/${g.id}`"
            class="block group"
          >
            <UiCard
              class="rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02] border-border/80"
            >
              <UiCardHeader class="flex flex-row items-center gap-3">
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <VIcon name="bi-journal-bookmark" class="size-5" />
                </span>
                <UiCardTitle class="text-lg">{{ g.name }}</UiCardTitle>
              </UiCardHeader>
              <UiCardContent>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ t("home.grades.cardHint") }}
                </p>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
        <div v-if="grades.length === 0" class="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center max-w-md">
          <VIcon name="bi-inbox" class="size-10 mx-auto text-muted-foreground/70" aria-hidden="true" />
          <p class="mt-3 text-muted-foreground">
            {{ t("home.grades.empty") }}
          </p>
          <p class="mt-1 text-sm text-muted-foreground/80">
            {{ t("home.grades.emptyHint") }}
          </p>
        </div>
      </section>

      <section id="instructions" class="container max-w-5xl py-20 px-4 md:px-6 border-b border-border/50">
        <h2 class="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
          <VIcon name="bi-list-check" class="size-7 text-primary" aria-hidden="true" />
          {{ t("home.instructions.title") }}
        </h2>
        <p class="mt-3 text-muted-foreground max-w-2xl">
          {{ t("home.instructions.body") }}
        </p>
        <ol class="mt-6 space-y-4 max-w-2xl list-none">
          <li class="flex items-start gap-3">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-semibold text-sm"
              aria-hidden="true"
            >
              1
            </span>
            <span class="text-muted-foreground leading-relaxed pt-0.5">{{ t("home.instructions.step1") }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-semibold text-sm"
              aria-hidden="true"
            >
              2
            </span>
            <span class="text-muted-foreground leading-relaxed pt-0.5">{{ t("home.instructions.step2") }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-semibold text-sm"
              aria-hidden="true"
            >
              3
            </span>
            <span class="text-muted-foreground leading-relaxed pt-0.5">{{ t("home.instructions.step3") }}</span>
          </li>
        </ol>
      </section>

      <section id="more" class="container max-w-5xl py-20 px-4 md:px-6 border-b border-border/50">
        <h2 class="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
          <VIcon name="bi-gem" class="size-7 text-primary" aria-hidden="true" />
          {{ t("home.more.title") }}
        </h2>
        <p class="mt-3 text-muted-foreground max-w-2xl">
          {{ t("home.more.body") }}
        </p>
        <ul class="mt-6 space-y-4 max-w-2xl">
          <li class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <VIcon name="bi-plus-circle" class="size-5" />
            </span>
            <span class="text-muted-foreground leading-relaxed">{{ t("home.more.bullet1") }}</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              <VIcon name="bi-plus-circle" class="size-5" />
            </span>
            <span class="text-muted-foreground leading-relaxed">{{ t("home.more.bullet2") }}</span>
          </li>
        </ul>
      </section>

      <section id="communication" class="container max-w-5xl py-20 px-4 md:px-6">
        <h2 class="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
          <VIcon name="bi-chat-dots" class="size-7 text-primary" aria-hidden="true" />
          {{ t("home.communication.title") }}
        </h2>
        <p class="mt-3 text-muted-foreground mb-6 max-w-2xl">
          {{ t("home.communication.lead") }}
        </p>
        <form
          action="https://formsubmit.co/antwnis_skarlatos@yahoo.com"
          method="POST"
          class="max-w-md space-y-4"
        >
          <input type="hidden" name="_subject" :value="t('home.communication.emailSubject')" />
          <input type="text" name="_honey" style="display: none" />
          <div>
            <UiLabel class="flex items-center gap-2 mb-1.5">
              <VIcon name="bi-envelope" class="size-4 text-muted-foreground" aria-hidden="true" />
              {{ t("home.communication.emailLabel") }}
            </UiLabel>
            <UiInput
              type="email"
              name="_replyto"
              required
              class="rounded-xl"
            />
          </div>
          <div>
            <UiLabel class="flex items-center gap-2 mb-1.5">
              <VIcon name="bi-chat-text" class="size-4 text-muted-foreground" aria-hidden="true" />
              {{ t("home.communication.messageLabel") }}
            </UiLabel>
            <UiTextarea name="message" :rows="4" required />
          </div>
          <UiButton type="submit" class="rounded-xl">
            {{ t("home.communication.submit") }}
          </UiButton>
          <p class="text-sm text-muted-foreground">
            {{ t("home.communication.note") }}
          </p>
        </form>
      </section>
    </div>
  </div>
</template>
