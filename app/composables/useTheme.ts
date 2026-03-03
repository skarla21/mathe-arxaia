const STORAGE_KEY = 'mathe-arxaia-theme'

export function useTheme() {
  const colorMode = useState<'light' | 'dark'>('theme', () => 'light')

  function getStored(): 'light' | 'dark' {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
      if (stored === 'dark' || stored === 'light') return stored
    }
    return 'light'
  }

  function apply(mode: 'light' | 'dark') {
    if (import.meta.client && document.documentElement) {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(mode)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode)
      }
    }
    colorMode.value = mode
  }

  function toggle() {
    const next = colorMode.value === 'dark' ? 'light' : 'dark'
    apply(next)
    return next
  }

  function init() {
    if (import.meta.client) {
      const stored = getStored()
      apply(stored)
    }
  }

  return { colorMode: readonly(colorMode), apply, toggle, init }
}
