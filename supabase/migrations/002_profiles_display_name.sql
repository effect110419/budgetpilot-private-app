-- Имя пользователя в профиле (синхронизируется с metadata при регистрации)

alter table public.profiles
  add column if not exists display_name text;

comment on column public.profiles.display_name is 'Отображаемое имя; пароли в эту таблицу не попадают (хранятся только хеши в auth.users).';

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
