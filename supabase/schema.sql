-- =====================================================================
-- DjurHittaren – databasschema för Supabase (kör hela filen i SQL Editor)
-- Säkerhet: RLS på alla tabeller. Offentlig data nås bara via säkra funktioner.
-- Går att köra om (idempotent) – tabeller och data förstörs aldrig av en omkörning.
-- =====================================================================

create extension if not exists vector with schema extensions;

-- ---------- Profiler (offentligt användarnamn, inga personuppgifter) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9åäöÅÄÖ]{3,20}$'),
  paused boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists home_country text not null default 'SE' check (home_country in ('SE','ES'));
create unique index if not exists profiles_username_ci on public.profiles (lower(username));

create or replace function public.generate_username() returns text
language plpgsql set search_path = '' as $$
declare names text[] := array['Misse','Luna','Findus','Pelle','Molly','Bella','Tott','Saga','Ludde','Sixten'];
        n text;
begin
  loop
    n := names[1 + floor(random() * array_length(names, 1))::int] || (1000 + floor(random() * 9000))::int::text;
    exit when not exists (select 1 from public.profiles where lower(username) = lower(n));
  end loop;
  return n;
end $$;

-- Skapar profil automatiskt när ett konto skapas. Namnet kommer aldrig från e-post eller namn.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, home_country)
  values (new.id, public.generate_username(),
          case when upper(coalesce(new.raw_user_meta_data ->> 'home_country', '')) in ('SE','ES')
               then upper(new.raw_user_meta_data ->> 'home_country') else 'SE' end);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Djur ----------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  species text not null check (species in ('cat','dog','other')),
  breed text check (char_length(breed) <= 80),
  color text not null check (char_length(color) between 1 and 80),
  sex text not null default 'unknown' check (sex in ('f','m','unknown')),
  age_years int check (age_years between 0 and 40),
  marks text check (char_length(marks) <= 500),
  description text check (char_length(description) <= 2000),
  chip_number text check (char_length(chip_number) <= 40),   -- visas ALDRIG offentligt
  status text not null default 'registered' check (status in ('registered','lost','found')),
  created_at timestamptz not null default now()
);
create index if not exists pets_owner_idx on public.pets(owner_id);

create table if not exists public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  path text not null unique,              -- <användar-id>/<djur-id>/<fil>
  angle text not null default 'other' check (angle in ('front','left','right','other')),
  sort int not null default 0,
  content_hash text,
  embedding extensions.vector(3072),      -- förberett för AI-matchning (används inte än)
  created_at timestamptz not null default now()
);
create index if not exists pet_photos_pet_idx on public.pet_photos(pet_id);

-- ---------- Efterlysningar (anmälan om borttappat djur) ----------
create table if not exists public.lost_reports (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  last_place text not null check (char_length(last_place) between 1 and 120),
  last_city text not null check (char_length(last_city) between 1 and 120),
  lost_on date not null,
  circumstances text not null check (char_length(circumstances) between 1 and 1000),
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
alter table public.lost_reports add column if not exists country_code text not null default 'SE' check (country_code in ('SE','ES'));
create unique index if not exists lost_reports_one_active on public.lost_reports(pet_id) where status = 'active';
create index if not exists lost_reports_active_idx on public.lost_reports(status);

create or replace function public.lost_reports_validate() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.lost_on > current_date then raise exception 'Datumet får inte ligga i framtiden'; end if;
  return new;
end $$;
drop trigger if exists lost_reports_validate_trg on public.lost_reports;
create trigger lost_reports_validate_trg before insert or update of lost_on on public.lost_reports
  for each row execute function public.lost_reports_validate();

-- Status 'lost' kräver en aktiv anmälan. När djuret lämnar 'lost' arkiveras anmälan (tas bort publikt).
create or replace function public.pets_status_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'lost' and old.status is distinct from 'lost' then
    if not exists (select 1 from public.lost_reports where pet_id = new.id and status = 'active') then
      raise exception 'En anmälan med plats och datum krävs för att markera djuret som borttappat';
    end if;
  end if;
  if old.status = 'lost' and new.status <> 'lost' then
    update public.lost_reports set status = 'archived', archived_at = now()
      where pet_id = new.id and status = 'active';
  end if;
  return new;
end $$;
drop trigger if exists pets_status_guard_trg on public.pets;
create trigger pets_status_guard_trg before update of status on public.pets
  for each row execute function public.pets_status_guard();

-- ---------- Upphittarens privata fyndrapporter ----------
create table if not exists public.found_reports (
  id uuid primary key default gen_random_uuid(),
  finder_id uuid not null references public.profiles(id) on delete cascade,
  species text not null check (species in ('cat','dog','other')),
  place text not null check (char_length(place) between 1 and 120),
  description text check (char_length(description) <= 2000),
  photo_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------- Blockeringar, kontaktförfrågningar, meddelanden, notiser ----------
create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- Samtal ska överleva att djuret eller en användare raderas: pet_id/användare sätts till null.
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete set null,
  pet_name text not null,
  finder_id uuid references public.profiles(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  intro text not null check (char_length(intro) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending','accepted','declined','revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists contact_one_pending on public.contact_requests(pet_id, finder_id) where status = 'pending';
create index if not exists contact_finder_idx on public.contact_requests(finder_id);
create index if not exists contact_owner_idx on public.contact_requests(owner_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.contact_requests(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_request_idx on public.messages(request_id, created_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('request','accepted','declined','message')),
  request_id uuid references public.contact_requests(id) on delete cascade,
  pet_name text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

-- =====================================================================
-- RLS (radnivåsäkerhet) – på för ALLA tabeller
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.pet_photos enable row level security;
alter table public.lost_reports enable row level security;
alter table public.found_reports enable row level security;
alter table public.blocks enable row level security;
alter table public.contact_requests enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Börja från noll: ta bort alla rättigheter och ge bara det som behövs.
revoke all on all tables in schema public from anon, authenticated;

-- profiles: användarnamn är offentligt (inga personuppgifter finns i tabellen). Ändras bara via funktioner.
grant select (id, username) on public.profiles to anon, authenticated;
grant select (paused, home_country) on public.profiles to authenticated;
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);

-- pets: bara ägaren når tabellen (chipnummer får aldrig läcka). Publikt går via funktioner.
grant select, delete on public.pets to authenticated;
grant insert (owner_id, name, species, breed, color, sex, age_years, marks, description, chip_number) on public.pets to authenticated;
grant update (name, species, breed, color, sex, age_years, marks, description, chip_number, status) on public.pets to authenticated;
drop policy if exists pets_owner_select on public.pets;
drop policy if exists pets_owner_insert on public.pets;
drop policy if exists pets_owner_update on public.pets;
drop policy if exists pets_owner_delete on public.pets;
create policy pets_owner_select on public.pets for select to authenticated using (owner_id = (select auth.uid()));
create policy pets_owner_insert on public.pets for insert to authenticated with check (owner_id = (select auth.uid()));
create policy pets_owner_update on public.pets for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy pets_owner_delete on public.pets for delete to authenticated using (owner_id = (select auth.uid()));

-- pet_photos: ägaren hanterar sina; sökvägen måste börja med ägarens id
grant select, delete on public.pet_photos to authenticated;
grant insert (pet_id, path, angle, sort, content_hash) on public.pet_photos to authenticated;
grant update (angle, sort) on public.pet_photos to authenticated;
drop policy if exists photos_owner_select on public.pet_photos;
drop policy if exists photos_owner_insert on public.pet_photos;
drop policy if exists photos_owner_update on public.pet_photos;
drop policy if exists photos_owner_delete on public.pet_photos;
create policy photos_owner_select on public.pet_photos for select to authenticated
  using (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = (select auth.uid())));
create policy photos_owner_insert on public.pet_photos for insert to authenticated
  with check (path like (select auth.uid())::text || '/%'
    and exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = (select auth.uid())));
create policy photos_owner_update on public.pet_photos for update to authenticated
  using (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = (select auth.uid())));
create policy photos_owner_delete on public.pet_photos for delete to authenticated
  using (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = (select auth.uid())));

-- lost_reports: ägaren läser sina. Skapas/avslutas via funktionerna report_lost / mark_found.
grant select on public.lost_reports to authenticated;
drop policy if exists reports_owner_select on public.lost_reports;
create policy reports_owner_select on public.lost_reports for select to authenticated
  using (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = (select auth.uid())));

-- found_reports: privata för upphittaren
grant select, insert, delete on public.found_reports to authenticated;
drop policy if exists found_own_select on public.found_reports;
drop policy if exists found_own_insert on public.found_reports;
drop policy if exists found_own_delete on public.found_reports;
create policy found_own_select on public.found_reports for select to authenticated using (finder_id = (select auth.uid()));
create policy found_own_insert on public.found_reports for insert to authenticated with check (finder_id = (select auth.uid()));
create policy found_own_delete on public.found_reports for delete to authenticated using (finder_id = (select auth.uid()));

-- blocks: man ser bara sina egna. Skapas via block_user().
grant select on public.blocks to authenticated;
drop policy if exists blocks_own_select on public.blocks;
create policy blocks_own_select on public.blocks for select to authenticated using (blocker_id = (select auth.uid()));

-- contact_requests & messages: bara de två deltagarna kan läsa. Allt skrivande går via funktioner.
grant select on public.contact_requests to authenticated;
grant select on public.messages to authenticated;
drop policy if exists requests_participants_select on public.contact_requests;
create policy requests_participants_select on public.contact_requests for select to authenticated
  using ((select auth.uid()) in (finder_id, owner_id));
drop policy if exists messages_participants_select on public.messages;
create policy messages_participants_select on public.messages for select to authenticated
  using (exists (select 1 from public.contact_requests r
                 where r.id = request_id and (select auth.uid()) in (r.finder_id, r.owner_id)));

-- notifications: bara mottagaren; får bara markera som läst
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
drop policy if exists notif_own_select on public.notifications;
drop policy if exists notif_own_update on public.notifications;
create policy notif_own_select on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy notif_own_update on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- =====================================================================
-- Säkra funktioner (all validering sker här i databasen, aldrig i appen)
-- =====================================================================

-- Byt användarnamn (kräver att det är ledigt)
create or replace function public.change_username(new_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Inte inloggad'; end if;
  if new_name !~ '^[A-Za-z0-9åäöÅÄÖ]{3,20}$' then raise exception '3–20 tecken: bokstäver och siffror'; end if;
  begin
    update public.profiles set username = new_name where id = auth.uid();
  exception when unique_violation then
    raise exception 'Användarnamnet är upptaget';
  end;
end $$;

create or replace function public.set_paused(p_paused boolean) returns void
language sql security definer set search_path = '' as $$
  update public.profiles set paused = p_paused where id = auth.uid();
$$;

-- Funktioner vars parametrar eller svar ändrats tas bort först (så filen går att köra om)
drop function if exists public.report_lost(uuid, text, text, date, text);
drop function if exists public.get_lost_pets(int, int);
drop function if exists public.search_lost_pets(text, text, int, int);
drop function if exists public.get_lost_pet(uuid);
drop function if exists public.match_lost_pets(text, text, text, text);

-- Välj hemland (SE/ES). Visas bara för dig själv.
create or replace function public.set_home_country(p_country text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if upper(coalesce(p_country, '')) not in ('SE','ES') then raise exception 'Landet stöds inte'; end if;
  update public.profiles set home_country = upper(p_country) where id = auth.uid();
end $$;

-- Anmäl djur som borttappat (ägaren härleds från inloggningen, aldrig från klienten).
-- Platsens land (p_country) måste vara samma som landet enheten befinner sig i (p_device_country).
create or replace function public.report_lost(p_pet uuid, p_place text, p_city text, p_date date, p_circ text,
                                              p_country text, p_device_country text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.pets where id = p_pet and owner_id = auth.uid()) then
    raise exception 'Djuret finns inte eller är inte ditt';
  end if;
  if upper(coalesce(p_country, '')) not in ('SE','ES') then raise exception 'Landet stöds inte'; end if;
  if upper(p_country) is distinct from upper(coalesce(p_device_country, '')) then
    raise exception 'Platstjänster måste vara på och platsen måste ligga i landet där du befinner dig';
  end if;
  if (select count(*) from public.pet_photos where pet_id = p_pet) < 2 then
    raise exception 'Minst 2 foton krävs för att efterlysa djuret';
  end if;
  update public.lost_reports set status = 'archived', archived_at = now() where pet_id = p_pet and status = 'active';
  insert into public.lost_reports (pet_id, last_place, last_city, lost_on, circumstances, country_code)
    values (p_pet, trim(p_place), trim(p_city), p_date, trim(p_circ), upper(p_country));
  update public.pets set status = 'lost' where id = p_pet;
end $$;

-- Markera återfunnen: anmälan arkiveras, djuret försvinner från all publik sökning
create or replace function public.mark_found(p_pet uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.pets where id = p_pet and owner_id = auth.uid()) then
    raise exception 'Djuret finns inte eller är inte ditt';
  end if;
  update public.pets set status = 'found' where id = p_pet;
end $$;

-- Skicka kontaktförfrågan. Ägaren hämtas från djuret.
create or replace function public.create_contact_request(p_pet uuid, p_intro text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_owner uuid; v_name text; v_id uuid; v_intro text := trim(p_intro);
begin
  if auth.uid() is null then raise exception 'Inte inloggad'; end if;
  if char_length(v_intro) not between 1 and 2000 then raise exception 'Meddelandet måste vara 1–2000 tecken'; end if;
  select p.owner_id, p.name into v_owner, v_name
    from public.pets p join public.profiles pr on pr.id = p.owner_id
    where p.id = p_pet and p.status = 'lost' and not pr.paused;
  if v_owner is null then raise exception 'Djuret är inte längre efterlyst'; end if;
  if v_owner = auth.uid() then raise exception 'Det här är ditt eget djur'; end if;
  if exists (select 1 from public.blocks
             where (blocker_id = v_owner and blocked_id = auth.uid()) or (blocker_id = auth.uid() and blocked_id = v_owner)) then
    raise exception 'Du kan inte kontakta den här användaren';
  end if;
  if exists (select 1 from public.contact_requests where pet_id = p_pet and finder_id = auth.uid() and status = 'pending') then
    raise exception 'Du har redan en väntande förfrågan för det här djuret';
  end if;
  insert into public.contact_requests (pet_id, pet_name, finder_id, owner_id, intro)
    values (p_pet, v_name, auth.uid(), v_owner, v_intro) returning id into v_id;
  insert into public.notifications (user_id, type, request_id, pet_name) values (v_owner, 'request', v_id, v_name);
  return v_id;
end $$;

-- Ägaren accepterar eller avböjer
create or replace function public.respond_request(p_request uuid, p_accept boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare r public.contact_requests;
begin
  select * into r from public.contact_requests where id = p_request and owner_id = auth.uid() and status = 'pending' for update;
  if not found then raise exception 'Förfrågan finns inte eller är redan besvarad'; end if;
  update public.contact_requests set status = case when p_accept then 'accepted' else 'declined' end, updated_at = now() where id = p_request;
  if p_accept then
    insert into public.messages (request_id, sender_id, body, created_at) values (p_request, r.finder_id, r.intro, r.created_at);
  end if;
  if r.finder_id is not null then
    insert into public.notifications (user_id, type, request_id, pet_name)
      values (r.finder_id, case when p_accept then 'accepted' else 'declined' end, p_request, r.pet_name);
  end if;
end $$;

-- Upphittaren återkallar en väntande förfrågan
create or replace function public.revoke_request(p_request uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.contact_requests set status = 'revoked', updated_at = now()
    where id = p_request and finder_id = auth.uid() and status = 'pending';
  if not found then raise exception 'Förfrågan går inte att återkalla'; end if;
end $$;

-- Skicka meddelande (bara deltagare, bara i accepterade samtal, inte vid blockering)
create or replace function public.send_message(p_request uuid, p_body text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare r public.contact_requests; v_other uuid; v_id uuid; v_body text := trim(p_body);
begin
  if char_length(v_body) not between 1 and 2000 then raise exception 'Meddelandet måste vara 1–2000 tecken'; end if;
  select * into r from public.contact_requests where id = p_request and status = 'accepted' and auth.uid() in (finder_id, owner_id);
  if not found then raise exception 'Samtalet finns inte'; end if;
  v_other := case when r.finder_id = auth.uid() then r.owner_id else r.finder_id end;
  if v_other is null then raise exception 'Motparten finns inte längre'; end if;
  if exists (select 1 from public.blocks
             where (blocker_id = auth.uid() and blocked_id = v_other) or (blocker_id = v_other and blocked_id = auth.uid())) then
    raise exception 'Samtalet är blockerat';
  end if;
  insert into public.messages (request_id, sender_id, body) values (p_request, auth.uid(), v_body) returning id into v_id;
  insert into public.notifications (user_id, type, request_id, pet_name) values (v_other, 'message', p_request, r.pet_name);
  return v_id;
end $$;

create or replace function public.mark_read(p_request uuid) returns void
language sql security definer set search_path = '' as $$
  update public.messages m set read_at = now()
   where m.request_id = p_request and m.read_at is null and m.sender_id is distinct from auth.uid()
     and exists (select 1 from public.contact_requests r where r.id = p_request and auth.uid() in (r.finder_id, r.owner_id));
  update public.notifications set read_at = now()
   where request_id = p_request and user_id = auth.uid() and read_at is null;
$$;

-- Blockera motparten i ett samtal/en förfrågan (helt: inga fler meddelanden eller förfrågningar)
create or replace function public.block_user(p_request uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare v_other uuid;
begin
  select case when finder_id = auth.uid() then owner_id else finder_id end into v_other
    from public.contact_requests where id = p_request and auth.uid() in (finder_id, owner_id);
  if v_other is null then raise exception 'Samtalet finns inte'; end if;
  insert into public.blocks (blocker_id, blocked_id) values (auth.uid(), v_other) on conflict do nothing;
  update public.contact_requests set status = 'revoked', updated_at = now()
    where status = 'pending' and ((finder_id = v_other and owner_id = auth.uid()) or (finder_id = auth.uid() and owner_id = v_other));
end $$;

-- Radera mitt konto. Mina djur/foton/anmälningar försvinner. Samtal finns kvar för motparten
-- (visas som "Raderad användare") och tas bort helt när båda är borta.
-- OBS: appen ska ta bort användarens bildfiler via Storage-API:t innan den här anropas.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Inte inloggad'; end if;
  delete from auth.users where id = auth.uid();
  delete from public.contact_requests where finder_id is null and owner_id is null;
end $$;

-- ---------- Offentliga sökfunktioner: returnerar BARA tillåtna fält ----------
-- Ingen ägar-id, inget chipnummer, inga personuppgifter. Bara aktivt borttappade djur
-- vars ägare inte pausat kontot.
create or replace function public.get_lost_pets(p_limit int default 50, p_offset int default 0, p_country text default null)
returns table (id uuid, name text, species text, breed text, color text, sex text, age_years int, marks text,
               last_place text, last_city text, lost_on date, circumstances text, owner_username text, photo_paths text[], country_code text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.name, p.species, p.breed, p.color, p.sex, p.age_years, p.marks,
         r.last_place, r.last_city, r.lost_on, r.circumstances, pr.username,
         coalesce((select array_agg(ph.path order by ph.sort, ph.created_at) from public.pet_photos ph where ph.pet_id = p.id), '{}'),
         r.country_code
    from public.pets p
    join public.lost_reports r on r.pet_id = p.id and r.status = 'active'
    join public.profiles pr on pr.id = p.owner_id and not pr.paused
   where p.status = 'lost'
     and (nullif(p_country, '') is null or r.country_code = upper(p_country))
   order by r.lost_on desc, r.created_at desc
   limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
$$;

create or replace function public.search_lost_pets(p_query text default null, p_species text default null,
                                                   p_limit int default 50, p_offset int default 0,
                                                   p_country text default null)
returns table (id uuid, name text, species text, breed text, color text, sex text, age_years int, marks text,
               last_place text, last_city text, lost_on date, circumstances text, owner_username text, photo_paths text[], country_code text)
language sql stable security definer set search_path = '' as $$
  select g.* from public.get_lost_pets(100, 0, p_country) g
   where (p_species is null or p_species in ('', 'all') or g.species = p_species)
     and (nullif(trim(p_query), '') is null
          or position(lower(trim(p_query)) in lower(concat_ws(' ', g.name, g.breed, g.color, g.marks, g.last_place, g.last_city))) > 0)
   limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
$$;

create or replace function public.get_lost_pet(p_id uuid)
returns table (id uuid, name text, species text, breed text, color text, sex text, age_years int, marks text,
               last_place text, last_city text, lost_on date, circumstances text, owner_username text, photo_paths text[], country_code text)
language sql stable security definer set search_path = '' as $$
  select g.* from public.get_lost_pets(100, 0) g where g.id = p_id;
$$;

-- Upphittat-flödet: förfilter (borttappad + samma djurslag + område) och ordöverlappning.
-- p_scope: 'area' | 'city' | 'country'. Detta är INTE AI-bildmatchning.
create or replace function public.match_lost_pets(p_species text, p_place text, p_scope text default 'area', p_description text default '', p_country text default null)
returns table (id uuid, name text, species text, color text, marks text, last_place text, last_city text,
               lost_on date, owner_username text, photo_paths text[], score int, common text[])
language sql stable security definer set search_path = '' as $$
  with q as (
    select coalesce(array_agg(distinct w), '{}') as ws
      from unnest(regexp_split_to_array(lower(coalesce(p_description, '')), '[^a-zåäöé0-9]+')) w
     where char_length(w) > 2
  ), c as (
    select g.*,
           array(select distinct w from unnest(regexp_split_to_array(lower(concat_ws(' ', g.color, g.breed, g.marks)), '[^a-zåäöé0-9]+')) w
                  where array_position((select ws from q), w) is not null) as common_words
      from public.get_lost_pets(100, 0, p_country) g
     where g.species = p_species
       and g.lost_on <= current_date
       and (case coalesce(p_scope, 'area')
              when 'country' then true
              when 'city' then nullif(trim(p_place), '') is not null and
                   (position(lower(trim(p_place)) in lower(g.last_city)) > 0 or position(lower(g.last_city) in lower(trim(p_place))) > 0
                    or position(lower(trim(p_place)) in lower(g.last_place)) > 0 or position(lower(g.last_place) in lower(trim(p_place))) > 0)
              else nullif(trim(p_place), '') is not null and
                   (position(lower(trim(p_place)) in lower(g.last_place)) > 0 or position(lower(g.last_place) in lower(trim(p_place))) > 0)
            end)
  )
  select c.id, c.name, c.species, c.color, c.marks, c.last_place, c.last_city, c.lost_on, c.owner_username, c.photo_paths,
         cardinality(c.common_words), c.common_words
    from c order by cardinality(c.common_words) desc, c.lost_on desc limit 50;
$$;

-- Behörigheter för funktionerna: först ta bort allt, sedan ge bara det som behövs
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function public.get_lost_pets(int, int, text) to anon, authenticated;
grant execute on function public.search_lost_pets(text, text, int, int, text) to anon, authenticated;
grant execute on function public.get_lost_pet(uuid) to anon, authenticated;
grant execute on function public.match_lost_pets(text, text, text, text, text) to anon, authenticated;
grant execute on function public.change_username(text) to authenticated;
grant execute on function public.set_paused(boolean) to authenticated;
grant execute on function public.report_lost(uuid, text, text, date, text, text, text) to authenticated;
grant execute on function public.set_home_country(text) to authenticated;
grant execute on function public.mark_found(uuid) to authenticated;
grant execute on function public.create_contact_request(uuid, text) to authenticated;
grant execute on function public.respond_request(uuid, boolean) to authenticated;
grant execute on function public.revoke_request(uuid) to authenticated;
grant execute on function public.send_message(uuid, text) to authenticated;
grant execute on function public.mark_read(uuid) to authenticated;
grant execute on function public.block_user(uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- =====================================================================
-- Bildlagring: privat bucket "pet-photos", max 5 MB, bara bilder
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pet-photos', 'pet-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "pet-photos owner read" on storage.objects;
drop policy if exists "pet-photos owner write" on storage.objects;
drop policy if exists "pet-photos owner update" on storage.objects;
drop policy if exists "pet-photos owner delete" on storage.objects;
drop policy if exists "pet-photos public lost" on storage.objects;

-- Ägaren når bara filer under sin egen mapp (<användar-id>/...)
create policy "pet-photos owner read" on storage.objects for select to authenticated
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "pet-photos owner write" on storage.objects for insert to authenticated
  with check (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "pet-photos owner update" on storage.objects for update to authenticated
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "pet-photos owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Alla (även gäster) får läsa bilder, men bara för djur som just nu är borttappade
-- och vars ägare inte pausat kontot.
create or replace function public.photo_is_public(p_path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.pet_photos ph
      join public.pets p on p.id = ph.pet_id and p.status = 'lost'
      join public.profiles pr on pr.id = p.owner_id and not pr.paused
     where ph.path = p_path);
$$;
revoke all on function public.photo_is_public(text) from public;
grant execute on function public.photo_is_public(text) to anon, authenticated;
create policy "pet-photos public lost" on storage.objects for select to anon, authenticated
  using (bucket_id = 'pet-photos' and public.photo_is_public(name));

-- =====================================================================
-- Realtime: nya meddelanden, förfrågningar och notiser (RLS gäller även här)
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['messages','contact_requests','notifications'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
