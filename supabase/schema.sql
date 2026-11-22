-- ============================================================================
-- ATLAS HOLLAND B.V. — SUPABASE POSTGRES SCHEMA, GRANTS, RLS & STORAGE
-- Run this script in the Supabase SQL Editor (safe to re-run multiple times).
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. SITE CONTENT (Global settings & per-page structured JSONB content)
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. PROJECTS (Projecten showcase & case studies)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  display_order int not null default 0,
  category text not null default 'Infra & wegenbouw',
  service_slugs text[] not null default '{}',
  client_name text not null default '',
  location text not null default '',
  period text not null default '',
  deployment_summary text not null default '',
  summary text not null default '',
  challenge text not null default '',
  approach text not null default '',
  result text not null default '',
  highlights text[] not null default '{}',
  metrics jsonb not null default '[]'::jsonb,
  cover_image jsonb not null default '{"url": "", "alt": ""}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  quote jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_status_order on public.projects (status, display_order);
create index if not exists idx_projects_slug on public.projects (slug);

-- 3. SERVICES (Diensten collection)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  group_key text not null check (group_key in ('operationeel', 'planning-advies', 'totaaloplossingen')),
  title text not null,
  short_description text not null default '',
  hero_promise text not null default '',
  card_image jsonb not null default '{"url": "", "alt": ""}'::jsonb,
  hero_image jsonb not null default '{"url": "", "alt": ""}'::jsonb,
  what_we_do jsonb not null default '{"paragraphs": [], "bullets": []}'::jsonb,
  applications jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  related_slugs text[] not null default '{}',
  featured_on_home boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  display_order int not null default 0,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_status_order on public.services (status, display_order);

-- 4. VACANCIES (Vacatures collection)
create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  region text not null default '',
  hours text not null default '',
  employment_type text not null default 'Fulltime / Parttime',
  start_date text not null default 'Per direct',
  tags text[] not null default '{}',
  summary text not null default '',
  intro text not null default '',
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  hero_image jsonb not null default '{"url": "", "alt": ""}'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published')),
  display_order int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_vacancies_status_order on public.vacancies (status, display_order);

-- 5. MEDIA ASSETS (Mediabibliotheek)
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null default '',
  filename text not null,
  alt text not null default '',
  mime_type text not null default 'image/jpeg',
  size_bytes int not null default 0,
  width int not null default 0,
  height int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. FORM SUBMISSIONS (Offerte, Contact, Sollicitatie, Opleiding)
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('quote', 'contact', 'application', 'course')),
  name text not null,
  email text not null,
  phone text not null default '',
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'in_progress', 'handled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_form_submissions_created on public.form_submissions (created_at desc);

-- 7. ADMIN USERS (Whitelist of authorized CMS administrators)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  created_at timestamptz not null default now()
);

-- Helper function to verify if the current JWT belongs to an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ============================================================================
-- TABLE & SCHEMA GRANTS (Required so PostgREST anon/authenticated roles can query)
-- Row Level Security (RLS) below still restricts what each role can read/write.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant select on public.site_content to anon, authenticated, service_role;
grant select on public.projects to anon, authenticated, service_role;
grant select on public.services to anon, authenticated, service_role;
grant select on public.vacancies to anon, authenticated, service_role;
grant select on public.media_assets to anon, authenticated, service_role;
grant insert on public.form_submissions to anon, authenticated, service_role;
grant select on public.admin_users to authenticated, service_role;

grant all on public.site_content to authenticated, service_role;
grant all on public.projects to authenticated, service_role;
grant all on public.services to authenticated, service_role;
grant all on public.vacancies to authenticated, service_role;
grant all on public.media_assets to authenticated, service_role;
grant all on public.form_submissions to authenticated, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated, service_role;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Idempotent: drop if exists before create)
-- ============================================================================

alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.vacancies enable row level security;
alter table public.media_assets enable row level security;
alter table public.form_submissions enable row level security;
alter table public.admin_users enable row level security;

-- Admin users can read their own row in public.admin_users
drop policy if exists "Admin users read own record" on public.admin_users;
create policy "Admin users read own record" on public.admin_users
  for select using (auth.uid() = user_id);

-- Public read access for site_content & media_assets
drop policy if exists "Public read site_content" on public.site_content;
create policy "Public read site_content" on public.site_content
  for select using (true);

drop policy if exists "Public read media_assets" on public.media_assets;
create policy "Public read media_assets" on public.media_assets
  for select using (true);

-- Public read access for published rows in projects, services, vacancies
drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects" on public.projects
  for select using (status = 'published' or public.is_admin());

drop policy if exists "Public read published services" on public.services;
create policy "Public read published services" on public.services
  for select using (status = 'published' or public.is_admin());

drop policy if exists "Public read published vacancies" on public.vacancies;
create policy "Public read published vacancies" on public.vacancies
  for select using (status = 'published' or public.is_admin());

-- Public visitors can submit forms (INSERT only)
drop policy if exists "Public insert form_submissions" on public.form_submissions;
create policy "Public insert form_submissions" on public.form_submissions
  for insert with check (true);

-- Verified admin full CRUD on all tables (strictly requires public.is_admin())
drop policy if exists "Admin full access site_content" on public.site_content;
create policy "Admin full access site_content" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access projects" on public.projects;
create policy "Admin full access projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access services" on public.services;
create policy "Admin full access services" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access vacancies" on public.vacancies;
create policy "Admin full access vacancies" on public.vacancies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access media_assets" on public.media_assets;
create policy "Admin full access media_assets" on public.media_assets
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin full access form_submissions" on public.form_submissions;
create policy "Admin full access form_submissions" on public.form_submissions
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- STORAGE BUCKET: atlas-media
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('atlas-media', 'atlas-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read atlas-media" on storage.objects;
create policy "Public read atlas-media" on storage.objects
  for select using (bucket_id = 'atlas-media');

drop policy if exists "Authenticated upload atlas-media" on storage.objects;
create policy "Authenticated upload atlas-media" on storage.objects
  for insert with check (bucket_id = 'atlas-media' and public.is_admin());

drop policy if exists "Authenticated update atlas-media" on storage.objects;
create policy "Authenticated update atlas-media" on storage.objects
  for update using (bucket_id = 'atlas-media' and public.is_admin());

drop policy if exists "Authenticated delete atlas-media" on storage.objects;
create policy "Authenticated delete atlas-media" on storage.objects
  for delete using (bucket_id = 'atlas-media' and public.is_admin());

