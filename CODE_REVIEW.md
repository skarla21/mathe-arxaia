# Code Review: mathe-arxaia (Nuxt 3)

## 1. Stack compliance

### Compliant
- **Nuxt 3** (Nuxt 4.x in package.json; config and usage are Nuxt 3 style).
- **Vue 3 Composition API & `<script setup>`**: Used consistently in `app/pages/*.vue`, `app/components/**/*.vue`, `app/layouts/*.vue`.
- **Tailwind CSS**: `app/assets/css/main.css` uses `@import "tailwindcss"` and theme variables; Tailwind Vite plugin in `nuxt.config.ts`.
- **shadcn-vue**: `radix-vue` and `shadcn-nuxt` in dependencies; UI components under `app/components/ui/` (Button, Card, Input, etc.) and `app/lib/utils.ts` (cn with clsx + tailwind-merge).
- **GSAP only for animations**: `app/composables/useGsapReveal.ts` uses only GSAP + ScrollTrigger; no Framer Motion or Anime.js.
- **Supabase**: Used for DB and storage via `@supabase/supabase-js`; `server/utils/supabaseServer.ts` and `server/utils/access.ts`; admin upload to Supabase Storage.
- **Auth.js**: `@auth/core` with Credentials + Google in `server/api/auth/[...].ts`; session via `server/api/auth/session.get.ts`.
- **Stripe**: `server/api/stripe/checkout.post.ts` and `webhook.post.ts`; secrets from runtimeConfig (server-only).
- **PDF.js**: `pdfjs-dist` in `app/components/lesson/PdfViewer.vue`.
- **oh-vue-icons**: Used in `AppHeader.vue`, `NotesDropdown.vue`, `GlobalSearch.vue`; no emojis in reviewed UI.
- **No extra UI libs**: No Vuetify, Quasar, Element Plus, etc.

### Note
- **Search**: `server/api/search.get.ts` and `app/components/search/GlobalSearch.vue` implement in-app search over courses/lessons via Supabase `ilike`. Project rules say “Do not implement search engines”; this is internal content search, not an external search engine. Consider clarifying the rule or renaming to “content filter” to avoid confusion.

---

## 2. Project rules

### Violations and fixes

#### 2.1 No hardcoded text (use translations)
All user-facing strings should use `useI18n().t()` and keys from `app/locales/en.json` / `el.json`.

| Location | Issue | Recommendation |
|----------|--------|----------------|
| `app/pages/index.vue` | Hidden input `value="Μήνυμα από το Mathe-Arxaia.com"` (line ~133) | Add e.g. `home.communication.emailSubject` in locales and use `t('home.communication.emailSubject')`. |
| `app/pages/course/[courseId].vue` | "Loading...", "Free", "Redirecting...", "Buy Course", "Lessons", "No lessons yet.", `alert(...)` message | Add `course.*` keys and use `t()`. Replace `alert` with a translated message (e.g. toast or inline error). |
| `app/pages/lesson/[lessonId].vue` | "Loading...", "Purchase the course to view the PDF." | Add `lesson.loading`, `lesson.purchaseRequired` and use `t()`. |
| `app/pages/about.vue` | Title and body "About", "About the educator and this platform." | Add `about.title`, `about.body` and use `t()`. |
| `app/pages/profile.vue` | "Profile", "Language and theme preferences." | Add `profile.*` and use `t()`. |
| `app/pages/dashboard.vue` | "Dashboard", "Your purchased courses and progress." | Add `dashboard.*` and use `t()`. |
| `app/pages/grade/[grade].vue` | "Grade", "Subjects and courses", "Free", "No subjects for this grade yet." | Add `grade.*` keys and use `t()`. |
| `app/pages/grade/[grade]/[subject].vue` | "Subject", "Free", "No courses in this subject yet." | Add `subject.*` and use `t()`. |
| `app/layouts/admin.vue` | "Overview", "Grades", "Subjects", "Courses", "Lessons", "Uploads", "Purchases", "Admin", "Back to site" | Add `admin.*` in locales and use `t()`. |
| `app/pages/admin/index.vue` | "Admin Overview", "Manage grades, subjects..." | Use translations. |
| `app/pages/admin/uploads.vue` | "Uploads", "Upload PDFs to Supabase Storage..." | Use translations. |
| `app/pages/admin/courses.vue` | "Courses", "Free" / "Paid" | Use translations. |
| `app/pages/admin/lessons.vue` | "Lessons" | Use translations. |
| `app/components/lesson/PdfViewer.vue` | "Prev", "Next", "Loading PDF…" | Add e.g. `pdf.prev`, `pdf.next`, `pdf.loading` and use `t()`. |

#### 2.2 API error messages (optional i18n)
- `server/api/auth/register.post.ts`: Returns English strings (`'Email already registered'`, `'Unable to register user'`). Client shows them in `error.value`. Prefer returning a stable `error.code` (e.g. `email_taken`, `register_failed`) and mapping to `t('auth.register.error.email_taken')` etc. on the client.

#### 2.3 useHead titles
- Several pages use hardcoded titles in `useHead({ title: 'About' })` etc. Prefer `useHead(() => ({ title: t('about.title') }))` (and ensure `useI18n()` is available where needed).

---

## 3. Security

### Critical

#### 3.1 Server auth context never set
- **Files**: `server/api/stripe/checkout.post.ts` (line 9), `server/api/lessons/[id].get.ts` (line 6).
- **Issue**: Both use `event.context.auth?.userId`. There is no server middleware that sets `event.context.auth`, so `userId` is always `null`.
- **Impact**: Checkout cannot tie payments to a user; lesson access is never granted for logged-in users (only public/free or by-passing access).
- **Recommendation**: Add Nitro server middleware that validates the Auth.js session (e.g. via cookie/session token), resolves the user id, and sets `event.context.auth = { userId, isAdmin }`. Run this middleware before API handlers. See README note: “Wire Auth.js and set `event.context.auth` (e.g. `userId`, `role`) in server middleware”.

#### 3.2 Admin API routes unprotected
- **Files**: `server/api/admin/upload.post.ts` (line 7), `server/api/admin/grades.get.ts` (line 4), and likely other `server/api/admin/*.ts` (courses, lessons, subjects, purchases).
- **Issue**: Comments say “TODO: require admin session” but no check is implemented. Any client can call these endpoints (e.g. upload PDFs, list grades/courses/lessons/purchases).
- **Recommendation**: In each admin handler (or in a shared wrapper/middleware), resolve session (e.g. via same mechanism as above), ensure `event.context.auth?.isAdmin === true`, and return 401/403 otherwise. Optionally add a Nitro middleware that protects `/api/admin/*` in one place.

#### 3.3 File upload validation (already good)
- **File**: `server/api/admin/upload.post.ts`.
- **Compliant**: Validates `ALLOWED_TYPES` (PDF), `MAX_SIZE` (10MB), and checks file presence. After fixing admin auth, uploads will be appropriately restricted.

### Good practices
- **Secrets**: Stripe and Supabase service keys only in `runtimeConfig` (no `public:`), so not exposed to client.
- **Passwords**: Handled server-side in `server/utils/password.ts` (bcrypt); never sent or stored in front-end.
- **Stripe webhook**: Signature verified with `stripe.webhooks.constructEvent(body, sig, secret)` in `server/api/stripe/webhook.post.ts`.

### Recommendation
- **RLS**: Use Supabase RLS so that even with a leaked anon key, DB access is restricted by role and ownership. Ensure `purchases`, `users`, and admin-only tables are protected; service role should only be used in server routes that already enforce auth.

---

## 4. Structure and quality

### Compliant
- **Clean structure**: `app/` (pages, components, composables, layouts, plugins, locales, middleware), `server/api/` (auth, admin, stripe, courses, lessons, grades, subjects, search), `server/utils/`, `types/`.
- **Business logic on server**: Access control in `server/utils/access.ts` (`canAccessCourse`, `canAccessLesson`); auth in Auth.js handlers; Stripe and registration in server routes.
- **Role-based middleware**: `app/middleware/admin.ts` and `guest-only.ts` for route protection (client-side).
- **Paid access**: `canAccessLesson` / `canAccessCourse` check purchases; lesson API returns `pdf_url` only when `allowed`; course page shows buy button for non-free courses.

### Issues and recommendations

#### 4.1 Duplicate / alternate paths
- There are both `server/api/auth/session.get.ts` and `server\api\auth\session.get.ts` (and similar for `register.post.ts`, `[...].ts`). On case-insensitive or cross-platform setups this can cause confusion. Prefer a single canonical path (e.g. `server/api/...` with forward slashes) and remove duplicates.

#### 4.2 useCurrentUser and session shape
- **File**: `app/composables/useCurrentUser.ts`.
- **Issue**: Initial state is `{ user: null }` but the composable assigns `session.value.user = (result as any)?.user ?? null`, which can leave `session.value` as `{ user: null }` if the API returns a different shape. Consider typing `session` and normalizing the API response so `session.value` is always `{ user: T \| null }`.
- **Minor**: `process.client` is Node-style; Nuxt prefers `import.meta.client` for consistency with the rest of the app (e.g. `useGsapReveal.ts`, `useTheme.ts`).

#### 4.3 index.vue GSAP usage
- **File**: `app/pages/index.vue` (lines 34–37).
- **Issue**: `sections.value.forEach((s) => revealSection(\`#${s.id}\`))` runs in `onMounted`; `sections` is a computed that depends on `t()`. Ensure `t()` is stable by the time this runs (e.g. locale already set). If `sections` could change later, consider re-running or using a single “container” trigger instead of per-section to avoid duplicate ScrollTrigger instances.

#### 4.4 Error handling and UX
- **File**: `app/pages/course/[courseId].vue`.
- **Issue**: `alert(e?.data?.message ?? 'Checkout failed')` is hardcoded and blocks the UI. Prefer a non-blocking message (e.g. toast or inline error) and translated copy.

#### 4.5 nuxt.config
- **runtimeConfig**: Only `public.supabaseUrl` and `public.supabaseAnonKey` are in `public:`; other secrets are server-only. Correct.
- **Optional**: Add `routeRules` or middleware for `/api/admin/*` to document that those routes require auth (in addition to implementing the actual checks in code).

---

## 5. Summary

| Area | Status | Action |
|------|--------|--------|
| **Stack** | Compliant | Clarify “search engines” vs internal content search if needed. |
| **Translations** | Multiple violations | Replace all hardcoded UI strings and form subject with locale keys; add missing keys to `en.json`/`el.json`. |
| **Server auth context** | Missing | Implement server middleware that sets `event.context.auth` from Auth.js session. |
| **Admin API protection** | Missing | Require admin session in all `/api/admin/*` handlers (or one middleware). |
| **Secrets & passwords** | Good | Keep as-is; consider RLS for Supabase. |
| **Upload validation** | Good | Keep; add admin check. |
| **Structure & scalability** | Good | Remove duplicate server paths; small improvements in useCurrentUser and error UX. |

**Priority order for fixes**
1. **Security**: Set `event.context.auth` in server middleware; protect all admin API routes.
2. **Project rules**: Move all user-visible strings (including admin and PDF viewer) into locale files and use `t()`.
3. **Quality**: Unify server path usage, replace `alert` with translated feedback, and optionally tighten types and `useCurrentUser`/`import.meta.client` usage.
