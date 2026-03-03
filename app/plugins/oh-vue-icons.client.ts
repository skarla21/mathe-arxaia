import { addIcons, OhVueIcon } from 'oh-vue-icons'
import {
  BiSunFill,
  BiMoonFill,
  BiChevronDown,
  BiSearch,
} from 'oh-vue-icons/icons/bi'

addIcons(BiSunFill, BiMoonFill, BiChevronDown, BiSearch)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VIcon', OhVueIcon)
})

