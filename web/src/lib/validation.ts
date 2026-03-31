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
