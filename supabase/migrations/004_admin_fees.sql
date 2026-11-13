-- Admin fee tracker + request linkage for approved accounts

do $$ begin
  create type public.fee_status as enum ('paid', 'unpaid');
exception when duplicate_object then null;
end $$;

alter table public.demo_requests
  add column if not exists processed_user_id uuid references public.profiles (id) on delete set null;

alter table public.enrollment_requests
  add column if not exists processed_user_id uuid references public.profiles (id) on delete set null;

create table if not exists public.fee_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  year_month text not null check (year_month ~ '^\d{4}-\d{2}$'),
  status public.fee_status not null default 'unpaid',
  amount numeric(10, 2),
  notes text,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, year_month)
);

create index if not exists fee_records_year_month_idx on public.fee_records (year_month);
create index if not exists fee_records_student_id_idx on public.fee_records (student_id);
create index if not exists fee_records_status_idx on public.fee_records (status);

drop trigger if exists fee_records_set_updated_at on public.fee_records;
create trigger fee_records_set_updated_at
  before update on public.fee_records
  for each row execute function public.set_updated_at();

alter table public.fee_records enable row level security;

drop policy if exists "fee_records_admin_all" on public.fee_records;
create policy "fee_records_admin_all"
  on public.fee_records for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Students can see their own fee status
drop policy if exists "fee_records_student_select" on public.fee_records;
create policy "fee_records_student_select"
  on public.fee_records for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
