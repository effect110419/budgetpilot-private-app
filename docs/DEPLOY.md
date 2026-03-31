# Публикация BudgetPilot (бесплатно)

Подойдёт **Vercel** или **Netlify** — статическая сборка Vite (`web/dist`).

## Перед деплоем

1. Код должен быть в **Git** (GitHub/GitLab/Bitbucket) и запушен в удалённый репозиторий.
2. Локально проверка: `cd web` → `npm install` → `npm run build` — без ошибок.

## Vercel (рекомендуется)

### Через сайт (Git)

1. Зарегистрируйся на [vercel.com](https://vercel.com) и подключи аккаунт Git (GitHub и т.д.).
2. **Add New… → Project** → **Import** свой репозиторий `budgetpilot`.
3. В настройках проекта задай:
   - **Root Directory**: `web` (важно: не корень монорепозитория).
   - **Framework Preset**: Vite (или Other).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (по умолчанию)
4. **Environment Variables** → для окружения **Production** (и при желании Preview):
   - `VITE_SUPABASE_URL` = URL из Supabase → Project Settings → API → Project URL (`https://xxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = **anon / public** ключ (не service_role)
5. Нажми **Deploy**. После сборки открой **Visit** — должен открыться фронт. Без переменных приложение работает в режиме «только локально в браузере»; с переменными — вход и синхронизация с Supabase.
6. После любого изменения env сделай **Redeploy** (Deployments → … → Redeploy).

В репозитории уже есть `web/vercel.json` с SPA-fallback для React Router.

### Через CLI (без привязки к Git, для быстрого теста)

```bash
cd web
npm install
npx vercel login
npx vercel
```

На вопросы: root = текущая папка `web`, build = `npm run build`, output = `dist`. Затем `npx vercel --prod` для продакшена. Переменные окружения задай в [Vercel Dashboard](https://vercel.com) → Project → Settings → Environment Variables, потом снова deploy.

## Netlify

1. [netlify.com](https://netlify.com) → Add new site → Import from Git.
2. Base directory: `web`, build: `npm run build`, publish: `web/dist`.
3. Добавь те же переменные `VITE_*` в Site settings → Environment variables.
4. В **Redirects** добавь SPA-правило: `/*` → `/index.html` (200). Либо положи в `web` файл `public/_redirects` с строкой `/* /index.html 200` (если используешь Netlify).

## Важно

- Секретный ключ Supabase (**service_role**) в клиент **не** вставляй — только **anon/publishable**.
- После смены env на Vercel нужен **redeploy**.
- Переменные `VITE_SUPABASE_*` должны быть заданы **до сборки**: без них вход в аккаунт и синхронизация не работают (Vite подставляет env на этапе `npm run build`). После добавления переменных сделай **Redeploy**.
