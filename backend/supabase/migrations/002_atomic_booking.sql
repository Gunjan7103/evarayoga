-- Atomic booking workflow and seat-count integrity.
-- Apply after 001_initial_schema.sql.

create or replace function public.create_booking(
  p_schedule_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text default null,
  p_notes text default null
)
returns table(id uuid, status public.booking_status, created_at timestamptz)
language plpgsql
security definer
set search_path=public
as $$
declare
  v_schedule public.class_schedules%rowtype;
  v_booking public.bookings%rowtype;
begin
  select * into v_schedule from public.class_schedules where id=p_schedule_id for update;
  if not found then raise exception 'Schedule not found' using errcode='P0001'; end if;
  if v_schedule.status <> 'open' or v_schedule.starts_at <= now() then
    raise exception 'This session is unavailable' using errcode='P0001';
  end if;
  if v_schedule.booked_count >= v_schedule.capacity then
    raise exception 'This session is full' using errcode='P0001';
  end if;

  insert into public.bookings(schedule_id,customer_name,email,phone,notes,status)
  values(p_schedule_id,p_customer_name,lower(trim(p_email)),nullif(trim(p_phone),''),nullif(trim(p_notes),''),'pending')
  returning * into v_booking;

  update public.class_schedules set booked_count=booked_count+1 where id=p_schedule_id;
  return query select v_booking.id,v_booking.status,v_booking.created_at;
end;
$$;

revoke all on function public.create_booking(uuid,text,text,text,text) from public;

create or replace function public.sync_schedule_booking_count()
returns trigger
language plpgsql
set search_path=public
as $$
begin
  if tg_op='UPDATE' then
    if old.status <> 'cancelled' and new.status='cancelled' then
      update public.class_schedules set booked_count=greatest(booked_count-1,0) where id=new.schedule_id;
    elsif old.status='cancelled' and new.status <> 'cancelled' then
      perform 1 from public.class_schedules where id=new.schedule_id for update;
      if not found then raise exception 'Schedule not found'; end if;
      if (select booked_count from public.class_schedules where id=new.schedule_id) >=
         (select capacity from public.class_schedules where id=new.schedule_id) then
        raise exception 'Cannot reactivate booking: session is full' using errcode='P0001';
      end if;
      update public.class_schedules set booked_count=booked_count+1 where id=new.schedule_id;
    end if;
    return new;
  elsif tg_op='DELETE' then
    if old.status <> 'cancelled' then
      update public.class_schedules set booked_count=greatest(booked_count-1,0) where id=old.schedule_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_sync_schedule_booking_count on public.bookings;
create trigger trg_sync_schedule_booking_count
after update of status or delete on public.bookings
for each row execute function public.sync_schedule_booking_count();

update public.class_schedules s
set booked_count=(
  select count(*) from public.bookings b
  where b.schedule_id=s.id and b.status <> 'cancelled'
);
