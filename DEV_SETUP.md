## Local Development Setup

This file describes how to run the app locally in **dev** and what you must configure in Supabase, Stripe, and env vars.

---

### 1. Install dependencies

From the project root:

```bash
npm install
```

This installs Nuxt, Tailwind, GSAP, Supabase client, Stripe SDK, PDF.js, `oh-vue-icons`, etc.

---

### 2. Environment variables

1. Create your local env file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill the following:

   - **Supabase**
     - `NUXT_PUBLIC_SUPABASE_URL` – your Supabase project URL (e.g. `https://xyzcompany.supabase.co`).
     - `NUXT_PUBLIC_SUPABASE_ANON_KEY` – the **anon public** key.
     - `NUXT_SUPABASE_SERVICE_KEY` – the **service_role** key (server‑only, keep it secret).

   - **Stripe**
     - `NUXT_STRIPE_SECRET_KEY` – your Stripe **test** secret key.
     - `NUXT_STRIPE_WEBHOOK_SECRET` – signing secret for the `checkout.session.completed` webhook (see Stripe section).

   - **Auth**
     - `NUXT_AUTH_SECRET` – the only env var required for the current Auth.js setup. It is used to sign JWTs and must be a long, random string. **How to acquire it:** generate one, e.g.:
       - Terminal: `openssl rand -base64 32`
       - Or Node: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
       - Use the output as the value (no quotes needed in `.env`).

Nuxt reads these via `runtimeConfig` in `nuxt.config.ts`.

---

### 3. Supabase setup

#### 3.1 Create tables and RLS

1. Open Supabase → **SQL Editor**.
2. Open `supabase/schema.sql` from this repo.
3. Copy–paste the entire file into the SQL editor and run it **once**.

This creates:

- Tables: `users`, `grades`, `subjects`, `courses`, `lessons`, `purchases`.
- Foreign keys and useful indexes.
- Row-Level Security policies (RLS) so:
  - Public data can be read anonymously.
  - User‑specific data (like `purchases`) is only visible to that user.

#### 3.2 Storage bucket for PDFs

1. Supabase → **Storage** → “Create new bucket”.
2. Name it `uploads` (this matches `server/api/admin/upload.post.ts`).
3. Keep it **private** for now; the app uses signed/public URLs and server checks to control access.

If you change the bucket name, update `admin/upload.post.ts` accordingly.

#### 3.3 Seed minimal data

To see real content on the first run, insert a minimal set of rows in Supabase (via SQL editor or the table UI):

- One `grade` (e.g. “Grade 1”).
- One `subject` pointing to that grade.
- One `course` pointing to that grade + subject:
  - For easy testing, set `is_free = true` and `price = 0`.
- One `lesson` for that course (`is_free = true` recommended initially).

With this, the following routes will show real data:

- `/` (Grades cards)
- `/grade/[grade-id]`
- `/grade/[grade-id]/[subject-id]`
- `/course/[course-id]`
- `/lesson/[lesson-id]`

---

### 4. Stripe setup (test mode)

You only need Stripe for **paid** courses (`is_free = false`).

#### 4.1 Basic configuration

1. In Stripe dashboard, switch to **Test mode**.
2. Copy the **test secret key** and set:

   ```env
   NUXT_STRIPE_SECRET_KEY=sk_test_...
   ```

3. Ensure that in Supabase:
   - For a paid course, `is_free = false`.
   - `price` is set in **cents** (e.g. `1500` = €15.00).

#### 4.2 Webhook

To have Stripe create a `purchases` record after payment:

1. In Stripe dashboard → **Developers → Webhooks**:
   - Create an endpoint pointing to:
     - For local dev via Stripe CLI forwarding: `https://localhost:3000/api/stripe/webhook`
       (you will actually forward to this from the CLI).
     - For production (on Vercel): `https://your-domain.com/api/stripe/webhook`.
   - Select event: `checkout.session.completed`.

2. Copy the **signing secret** for that endpoint and set:

   ```env
   NUXT_STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. (Optional, but recommended in dev) Use **Stripe CLI**:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

   Then copy the secret from the CLI output into `NUXT_STRIPE_WEBHOOK_SECRET`.

After this:

- `POST /api/stripe/checkout` will create a Checkout Session.
- The webhook handler `server/api/stripe/webhook.post.ts` will insert into `purchases` on `checkout.session.completed`.

---

### 5. Auth (Auth.js)

Auth is implemented with **Auth.js** (`@auth/core`): JWT sessions, Credentials provider (email lookup from Supabase `users` table), and role-based access (`admin` / `student`).

- **Env:** Set `NUXT_AUTH_SECRET` (see section 2). No other auth-specific env vars are needed; user data comes from your existing Supabase `users` table.
- **Endpoints:** `/api/auth/*` is handled by `server/api/auth/[...].ts`. Session is exposed at `GET /api/auth/session` (returns `{ user, session }` or `{ user: null, session: null }`).
- **Middleware:** `guest-only` redirects authenticated users away from login/register; `admin` redirects non-admins away from `/admin` (and sub-routes).
- **Pages:** Login and register use the Credentials flow; registration writes to `users` via `POST /api/auth/register`. For protected server routes that need the current user, call `getAuthOptions()` from `server/api/auth/[...].ts` and use Auth.js session helpers, or call `GET /api/auth/session` and rely on the returned `user`.

---

### 6. FormSubmit setup (contact form)

On the home page (`/`), the Communication section uses FormSubmit:

- In `app/pages/index.vue`, find the `<form>`:

  ```html
  <form
    action="https://formsubmit.co/your-email@example.com"
    method="POST"
    ...
  >
  ```

Steps:

1. Replace `your-email@example.com` with the email you want to receive messages at, or with the protected FormSubmit address (per their docs).
2. Optionally add FormSubmit special fields:
   - `_next` – redirect URL after submission.
   - `_replyto` – reply‑to address.
   - `_honeypot` – anti‑bot honeypot field name.

See [FormSubmit docs](https://formsubmit.co/documentation) for details.

---

### 7. Run the dev server

After configuring `.env` and Supabase:

```bash
npm run dev
```

- The app will be available at `http://localhost:3000`.
- Key flows to test:
  - Home page:
    - Sections render correctly.
    - Notes dropdown shows your grades/subjects.
    - Search input calls `/api/search` and returns results when Supabase has data.
  - Grades/subjects:
    - `/grade/<grade-id>`
    - `/grade/<grade-id>/<subject-id>`
  - Course and lesson pages:
    - `/course/<course-id>` (free and paid cases).
    - `/lesson/<lesson-id>` including PDF viewer when `pdf_url` is set and access is allowed.
  - Admin:
    - `/admin` and sub‑routes read from Supabase (`grades`, `subjects`, `courses`, `lessons`, `purchases`).

If you see 500 errors during navigation:

- Check the terminal output from `npm run dev` for stack traces.
- Most common causes:
  - Missing or wrong Supabase URL/keys.
  - Storage bucket `uploads` missing.
  - Stripe secrets not set when hitting checkout/webhook routes.

---

### 8. Production / Vercel (preview)

For a production‑like preview (after dev is stable):

1. Push this repo to GitHub.
2. Create a new project on **Vercel** and import the repo.
3. In Vercel “Environment Variables”, set the same values as in your local `.env`.
4. Vercel should auto‑detect Nuxt and run `npm run build`.
5. After deploy, update your Stripe webhook to point to:

   ```text
   https://your-vercel-domain/api/stripe/webhook
   ```

You will still need to wire real Auth.js before going live with real students, but the rest of the stack will already be in place.

