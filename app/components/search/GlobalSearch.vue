<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import UiInput from '~/components/ui/Input.vue'

interface SearchResult {
  type: 'course' | 'lesson'
  id: string
  title: string
  url: string
}

const props = defineProps<{ class?: string }>()
const query = ref('')
const results = ref<SearchResult[]>([])
const loading = ref(false)
const open = ref(false)
const debounceMs = 300
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const { t } = useI18n()

async function search() {
  const q = query.value.trim()
  if (!q) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const data = await $fetch<SearchResult[]>('/api/search', { params: { q } })
    results.value = data ?? []
    open.value = true
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

watch(query, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(search, debounceMs)
})

function close() {
  open.value = false
}

const placeholder = computed(() => t('search.placeholder'))
</script>

<template>
  <div class="relative" :class="props.class">
    <UiInput
      v-model="query"
      type="search"
      :placeholder="placeholder"
      class="h-9 pl-8"
      @focus="query && (open = true)"
    />
    <VIcon
      name="bi-search"
      class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4"
    />
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open && (results.length > 0 || loading)"
        class="absolute top-full left-0 right-0 mt-1 rounded-md border bg-card py-2 shadow-lg max-h-80 overflow-auto"
      >
        <p v-if="loading" class="px-4 py-2 text-sm text-muted-foreground">
          {{ t('search.loading') }}
        </p>
        <NuxtLink
          v-for="r in results"
          :key="`${r.type}-${r.id}`"
          :to="r.url"
          class="block px-4 py-2 text-sm hover:bg-accent"
          @click="close"
        >
          <span class="text-muted-foreground text-xs">
            {{ r.type === 'course' ? t('search.type.course') : t('search.type.lesson') }}:
          </span>
          {{ r.title }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>
