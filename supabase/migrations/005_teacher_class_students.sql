-- Allow teachers to enroll/remove students on classes they teach.

create policy "class_students_teacher_insert"
  on public.class_students for insert to authenticated
  with check (public.teaches_class(class_id));

create policy "class_students_teacher_delete"
  on public.class_students for delete to authenticated
  using (public.teaches_class(class_id));
