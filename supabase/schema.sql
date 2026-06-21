-- ═══════════════════════════════════════════════════════════════════════════
-- КыргызЖардам CRM — Supabase Schema
-- Бул скриптти Supabase Dashboard → SQL Editor ичинде толугу менен иштетиңиз.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. PROFILES (колдонуучулар — auth.users менен байланышкан)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'coordinator', 'volunteer')) default 'volunteer',
  region text,
  phone text,
  avatar_letter text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Жаңы колдонуучу катталганда автоматтык түрдө profile түзүү
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, avatar_letter)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'volunteer'),
    upper(left(coalesce(new.raw_user_meta_data->>'full_name', new.email), 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. PEOPLE (муктаж адамдар)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  phone text,
  region text,
  address text,
  children int default 0,
  family_size int default 1,
  category text,
  priority text check (priority in ('high', 'medium', 'low')) default 'medium',
  status text check (status in ('pending', 'in_progress', 'helped')) default 'pending',
  description text,
  comments text,
  volunteer_id uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists people_status_idx on public.people(status);
create index if not exists people_priority_idx on public.people(priority);
create index if not exists people_volunteer_idx on public.people(volunteer_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. PERSON MEDIA (сүрөт жана видео шилтемелери)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.person_media (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete cascade,
  media_type text check (media_type in ('photo', 'video')) not null,
  storage_path text not null,
  public_url text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create index if not exists person_media_person_idx on public.person_media(person_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. AID (берилген жардамдар)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.aid (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete cascade,
  aid_type text not null,
  amount numeric(12, 2) not null default 0,
  aid_date date not null default current_date,
  responsible_id uuid references public.profiles(id),
  notes text,
  approved boolean default false,
  approved_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create index if not exists aid_person_idx on public.aid(person_id);
create index if not exists aid_date_idx on public.aid(aid_date);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. REPORTS (волонтерлордун отчеттору)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete cascade,
  volunteer_id uuid references public.profiles(id),
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade,
  media_type text check (media_type in ('photo', 'video')) not null,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. ACTIVITY LOG (акыркы аракеттер — Dashboard үчүн)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.people enable row level security;
alter table public.person_media enable row level security;
alter table public.aid enable row level security;
alter table public.reports enable row level security;
alter table public.report_media enable row level security;
alter table public.activity_log enable row level security;

-- Бардык авторизацияланган колдонуучулар окуй алат (ички система болгондуктан)
create policy "Authenticated users can read profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read people" on public.people
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert people" on public.people
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update people" on public.people
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can read media" on public.person_media
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert media" on public.person_media
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read aid" on public.aid
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert aid" on public.aid
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update aid" on public.aid
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can read reports" on public.reports
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert reports" on public.reports
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read report_media" on public.report_media
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert report_media" on public.report_media
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read activity" on public.activity_log
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert activity" on public.activity_log
  for insert with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────
-- 8. STORAGE BUCKETS
-- Бул бөлүктү Dashboard → Storage аркылуу да түзсө болот.
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('person-photos', 'person-photos', true),
  ('person-videos', 'person-videos', true),
  ('report-media', 'report-media', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload photos" on storage.objects
  for insert with check (bucket_id = 'person-photos' and auth.role() = 'authenticated');
create policy "Anyone can view photos" on storage.objects
  for select using (bucket_id = 'person-photos');

create policy "Authenticated users can upload videos" on storage.objects
  for insert with check (bucket_id = 'person-videos' and auth.role() = 'authenticated');
create policy "Anyone can view videos" on storage.objects
  for select using (bucket_id = 'person-videos');

create policy "Authenticated users can upload report media" on storage.objects
  for insert with check (bucket_id = 'report-media' and auth.role() = 'authenticated');
create policy "Anyone can view report media" on storage.objects
  for select using (bucket_id = 'report-media');

-- ═══════════════════════════════════════════════════════════════════════════
-- ДАЯР! Эми .env.local файлыңызга Project URL жана anon key коюңуз.
-- ═══════════════════════════════════════════════════════════════════════════
