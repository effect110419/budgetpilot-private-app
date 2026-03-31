import type { User } from '@supabase/supabase-js'

/** Буквы (в т.ч. кириллица), цифры, пробел, дефис, подчёркивание; длина 2–40. */
export function validateUsername(raw: string): boolean {
  const s = raw.trim()
  if (s.length < 2 || s.length > 40) return false
  return /^[\p{L}\p{N}\s\-_]+$/u.test(s)
}

/** Значение для поля «имя» в кабинете: metadata или запасной вариант для поля. */
export function getDisplayNameForEdit(user: User | null): string {
  if (!user) return ''
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const raw =
    (typeof meta?.username === 'string' && meta.username.trim()) ||
    (typeof meta?.display_name === 'string' && meta.display_name.trim()) ||
    ''
  return raw || getDisplayName(user)
}

/** Показ в шапке: имя из metadata, иначе часть email до @. */
export function getDisplayName(user: User | null): string {
  if (!user) return ''
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fromMeta =
    (typeof meta?.username === 'string' && meta.username.trim()) ||
    (typeof meta?.display_name === 'string' && meta.display_name.trim()) ||
    ''
  if (fromMeta) return fromMeta
  const email = user.email ?? ''
  const at = email.indexOf('@')
  if (at > 0) return email.slice(0, at)
  return email
}
