export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  category: string
  date: string
  note: string
}

export type BudgetMap = Record<string, number>

export const DEFAULT_CATEGORIES = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Housing',
  'Health',
  'Entertainment',
  'Shopping',
  'Other',
] as const

export const STORAGE_KEY = 'budgetpilot_v1'

export function toMonthKey(date: string): string {
  return date.slice(0, 7)
}
