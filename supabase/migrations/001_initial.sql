-- Монета / BudgetPilot — начальная схема для Supabase (PostgreSQL + RLS)
-- Выполните в Supabase: SQL Editor → New query → вставить → Run

-- Профиль пользователя (одна строка на auth.users). Пароли здесь не хранятся.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  created_at timestamptz not null default now()
);

-- Операции (доходы / расходы)
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

-- Лимиты бюджета по категории (как в приложении: одна сумма на категорию)
create table if not exists public.budget_limits (
  user_id uuid not null references auth.users on delete cascade,
  category text not null,
  amount numeric not null check (amount > 0),
  primary key (user_id, category)
);

-- Автопрофиль при регистрации
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

-- RLS
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budget_limits enable row level security;

create policy "profiles_own"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "transactions_own"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "budget_limits_own"
  on public.budget_limits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
