/** Максимум суммы в ₽ (лимиты бюджета, операции, постоянные доходы). */
export const MAX_MONEY_AMOUNT = 1_000_000_000

/** Макс. длина заметки к операции (символы без управляющих). */
export const NOTE_MAX_LENGTH = 200

/**
 * Парсит сумму из строки (запятая или точка — дробная часть, копейки).
 * Пусто / мусор → NaN. Округление до 2 знаков.
 */
export function parseMoneyInput(raw: string): number {
  const s = raw.trim().replace(/\s/g, '')
  if (s === '') return NaN
  const normalized = s.replace(',', '.')
  const parts = normalized.split('.')
  if (parts.length > 2) return NaN
  const n = Number(normalized)
  if (!Number.isFinite(n)) return NaN
  return Math.round(n * 100) / 100
}

/** Ограничивает сумму допустимым диапазоном и копейками; для невалидного — 0. */
export function clampMoneyAmount(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0
  const rounded = Math.round(n * 100) / 100
  return Math.min(rounded, MAX_MONEY_AMOUNT)
}

/** Убирает управляющие символы и обрезает до лимита. */
export function sanitizeNote(raw: string): string {
  // eslint-disable-next-line no-control-regex -- намеренно удаляем C0 + DEL
  return raw.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, NOTE_MAX_LENGTH)
}

/** Простая проверка формата email (без полного RFC). */
export function validateEmailFormat(email: string): boolean {
  const s = email.trim()
  if (s.length < 5 || s.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

/** Пароль для регистрации: латиница + цифры + типичные символы; ≥8; заглавная, строчная, цифра. */
export function validatePasswordSignup(password: string): {
  ok: boolean
  reason: 'short' | 'charset' | 'upper' | 'lower' | 'digit' | 'ok'
} {
  if (password.length < 8) return { ok: false, reason: 'short' }
  if (!/^[\x21-\x7E]+$/.test(password)) return { ok: false, reason: 'charset' }
  if (!/[A-Z]/.test(password)) return { ok: false, reason: 'upper' }
  if (!/[a-z]/.test(password)) return { ok: false, reason: 'lower' }
  if (!/[0-9]/.test(password)) return { ok: false, reason: 'digit' }
  return { ok: true, reason: 'ok' }
}
