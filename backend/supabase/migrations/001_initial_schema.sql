create extension if not exists pgcrypto;
create type public.user_role as enum ('admin','instructor');
create type public.booking_status as enum ('pending','confirmed','cancelled','completed');
create type public.schedule_status as enum ('open','closed','cancelled');
create type public.message_status as enum ('unread','read','replied');

create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,name text not null,email text not null unique,phone text,role public.user_role not null default 'instructor',created_at timestamptz not null default now());
create table public.instructors(id uuid primary key default gen_random_uuid(),profile_id uuid references public.profiles(id) on delete set null,name text not null,bio text,experience text,skills text[] not null default '{}',image_url text,active boolean not null default true,created_at timestamptz not null default now());
create table public.classes(id uuid primary key default gen_random_uuid(),instructor_id uuid references public.instructors(id) on delete set null,title text not null,description text,duration_minutes integer not null default 60 check(duration_minutes>0),capacity integer not null default 10 check(capacity>0),price numeric(10,2) not null default 0 check(price>=0),active boolean not null default true,created_at timestamptz not null default now());
create table public.class_schedules(id uuid primary key default gen_random_uuid(),class_id uuid not null references public.classes(id) on delete cascade,starts_at timestamptz not null,ends_at timestamptz not null,capacity integer not null,booked_count integer not null default 0 check(booked_count>=0),status public.schedule_status not null default 'open',created_at timestamptz not null default now(),check(ends_at>starts_at),check(booked_count<=capacity));
create table public.bookings(id uuid primary key default gen_random_uuid(),schedule_id uuid not null references public.class_schedules(id) on delete restrict,customer_name text not null,email text not null,phone text,notes text,status public.booking_status not null default 'pending',created_at timestamptz not null default now());
create table public.contact_messages(id uuid primary key default gen_random_uuid(),name text not null,email text not null,phone text,message text not null,status public.message_status not null default 'unread',created_at timestamptz not null default now());
create table public.testimonials(id uuid primary key default gen_random_uuid(),customer_name text not null,content text not null,rating integer not null default 5 check(rating between 1 and 5),image_url text,published boolean not null default false,created_at timestamptz not null default now());

create index idx_classes_active on public.classes(active);
create index idx_instructors_active on public.instructors(active);
create index idx_schedules_starts_at on public.class_schedules(starts_at);
create index idx_bookings_schedule_id on public.bookings(schedule_id);
create index idx_bookings_status on public.bookings(status);
create index idx_contact_status on public.contact_messages(status);
create index idx_testimonials_published on public.testimonials(published);

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.classes enable row level security;
alter table public.class_schedules enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.testimonials enable row level security;

create policy "public can read active instructors" on public.instructors for select using(active=true);
create policy "public can read active classes" on public.classes for select using(active=true);
create policy "public can read open schedules" on public.class_schedules for select using(status='open' and starts_at>now());
create policy "public can read published testimonials" on public.testimonials for select using(published=true);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

create policy "admins manage instructors" on public.instructors for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage classes" on public.classes for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage schedules" on public.class_schedules for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage bookings" on public.bookings for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage contact" on public.contact_messages for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage testimonials" on public.testimonials for all using(public.is_admin()) with check(public.is_admin());
