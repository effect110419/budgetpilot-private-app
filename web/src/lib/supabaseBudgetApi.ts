import type { BudgetMap, Transaction } from '../data/budgetTypes'
import { getSupabase } from './supabase'

function num(v: unknown): number {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return Number(v)
  return 0
}

type TxRow = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: unknown
  category: string
  date: string
  note: string
}

export async function fetchCloudData(userId: string): Promise<{
  transactions: Transaction[]
  budgets: BudgetMap
}> {
  const sb = getSupabase()
  if (!sb) return { transactions: [], budgets: {} }

  const [txRes, budRes] = await Promise.all([
    sb.from('transactions').select('*').eq('user_id', userId),
    sb.from('budget_limits').select('*').eq('user_id', userId),
  ])

  if (txRes.error) throw txRes.error
  if (budRes.error) throw budRes.error

  const transactions: Transaction[] = (txRes.data as TxRow[] ?? []).map(
    (r) => ({
      id: r.id,
      type: r.type,
      amount: num(r.amount),
      category: r.category,
      date: r.date,
      note: r.note ?? '',
    }),
  )

  const budgets: BudgetMap = {}
  for (const row of budRes.data ?? []) {
    const r = row as { category: string; amount: unknown }
    budgets[r.category] = num(r.amount)
  }

  return { transactions, budgets }
}

export async function replaceCloudData(
  userId: string,
  transactions: Transaction[],
  budgets: BudgetMap,
): Promise<void> {
  const sb = getSupabase()
  if (!sb) return

  const txRows = transactions.map((t) => ({
    id: t.id,
    user_id: userId,
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date,
    note: t.note,
  }))

  const budRows = Object.entries(budgets).map(([category, amount]) => ({
    user_id: userId,
    category,
    amount,
  }))

  const { error: delTx } = await sb.from('transactions').delete().eq('user_id', userId)
  if (delTx) throw delTx

  const { error: delB } = await sb.from('budget_limits').delete().eq('user_id', userId)
  if (delB) throw delB

  if (txRows.length > 0) {
    const { error: insTx } = await sb.from('transactions').insert(txRows)
    if (insTx) throw insTx
  }

  if (budRows.length > 0) {
    const { error: insB } = await sb.from('budget_limits').insert(budRows)
    if (insB) throw insB
  }
}
