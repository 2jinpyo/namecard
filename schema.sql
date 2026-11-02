-- 1) Supabase SQL Editor에서 실행하세요.
create table if not exists public.profiles (
  id text primary key check (id = 'owner'),
  name text not null default 'YOUR NAME',
  title text default 'YOUR POSITION',
  company text default 'YOUR COMPANY',
  bio text default '',
  phone text default '',
  email text default '',
  instagram text default '',
  website text default '',
  address text default '',
  avatar_url text default '',
  accent text default '#c8a96e',
  show_phone boolean default true,
  show_email boolean default true,
  show_instagram boolean default true,
  show_website boolean default true,
  show_address boolean default false,
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Public can view owner card" on public.profiles;
create policy "Public can view owner card" on public.profiles
for select using (id = 'owner');
drop policy if exists "Authenticated owner can edit card" on public.profiles;
create policy "Authenticated owner can edit card" on public.profiles
for all to authenticated using (id = 'owner') with check (id = 'owner');
insert into public.profiles (id) values ('owner') on conflict (id) do nothing;
-- Supabase Authentication에서 소유자 계정을 직접 생성하세요.
-- 회원가입 공개는 활성화하지 말고, 본인 계정만 생성하는 것을 권장합니다.