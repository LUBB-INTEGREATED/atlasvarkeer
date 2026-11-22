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

-- Automatically backfill any existing users created in Supabase Auth Dashboard
insert into public.admin_users (user_id, email)
select id, coalesce(email, '')
from auth.users
on conflict (user_id) do update set email = excluded.email;

-- Automatically register future users added in Supabase Auth Dashboard
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_users (user_id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Helper function to verify if the current JWT belongs to an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select auth.role() = 'authenticated' and (
    not exists (select 1 from public.admin_users)
    or exists (select 1 from public.admin_users where user_id = auth.uid())
  );
$$;

-- ============================================================================
-- ADMIN USER MANAGEMENT RPC FUNCTIONS (List, Create, Change Password, Delete)
-- ============================================================================

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;

  return query
  select
    u.id as user_id,
    coalesce(u.email::text, au.email, '') as email,
    coalesce(u.created_at, au.created_at, now()) as created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.admin_users au on au.user_id = u.id
  where coalesce((u.raw_user_meta_data->>'is_admin')::boolean, true) = true
  order by u.created_at asc;
end;
$$;

create or replace function public.admin_create_user(
  target_email text,
  target_password text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  new_user_id uuid := gen_random_uuid();
  clean_email text := lower(trim(target_email));
  encrypted_pw text;
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;

  if clean_email = '' or position('@' in clean_email) = 0 then
    raise exception 'Ongeldig e-mailadres';
  end if;

  if char_length(target_password) < 8 then
    raise exception 'Wachtwoord moet minimaal 8 tekens bevatten';
  end if;

  if exists (select 1 from auth.users where lower(email) = clean_email) then
    raise exception 'Er bestaat al een gebruiker met dit e-mailadres';
  end if;

  encrypted_pw := crypt(target_password, gen_salt('bf'));

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    clean_email,
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"is_admin":true}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    new_user_id,
    new_user_id::text,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', clean_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.admin_users (user_id, email)
  values (new_user_id, clean_email)
  on conflict (user_id) do update set email = excluded.email;

  return new_user_id;
end;
$$;

create or replace function public.admin_update_user_password(
  target_user_id uuid,
  new_password text
)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;

  if char_length(new_password) < 8 then
    raise exception 'Wachtwoord moet minimaal 8 tekens bevatten';
  end if;

  update auth.users
  set
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Gebruiker niet gevonden';
  end if;
end;
$$;

create or replace function public.admin_delete_user(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'U kunt uw eigen actieve account niet verwijderen';
  end if;

  delete from public.admin_users where user_id = target_user_id;
  delete from auth.users where id = target_user_id;
end;
$$;

grant execute on function public.admin_list_users() to authenticated, service_role;
grant execute on function public.admin_create_user(text, text) to authenticated, service_role;
grant execute on function public.admin_update_user_password(uuid, text) to authenticated, service_role;
grant execute on function public.admin_delete_user(uuid) to authenticated, service_role;

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
grant all on public.admin_users to authenticated, service_role;

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

-- Admin users can read and manage records in public.admin_users
drop policy if exists "Admin users read own record" on public.admin_users;
create policy "Admin users read own record" on public.admin_users
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin users sync own record" on public.admin_users;
create policy "Admin users sync own record" on public.admin_users
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin full access admin_users" on public.admin_users;
create policy "Admin full access admin_users" on public.admin_users
  for all using (public.is_admin()) with check (public.is_admin());

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

