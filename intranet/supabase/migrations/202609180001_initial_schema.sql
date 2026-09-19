create extension if not exists pgcrypto;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 80),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,80}$'),
  email text not null unique,
  full_name text not null check (char_length(full_name) between 2 and 80),
  avatar_path text,
  job_title text,
  department_id uuid references public.departments(id) on delete set null,
  location text,
  bio text check (char_length(bio) <= 280),
  interests text[] not null default '{}',
  joined_date date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_department_id_idx on public.profiles(department_id);
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists profiles_full_name_idx on public.profiles(full_name);
create index if not exists profiles_interests_idx on public.profiles using gin(interests);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  generated_name text;
  generated_slug text;
begin
  generated_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(coalesce(new.email, 'thanh-vien'), '@', 1)
  );
  generated_slug := trim(both '-' from regexp_replace(lower(split_part(coalesce(new.email, 'thanh-vien'), '@', 1)), '[^a-z0-9]+', '-', 'g'))
    || '-' || left(new.id::text, 8);

  insert into public.profiles (id, slug, email, full_name)
  values (new.id, generated_slug, coalesce(new.email, new.id::text || '@unknown.local'), generated_name)
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_app_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = required_role
  );
$$;

revoke all on function public.has_app_role(text) from public;
grant execute on function public.has_app_role(text) to authenticated;

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

revoke all on public.departments from anon;
revoke all on public.profiles from anon;
revoke all on public.user_roles from anon;

revoke all on public.departments from authenticated;
revoke all on public.profiles from authenticated;
revoke all on public.user_roles from authenticated;

grant select on public.departments to authenticated;
grant select on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant update (full_name, avatar_path, job_title, department_id, location, bio, interests, joined_date)
  on public.profiles to authenticated;

drop policy if exists "Members can view departments" on public.departments;
create policy "Members can view departments"
on public.departments for select
to authenticated
using (true);

drop policy if exists "Members can view active profiles" on public.profiles;
create policy "Members can view active profiles"
on public.profiles for select
to authenticated
using (status = 'active' or id = (select auth.uid()) or public.has_app_role('admin'));

drop policy if exists "Members can update their profile" on public.profiles;
create policy "Members can update their profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (
  id = (select auth.uid())
  and status = 'active'
  and (
    avatar_path is null
    or avatar_path like (select auth.uid()::text) || '/%'
  )
);

drop policy if exists "Members can view roles" on public.user_roles;
create policy "Members can view roles"
on public.user_roles for select
to authenticated
using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can view avatars" on storage.objects;
create policy "Members can view avatars"
on storage.objects for select
to authenticated
using (bucket_id = 'avatars');

drop policy if exists "Members can upload their avatar" on storage.objects;
create policy "Members can upload their avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Members can update their avatar" on storage.objects;
create policy "Members can update their avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Members can delete their avatar" on storage.objects;
create policy "Members can delete their avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and owner_id = (select auth.uid()::text)
);
