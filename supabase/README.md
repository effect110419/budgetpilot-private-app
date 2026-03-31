# Supabase: как применить схему

## Вариант 1 — через веб-интерфейс (проще всего)

1. Открой [Supabase Dashboard](https://supabase.com/dashboard) → свой проект.
2. Слева **SQL Editor** → **New query**.
3. Скопируй **весь** файл [`apply_in_dashboard.sql`](./apply_in_dashboard.sql) из этой папки репозитория и вставь в редактор.
4. Нажми **Run** (или Ctrl+Enter).
5. Должно быть **Success**. Если какая-то часть уже была применена раньше, повторный запуск всё равно должен пройти за счёт `IF NOT EXISTS` и `DROP POLICY IF EXISTS`.

Отдельные файлы в `migrations/` — это те же шаги по частям (`001_initial.sql`, затем при необходимости `002_...`); для одного полного прогона удобнее **`apply_in_dashboard.sql`**.

## Вариант 2 — Supabase CLI

Если проект связан с CLI (`supabase link`), можно использовать локальные миграции и `supabase db push` — см. [документацию Supabase CLI](https://supabase.com/docs/guides/cli).

## Важно

- Пароли пользователей **не** попадают в `public.profiles` и ваши таблицы; они хранятся в сервисе Auth (`auth.users`) в виде хешей.
- После изменения схемы приложение уже может писать в `transactions`, `budget_limits`, обновлять `profiles.display_name` с клиента при включённом RLS.
