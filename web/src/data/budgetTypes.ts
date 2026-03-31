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

/** Categories for income only — logical names, stored as English ids */
export const INCOME_CATEGORIES = [
  'Salary',
  'Bonus',
  'Freelance',
  'Business',
  'Investments',
  'Gifts',
  'Refunds',
  'Other',
] as const

/** Categories for expenses only — separate from income */
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Health',
  'Entertainment',
  'Shopping',
  'Subscriptions',
  'Other',
] as const

export type IncomeCategoryId = (typeof INCOME_CATEGORIES)[number]
export type ExpenseCategoryId = (typeof EXPENSE_CATEGORIES)[number]

export function categoriesForType(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function defaultCategoryForType(type: TransactionType): string {
  return type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
}

/**
 * If category does not belong to this type (e.g. expense category on income from old data),
 * use "Other" so amounts are not merged into Salary/Food by mistake.
 */
export function coerceCategoryForType(type: TransactionType, stored: string): string {
  const allowed = categoriesForType(type)
  const trimmed = stored.trim()
  if (allowed.includes(trimmed)) return trimmed
  return 'Other'
}

export const STORAGE_KEY = 'budgetpilot_v1'

export function toMonthKey(date: string): string {
  return date.slice(0, 7)
}
