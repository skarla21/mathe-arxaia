<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import UiInput from '~/components/ui/Input.vue'
import UiPopover from '~/components/ui/popover/Popover.vue'
import UiPopoverAnchor from '~/components/ui/popover/PopoverAnchor.vue'
import UiPopoverContent from '~/components/ui/popover/PopoverContent.vue'

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
    open.value = false
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

function onFocus() {
  if (query.value && (results.value.length > 0 || loading.value)) {
    open.value = true
  }
}

const placeholder = computed(() => t('search.placeholder'))
</script>

<template>
  <UiPopover v-model:open="open" :class="props.class">
    <UiPopoverAnchor as-child>
      <div class="relative">
        <UiInput
          v-model="query"
          type="search"
          :placeholder="placeholder"
          class="h-9 pl-8 w-full"
          @focus="onFocus"
        />
        <VIcon
          name="bi-search"
          class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4"
        />
      </div>
    </UiPopoverAnchor>
    <UiPopoverContent
      class="max-h-80 overflow-auto py-2"
      align="start"
      :side-offset="4"
    >
      <p v-if="loading" class="px-4 py-2 text-sm text-muted-foreground">
        {{ t('search.loading') }}
      </p>
      <NuxtLink
        v-for="r in results"
        :key="`${r.type}-${r.id}`"
        :to="r.url"
        class="block px-4 py-2 text-sm hover:bg-accent rounded-sm"
        @click="close"
      >
        <span class="text-muted-foreground text-xs">
          {{ r.type === 'course' ? t('search.type.course') : t('search.type.lesson') }}:
        </span>
        {{ r.title }}
      </NuxtLink>
    </UiPopoverContent>
  </UiPopover>
</template>
