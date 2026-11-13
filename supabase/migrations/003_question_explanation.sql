-- Add optional explanation to quiz questions (shown in teacher builder / review)

alter table public.questions
  add column if not exists explanation text;

-- Refresh student-safe view (still hides correct_answer + explanation)
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
