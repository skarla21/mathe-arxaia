-- Run this in Supabase SQL Editor to create tables and RLS.

-- Users (sync with Auth; id = auth.uid())
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users(email);
create index if not exists users_role_idx on public.users(role);

-- Grades
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "order" int not null default 0
);

create index if not exists grades_order_idx on public.grades("order");

-- Subjects
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade_id uuid not null references public.grades(id) on delete cascade
);

create index if not exists subjects_grade_id_idx on public.subjects(grade_id);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  grade_id uuid not null references public.grades(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  is_free boolean not null default true,
  price int default 0,
  created_at timestamptz not null default now()
);

create index if not exists courses_grade_id_idx on public.courses(grade_id);
create index if not exists courses_subject_id_idx on public.courses(subject_id);
create index if not exists courses_title_idx on public.courses(title);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text,
  is_free boolean not null default true,
  pdf_url text,
  created_at timestamptz not null default now()
);

create index if not exists lessons_course_id_idx on public.lessons(course_id);
create index if not exists lessons_title_idx on public.lessons(title);

-- Purchases
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  unique(stripe_session_id)
);

create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_course_id_idx on public.purchases(course_id);
create index if not exists purchases_stripe_session_id_idx on public.purchases(stripe_session_id);

-- RLS
alter table public.users enable row level security;
alter table public.grades enable row level security;
alter table public.subjects enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.purchases enable row level security;

-- Public read for grades, subjects
create policy "grades_select_all" on public.grades for select using (true);
create policy "subjects_select_all" on public.subjects for select using (true);

-- Courses: everyone can read
create policy "courses_select_all" on public.courses for select using (true);

-- Lessons: everyone can read (pdf_url / paid access enforced in app)
create policy "lessons_select_all" on public.lessons for select using (true);

-- Users: own row only
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- Purchases: own rows only
create policy "purchases_select_own" on public.purchases for select using (auth.uid() = user_id);

-- Service role bypass is used by server (supabaseServiceKey); anon key used from client.
-- Admin / CRUD from app server uses service role, so no insert/update/delete policies needed for anon.
-- For service role, RLS can be bypassed if you use service_role key (default in Supabase).
