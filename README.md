# Quran With Urwa

Online Quran learning portal — soft pastel claymorphism UI with Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Supabase, and Framer Motion.

Live classes happen on **Google Meet / Zoom**. This app stores links and recordings only.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- Supabase Auth / Postgres / Storage (clients ready; secrets via env)

## Auth & portals

| Login | Portal |
| ----- | ------ |
| `/login/student` | `/student` |
| `/login/teacher` | `/teacher` |
| `/login/admin` (hidden) | `/admin` |

### Demo logins (local)

With `DEMO_AUTH=true` in `.env.local` (password for all: `Demo@1234`):

| Portal | Email | URL |
| ------ | ----- | --- |
| Admin | `admin@demo.urwa` | `/login/admin` |
| Teacher | `teacher@demo.urwa` | `/login/teacher` |
| Student | `student@demo.urwa` | `/login/student` |

- No public signup — admins create users (`createUserAccountAction` + Supabase Admin API)
- Forgot password: `/forgot-password` → email link → `/reset-password`
- Middleware blocks wrong roles from `/student`, `/teacher`, `/admin`
- Auth callback: `/auth/callback`

Set Supabase Auth redirect URL: `{SITE_URL}/auth/callback`

## Getting started

```bash
cp .env.example .env.local
# fill NEXT_PUBLIC_WHATSAPP_NUMBER, Supabase keys, etc.
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Public pages

| Route       | Description                          |
| ----------- | ------------------------------------ |
| `/`         | Home (hero, courses, FAQ, CTA…)      |
| `/courses`  | Full course list                     |
| `/fees`     | Plans table + pricing cards          |
| `/about`    | Mission & values                     |
| `/contact`  | Form + WhatsApp                      |
| `/book-demo`| Free demo request (Zod + RHF)        |
| `/enroll`   | Enrollment request (Zod + RHF)       |

Sticky WhatsApp float appears on all pages (uses `NEXT_PUBLIC_WHATSAPP_NUMBER`).

## Demo & enroll forms

1. Run migrations in order:
   - `supabase/migrations/001_request_tables.sql`
   - `supabase/migrations/002_portal_schema_rls.sql` (profiles, classes, quizzes, RLS)
   - `supabase/migrations/003_question_explanation.sql`
   - `supabase/migrations/004_admin_fees.sql` (fee tracker + request user link)
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`.
4. Also run `005_teacher_class_students.sql` so teachers can enroll students on their classes.
   Teachers create student accounts from `/teacher/students` (or a class detail page).

Posts go to `/api/demo-requests` and `/api/enrollment-requests`, insert with status `pending`, notify admin via Resend, and ignore honeypot spam silently.

## Environment

Never hardcode secrets. See `.env.example` for required variables.
