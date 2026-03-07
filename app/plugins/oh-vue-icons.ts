import { addIcons, OhVueIcon } from 'oh-vue-icons'
import {
  BiSunFill,
  BiMoonFill,
  BiChevronDown,
  BiSearch,
  BiStars,
  BiInfoCircle,
  BiMortarboard,
  BiCheck2Circle,
  BiInbox,
  BiListCheck,
  BiGem,
  BiPlusCircle,
  BiChatDots,
  BiEnvelope,
  BiChatText,
  BiJournalBookmarkFill,
  BiHouseDoor,
  BiJournalText,
  BiJournalBookmark,
  BiArrowRight,
} from 'oh-vue-icons/icons/bi'

addIcons(
  BiSunFill,
  BiMoonFill,
  BiChevronDown,
  BiSearch,
  BiStars,
  BiInfoCircle,
  BiMortarboard,
  BiCheck2Circle,
  BiInbox,
  BiListCheck,
  BiGem,
  BiPlusCircle,
  BiChatDots,
  BiEnvelope,
  BiChatText,
  BiJournalBookmarkFill,
  BiHouseDoor,
  BiJournalText,
  BiJournalBookmark,
  BiArrowRight,
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VIcon', OhVueIcon)
})
