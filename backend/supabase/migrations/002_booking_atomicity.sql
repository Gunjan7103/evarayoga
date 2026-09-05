-- Production hardening migration

-- Atomic booking creation prevents overbooking under concurrent requests.
create or replace function public.create_booking(
  p_schedule_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text default null,
  p_notes text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_schedule public.class_schedules;
  v_booking public.bookings;
begin
  select *
    into v_schedule
  from public.class_schedules
  where id = p_schedule_id
    and status = 'open'
    and starts_at > now()
  for update;

  if not found then
    raise exception 'Schedule is unavailable';
  end if;

  if v_schedule.booked_count >= v_schedule.capacity then
    raise exception 'This session is full';
  end if;

  insert into public.bookings (
    schedule_id,
    customer_name,
    email,
    phone,
    notes,
    status
  )
  values (
    p_schedule_id,
    btrim(p_customer_name),
    lower(btrim(p_email)),
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_notes), ''),
    'pending'
  )
  returning * into v_booking;

  update public.class_schedules
  set booked_count = booked_count + 1
  where id = p_schedule_id;

  return v_booking;
end;
$$;

revoke all on function public.create_booking(uuid,text,text,text,text) from public;
grant execute on function public.create_booking(uuid,text,text,text,text) to service_role;

-- Keep booked_count consistent when an existing booking is cancelled.
create or replace function public.sync_booking_capacity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and old.status <> 'cancelled'
     and new.status = 'cancelled' then
    update public.class_schedules
    set booked_count = greatest(booked_count - 1, 0)
    where id = new.schedule_id;
  end if;

  return new;
end;
$$;

drop trigger if exists booking_capacity_sync on public.bookings;
create trigger booking_capacity_sync
after update of status on public.bookings
for each row
execute function public.sync_booking_capacity();

create unique index if not exists idx_bookings_active_email_schedule
on public.bookings(schedule_id, lower(email))
where status in ('pending','confirmed');

create index if not exists idx_schedules_available
on public.class_schedules(status, starts_at)
where status = 'open';

-- Public RPC execution is intentionally blocked; the API uses the service role.
revoke all on function public.create_booking(uuid,text,text,text,text) from anon, authenticated;
