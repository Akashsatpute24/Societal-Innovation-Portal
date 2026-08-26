-- Run in Supabase SQL Editor. Auth users are mirrored into public.users.
create type public.user_role as enum ('citizen','govt_admin','university','industry_csr');
create type public.problem_status as enum ('Submitted','Routed_To_University','In_Development','Completed');
create type public.problem_domain as enum ('Water Management','Agriculture','Healthcare','Infrastructure','Education');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role public.user_role not null default 'citizen',
  university_name text,
  created_at timestamptz not null default now()
);
create table public.problems (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references public.users(id),
  title text not null check (char_length(title) between 3 and 180),
  description text not null,
  location_lat double precision,
  location_lng double precision,
  media_url text,
  domain public.problem_domain not null,
  urgency_score int not null check (urgency_score between 1 and 5),
  summary text not null,
  recommended_university text not null,
  recommended_department text not null,
  ai_matching_reason text not null,
  assigned_university text,
  status public.problem_status not null default 'Submitted',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid unique not null references public.problems(id) on delete cascade,
  university_name text not null,
  faculty_lead text not null,
  student_team text not null,
  funding_raised numeric(12,2) not null default 0 check (funding_raised >= 0),
  funding_target numeric(12,2) not null check (funding_target > 0),
  status text not null default 'Research planning',
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
alter table public.problems enable row level security;
alter table public.projects enable row level security;
-- Citizen ownership; admin/university/CSR access is enforced from the role in public.users.
create policy "users read own profile" on public.users for select using (id = auth.uid());
create policy "citizens create problems" on public.problems for insert with check (citizen_id = auth.uid());
create policy "citizens read own problems" on public.problems for select using (citizen_id = auth.uid());
create policy "admins read problems" on public.problems for select using (exists(select 1 from public.users u where u.id=auth.uid() and u.role='govt_admin'));
create policy "admins route problems" on public.problems for update using (exists(select 1 from public.users u where u.id=auth.uid() and u.role='govt_admin')) with check (true);
create policy "universities read assigned" on public.problems for select using (exists(select 1 from public.users u where u.id=auth.uid() and u.role='university' and u.university_name=assigned_university));
create policy "universities accept assigned" on public.problems for update using (exists(select 1 from public.users u where u.id=auth.uid() and u.role='university' and u.university_name=assigned_university));
create policy "collaborators read projects" on public.projects for select using (exists(select 1 from public.users u where u.id=auth.uid() and u.role in ('university','industry_csr','govt_admin')));
create policy "universities create projects" on public.projects for insert with check (exists(select 1 from public.users u where u.id=auth.uid() and u.role='university' and u.university_name=university_name));
create policy "csr fund projects" on public.projects for update using (exists(select 1 from public.users u where u.id=auth.uid() and u.role='industry_csr'));
create index problems_status_idx on public.problems(status, urgency_score desc);
create index projects_university_idx on public.projects(university_name);
