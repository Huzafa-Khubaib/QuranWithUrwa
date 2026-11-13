-- Quran With Urwa — portal schema + RLS
-- Roles: admin | teacher | student
-- Apply after 001_request_tables.sql (Supabase SQL editor or `supabase db push`)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('admin', 'teacher', 'student');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.meeting_platform as enum ('meet', 'zoom');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.announcement_audience as enum ('all', 'students', 'teachers', 'class');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Shared updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'student',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Role helper functions (SECURITY DEFINER — avoid RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'student'
  );
$$;

-- ---------------------------------------------------------------------------
-- Public intake forms (extend if already created in 001)
-- ---------------------------------------------------------------------------

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  child_name text not null,
  child_age integer not null check (child_age >= 3 and child_age <= 99),
  whatsapp_number text not null,
  email text not null,
  country text not null,
  course_interest text not null,
  preferred_time text not null,
  message text,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollment_requests (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  child_name text not null,
  child_age integer not null check (child_age >= 3 and child_age <= 99),
  whatsapp_number text not null,
  email text not null,
  country text not null,
  course_interest text not null,
  preferred_time text not null,
  message text,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_requests_status_idx on public.demo_requests (status);
create index if not exists demo_requests_created_at_idx on public.demo_requests (created_at desc);
create index if not exists enrollment_requests_status_idx on public.enrollment_requests (status);
create index if not exists enrollment_requests_created_at_idx on public.enrollment_requests (created_at desc);

drop trigger if exists demo_requests_set_updated_at on public.demo_requests;
create trigger demo_requests_set_updated_at
  before update on public.demo_requests
  for each row execute function public.set_updated_at();

drop trigger if exists enrollment_requests_set_updated_at on public.enrollment_requests;
create trigger enrollment_requests_set_updated_at
  before update on public.enrollment_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Courses (catalog)
-- ---------------------------------------------------------------------------

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  arabic_title text,
  description text,
  level text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Classes (live Meet/Zoom groups)
-- ---------------------------------------------------------------------------

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  teacher_id uuid not null references public.profiles (id) on delete restrict,
  title text not null,
  platform public.meeting_platform not null default 'meet',
  meeting_link text,
  schedule_days text[] not null default '{}',
  start_time time,
  duration_minutes integer not null default 45 check (duration_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists classes_course_id_idx on public.classes (course_id);
create index if not exists classes_teacher_id_idx on public.classes (teacher_id);

drop trigger if exists classes_set_updated_at on public.classes;
create trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Class ↔ students
-- ---------------------------------------------------------------------------

create table if not exists public.class_students (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create index if not exists class_students_student_id_idx on public.class_students (student_id);

-- Class membership helpers (after tables exist)
create or replace function public.teaches_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.classes
    where id = p_class_id and teacher_id = auth.uid()
  );
$$;

create or replace function public.enrolled_in_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.class_students
    where class_id = p_class_id and student_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Sessions (per meeting + recording)
-- ---------------------------------------------------------------------------

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  session_date date not null,
  recording_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, session_date)
);

create index if not exists sessions_class_id_idx on public.sessions (class_id);
create index if not exists sessions_session_date_idx on public.sessions (session_date desc);

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------

create table if not exists public.attendance (
  session_id uuid not null references public.sessions (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  present boolean not null default false,
  marked_at timestamptz not null default now(),
  primary key (session_id, student_id)
);

create index if not exists attendance_student_id_idx on public.attendance (student_id);

-- ---------------------------------------------------------------------------
-- Quizzes
-- ---------------------------------------------------------------------------

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  title text not null,
  description text,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quizzes_class_id_idx on public.quizzes (class_id);

drop trigger if exists quizzes_set_updated_at on public.quizzes;
create trigger quizzes_set_updated_at
  before update on public.quizzes
  for each row execute function public.set_updated_at();

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  points integer not null default 1 check (points > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists questions_quiz_id_idx on public.questions (quiz_id);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score numeric(6, 2),
  max_score numeric(6, 2),
  submitted_at timestamptz not null default now(),
  unique (quiz_id, student_id)
);

create index if not exists quiz_attempts_student_id_idx on public.quiz_attempts (student_id);
create index if not exists quiz_attempts_quiz_id_idx on public.quiz_attempts (quiz_id);

-- ---------------------------------------------------------------------------
-- Announcements
-- ---------------------------------------------------------------------------

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience public.announcement_audience not null default 'all',
  class_id uuid references public.classes (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_class_required check (
    (audience = 'class' and class_id is not null)
    or (audience <> 'class')
  )
);

create index if not exists announcements_class_id_idx on public.announcements (class_id);
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================

alter table public.profiles enable row level security;
alter table public.demo_requests enable row level security;
alter table public.enrollment_requests enable row level security;
alter table public.courses enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.announcements enable row level security;

-- Drop old policies if re-running
do $$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'demo_requests', 'enrollment_requests', 'courses', 'classes',
        'class_students', 'sessions', 'attendance', 'quizzes', 'questions',
        'quiz_attempts', 'announcements'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ---------- profiles ----------

create policy "profiles_select_own_or_staff"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or public.is_admin()
    or (
      public.is_teacher()
      and exists (
        select 1
        from public.class_students cs
        join public.classes c on c.id = cs.class_id
        where cs.student_id = profiles.id
          and c.teacher_id = auth.uid()
      )
    )
  );

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    public.is_admin()
    or (id = auth.uid() and role = public.current_user_role())
  );

create policy "profiles_admin_insert"
  on public.profiles for insert to authenticated
  with check (public.is_admin() or id = auth.uid());

create policy "profiles_admin_delete"
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- ---------- demo_requests / enrollment_requests (admin only for auth users) ----------
-- Public inserts use service role from Next.js API (bypasses RLS).

create policy "demo_requests_admin_all"
  on public.demo_requests for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "enrollment_requests_admin_all"
  on public.enrollment_requests for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- courses ----------

create policy "courses_select_authenticated"
  on public.courses for select to authenticated
  using (is_active = true or public.is_admin() or public.is_teacher());

create policy "courses_admin_write"
  on public.courses for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- classes ----------

create policy "classes_select_own"
  on public.classes for select to authenticated
  using (
    public.is_admin()
    or teacher_id = auth.uid()
    or public.enrolled_in_class(id)
  );

create policy "classes_admin_insert"
  on public.classes for insert to authenticated
  with check (public.is_admin());

create policy "classes_admin_or_teacher_update"
  on public.classes for update to authenticated
  using (public.is_admin() or teacher_id = auth.uid())
  with check (public.is_admin() or teacher_id = auth.uid());

create policy "classes_admin_delete"
  on public.classes for delete to authenticated
  using (public.is_admin());

-- Teachers may update meeting_link / notes fields of their classes only
-- (enforced above; admin can reassign teacher_id)

-- ---------- class_students ----------

create policy "class_students_select"
  on public.class_students for select to authenticated
  using (
    public.is_admin()
    or student_id = auth.uid()
    or public.teaches_class(class_id)
  );

create policy "class_students_admin_write"
  on public.class_students for insert to authenticated
  with check (public.is_admin());

create policy "class_students_admin_update"
  on public.class_students for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "class_students_admin_delete"
  on public.class_students for delete to authenticated
  using (public.is_admin());

-- ---------- sessions (recordings) ----------

create policy "sessions_select_own"
  on public.sessions for select to authenticated
  using (
    public.is_admin()
    or public.teaches_class(class_id)
    or public.enrolled_in_class(class_id)
  );

create policy "sessions_teacher_insert"
  on public.sessions for insert to authenticated
  with check (
    public.is_admin()
    or public.teaches_class(class_id)
  );

create policy "sessions_teacher_update"
  on public.sessions for update to authenticated
  using (
    public.is_admin()
    or public.teaches_class(class_id)
  )
  with check (
    public.is_admin()
    or public.teaches_class(class_id)
  );

create policy "sessions_admin_delete"
  on public.sessions for delete to authenticated
  using (public.is_admin() or public.teaches_class(class_id));

-- ---------- attendance ----------

create policy "attendance_select"
  on public.attendance for select to authenticated
  using (
    public.is_admin()
    or student_id = auth.uid()
    or exists (
      select 1 from public.sessions s
      where s.id = attendance.session_id
        and public.teaches_class(s.class_id)
    )
  );

create policy "attendance_teacher_write"
  on public.attendance for insert to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.sessions s
      where s.id = session_id
        and public.teaches_class(s.class_id)
    )
  );

create policy "attendance_teacher_update"
  on public.attendance for update to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.sessions s
      where s.id = attendance.session_id
        and public.teaches_class(s.class_id)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.sessions s
      where s.id = session_id
        and public.teaches_class(s.class_id)
    )
  );

create policy "attendance_admin_delete"
  on public.attendance for delete to authenticated
  using (public.is_admin());

-- ---------- quizzes ----------

create policy "quizzes_select"
  on public.quizzes for select to authenticated
  using (
    public.is_admin()
    or public.teaches_class(class_id)
    or (is_published and public.enrolled_in_class(class_id))
  );

create policy "quizzes_teacher_insert"
  on public.quizzes for insert to authenticated
  with check (
    public.is_admin()
    or public.teaches_class(class_id)
  );

create policy "quizzes_teacher_update"
  on public.quizzes for update to authenticated
  using (
    public.is_admin()
    or public.teaches_class(class_id)
  )
  with check (
    public.is_admin()
    or public.teaches_class(class_id)
  );

create policy "quizzes_teacher_delete"
  on public.quizzes for delete to authenticated
  using (
    public.is_admin()
    or public.teaches_class(class_id)
  );

-- ---------- questions ----------
-- Students can read questions only for published quizzes in their classes
-- (correct_answer is visible — hide via a view in app if needed)

create policy "questions_select"
  on public.questions for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.quizzes q
      where q.id = questions.quiz_id
        and (
          public.teaches_class(q.class_id)
          or (q.is_published and public.enrolled_in_class(q.class_id))
        )
    )
  );

create policy "questions_teacher_write"
  on public.questions for all to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.quizzes q
      where q.id = questions.quiz_id
        and public.teaches_class(q.class_id)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.quizzes q
      where q.id = quiz_id
        and public.teaches_class(q.class_id)
    )
  );

-- ---------- quiz_attempts (results) ----------

create policy "quiz_attempts_select"
  on public.quiz_attempts for select to authenticated
  using (
    public.is_admin()
    or student_id = auth.uid()
    or exists (
      select 1 from public.quizzes q
      where q.id = quiz_attempts.quiz_id
        and public.teaches_class(q.class_id)
    )
  );

create policy "quiz_attempts_student_insert"
  on public.quiz_attempts for insert to authenticated
  with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      where q.id = quiz_id
        and q.is_published
        and public.enrolled_in_class(q.class_id)
    )
  );

create policy "quiz_attempts_student_update_own"
  on public.quiz_attempts for update to authenticated
  using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

create policy "quiz_attempts_admin_delete"
  on public.quiz_attempts for delete to authenticated
  using (public.is_admin());

-- ---------- announcements ----------

create policy "announcements_select"
  on public.announcements for select to authenticated
  using (
    public.is_admin()
    or created_by = auth.uid()
    or audience = 'all'
    or (audience = 'students' and public.is_student())
    or (audience = 'teachers' and public.is_teacher())
    or (
      audience = 'class'
      and class_id is not null
      and (
        public.teaches_class(class_id)
        or public.enrolled_in_class(class_id)
      )
    )
  );

create policy "announcements_staff_insert"
  on public.announcements for insert to authenticated
  with check (
    public.is_admin()
    or (
      public.is_teacher()
      and (
        audience in ('all', 'students', 'teachers')
        or (audience = 'class' and public.teaches_class(class_id))
      )
    )
  );

create policy "announcements_staff_update"
  on public.announcements for update to authenticated
  using (public.is_admin() or created_by = auth.uid())
  with check (public.is_admin() or created_by = auth.uid());

create policy "announcements_staff_delete"
  on public.announcements for delete to authenticated
  using (public.is_admin() or created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- Student-safe questions view (hides correct_answer)
-- ---------------------------------------------------------------------------

create or replace view public.questions_for_students
with (security_invoker = true)
as
select
  id,
  quiz_id,
  prompt,
  options,
  points,
  sort_order,
  created_at
from public.questions;

grant select on public.questions_for_students to authenticated;

-- ---------------------------------------------------------------------------
-- Seed note (optional catalog rows — uncomment if desired)
-- ---------------------------------------------------------------------------
-- insert into public.courses (slug, title, arabic_title, description, level, sort_order) values
--   ('noorani-qaida', 'Noorani Qaida', 'نورانی قاعدہ', 'Beginner letters & sounds', 'Beginner', 1),
--   ('nazra', 'Nazra Quran', 'ناظرہ قرآن', 'Fluent reading', 'Beginner–Intermediate', 2),
--   ('tajweed', 'Tajweed', 'تجوید', 'Rules of recitation', 'Intermediate', 3),
--   ('hifz', 'Hifz Program', 'حفظ القرآن', 'Memorization', 'All levels', 4),
--   ('duas', 'Duas & Surahs', 'أدعية و سور', 'Daily duas & short surahs', 'All ages', 5)
-- on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Done
-- Summary:
--   • students → own profile, enrolled classes, sessions/recordings, own attempts/attendance
--   • teachers → own classes + those students, sessions, quizzes, attendance
--   • admin → everything
--   • demo/enrollment requests → admin only (public inserts via service role)
-- ---------------------------------------------------------------------------
