-- Demo & enrollment request tables for Quran With Urwa public forms.
-- Apply in Supabase SQL editor or via CLI: supabase db push

create type public.request_status as enum ('pending', 'approved', 'rejected');

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists demo_requests_set_updated_at on public.demo_requests;
create trigger demo_requests_set_updated_at
  before update on public.demo_requests
  for each row execute function public.set_updated_at();

drop trigger if exists enrollment_requests_set_updated_at on public.enrollment_requests;
create trigger enrollment_requests_set_updated_at
  before update on public.enrollment_requests
  for each row execute function public.set_updated_at();

alter table public.demo_requests enable row level security;
alter table public.enrollment_requests enable row level security;

-- No anon/authenticated policies: inserts go through the Next.js API with the service role.
-- Add admin SELECT/UPDATE policies later when auth roles are wired.
