import type { Transaction } from '../data/budgetTypes'
import { toMonthKey } from '../data/budgetTypes'
import type { RecurringIncomeRow } from './accountsApi'

function todayLocalIso(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function lastDayOfMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate()
}

/**
 * Добавляет недостающие доходы по правилам (пометка note = recurring:<id>).
 * Для выбранного месяца YYYY-MM; не создаёт даты в будущем относительно todayStr.
 */
export function injectRecurringTransactions(
  txs: Transaction[],
  rules: RecurringIncomeRow[],
  monthKey: string,
  todayStr: string = todayLocalIso(),
): Transaction[] {
  const y = Number(monthKey.slice(0, 4))
  const m = Number(monthKey.slice(5, 7))
  if (!y || !m) return txs

  if (monthKey > todayStr.slice(0, 7)) return txs

  const last = lastDayOfMonth(y, m)
  const out = [...txs]

  for (const r of rules) {
    if (!r.enabled) continue
    const day = Math.min(Math.max(1, r.day_of_month), last)
    const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`
    if (dateStr > todayStr) continue

    const tag = `recurring:${r.id}`
    const exists = out.some(
      (t) =>
        t.type === 'income' &&
        t.note === tag &&
        toMonthKey(t.date) === monthKey,
    )
    if (exists) continue

    out.unshift({
      id: crypto.randomUUID(),
      type: 'income',
      amount: Number(r.amount),
      category: r.category,
      date: dateStr,
      note: tag,
    })
  }

  return out
}
