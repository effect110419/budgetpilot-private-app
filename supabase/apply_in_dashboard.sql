-- BudgetPilot / Монета — применить в Supabase одним запуском
-- Dashboard → SQL Editor → New query → вставить весь файл → Run
-- Безопасно повторять: IF NOT EXISTS / OR REPLACE / DROP IF EXISTS где нужно

-- ——— profiles ———
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text;

alter table public.profiles
  add column if not exists age smallint;

alter table public.profiles
  add column if not exists settings jsonb not null default '{}'::jsonb;

comment on column public.profiles.display_name is 'Отображаемое имя; пароли здесь не хранятся.';
comment on column public.profiles.settings is 'Произвольные настройки UI/уведомлений (запас под будущее).';

-- ——— transactions ———
create table if not exists public.transactions (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  category text not null,
  date text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_user_date_idx on public.transactions (user_id, date);

-- ——— Постоянные доходы (день месяца 1–31; в коротких месяцах дата сдвигается при начислении) ———
create table if not exists public.recurring_incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  amount numeric not null check (amount > 0),
  category text not null,
  day_of_month int not null check (day_of_month >= 1 and day_of_month <= 31),
  note text not null default '',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists recurring_incomes_user_idx on public.recurring_incomes (user_id);

-- Существующие проекты: ослабить ограничение 1–28 → 1–31
do $$
declare
  r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'recurring_incomes'
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) like '%day_of_month%'
  loop
    execute format('alter table public.recurring_incomes drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.recurring_incomes
  drop constraint if exists recurring_incomes_day_of_month_check;

alter table public.recurring_incomes
  add constraint recurring_incomes_day_of_month_check
  check (day_of_month >= 1 and day_of_month <= 31);

-- ——— budget_limits ———
create table if not exists public.budget_limits (
  user_id uuid not null references auth.users on delete cascade,
  category text not null,
  amount numeric not null check (amount > 0),
  primary key (user_id, category)
);

-- ——— триггер нового пользователя ———
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := nullif(trim(coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name',
    ''
  )), '');
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, v_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ——— RLS ———
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budget_limits enable row level security;
alter table public.recurring_incomes enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "transactions_own" on public.transactions;
create policy "transactions_own"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "budget_limits_own" on public.budget_limits;
create policy "budget_limits_own"
  on public.budget_limits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "recurring_incomes_own" on public.recurring_incomes;
create policy "recurring_incomes_own"
  on public.recurring_incomes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
