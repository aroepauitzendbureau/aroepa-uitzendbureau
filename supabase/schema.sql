
-- Jobs (vacatures)
create extension if not exists pgcrypto;
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  location text,
  category text,
  employment_type text,
  description text not null,
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Applications (sollicitaties)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  motivation text,
  cv_url text,
  consent boolean not null default false,
  status text not null default 'new',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Iedereen mag actieve vacatures lezen
create policy if not exists "Public can read active jobs" on public.jobs
  for select using (active = true);

-- Alleen service role (server) mag applicaties schrijven/lezen
create policy if not exists "Service can manage applications" on public.applications
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
