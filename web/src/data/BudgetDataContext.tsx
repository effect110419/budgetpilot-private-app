import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { FormEvent, ReactNode } from 'react'
import { monthMessageKey } from '../i18n/locales'
import { useI18n } from '../i18n/I18nProvider'
import type { BudgetMap, Transaction, TransactionType } from './budgetTypes'
import { DEFAULT_CATEGORIES, STORAGE_KEY, toMonthKey } from './budgetTypes'

let cachedStored: { transactions: Transaction[]; budgets: BudgetMap } | null = null

function getStoredSnapshot(): { transactions: Transaction[]; budgets: BudgetMap } {
  if (cachedStored) return cachedStored
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      cachedStored = { transactions: [], budgets: {} }
      return cachedStored
    }
    const parsed = JSON.parse(saved) as {
      transactions?: Transaction[]
      budgets?: BudgetMap
    }
    cachedStored = {
      transactions: parsed.transactions ?? [],
      budgets: parsed.budgets ?? {},
    }
    return cachedStored
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    cachedStored = { transactions: [], budgets: {} }
    return cachedStored
  }
}

function currency(value: number, locale: 'en' | 'ru'): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDisplayDate(iso: string, locale: 'en' | 'ru'): string {
  const parts = iso.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function useBudgetDataInner() {
  const { t, locale } = useI18n()
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = new Date().toISOString().slice(0, 7)

  const [transactions, setTransactions] = useState<Transaction[]>(
    () => getStoredSnapshot().transactions,
  )
  const [budgets, setBudgets] = useState<BudgetMap>(() => getStoredSnapshot().budgets)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [form, setForm] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: 'Food',
    date: today,
    note: '',
  })

  const yearOptions = useMemo(() => {
    const cy = new Date().getFullYear()
    return Array.from({ length: 14 }, (_, i) => cy - 5 + i)
  }, [])

  const selectedYear = selectedMonth.slice(0, 4)
  const selectedMonthPart = selectedMonth.slice(5, 7)
  const monthName = useMemo(
    () => t(monthMessageKey(Number(selectedMonthPart))),
    [t, selectedMonthPart],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, budgets }))
  }, [transactions, budgets])

  const monthTransactions = useMemo(
    () => transactions.filter((item) => toMonthKey(item.date) === selectedMonth),
    [transactions, selectedMonth],
  )

  const totalIncome = useMemo(
    () =>
      monthTransactions
        .filter((trx) => trx.type === 'income')
        .reduce((sum, trx) => sum + trx.amount, 0),
    [monthTransactions],
  )

  const totalExpense = useMemo(
    () =>
      monthTransactions
        .filter((trx) => trx.type === 'expense')
        .reduce((sum, trx) => sum + trx.amount, 0),
    [monthTransactions],
  )

  const balance = totalIncome - totalExpense

  const expensesByCategory = useMemo(() => {
    const result: Record<string, number> = {}
    monthTransactions
      .filter((item) => item.type === 'expense')
      .forEach((item) => {
        result[item.category] = (result[item.category] ?? 0) + item.amount
      })
    return Object.entries(result).sort((a, b) => b[1] - a[1])
  }, [monthTransactions])

  const handleAddTransaction = useCallback((event: FormEvent) => {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) return

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: form.type,
      amount,
      category: form.category.trim() || 'Other',
      date: form.date,
      note: form.note.trim(),
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setForm((prev) => ({ ...prev, amount: '', note: '' }))
  }, [form])

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleBudgetChange = useCallback((category: string, value: string) => {
    const amount = Number(value)
    setBudgets((prev) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: amount }
    })
  }, [])

  return {
    locale,
    t,
    yearOptions,
    selectedYear,
    selectedMonthPart,
    monthName,
    selectedMonth,
    setSelectedMonth,
    form,
    setForm,
    transactions,
    budgets,
    monthTransactions,
    totalIncome,
    totalExpense,
    balance,
    expensesByCategory,
    handleAddTransaction,
    handleDeleteTransaction,
    handleBudgetChange,
    currencyFmt: (v: number) => currency(v, locale),
    formatDate: (iso: string) => formatDisplayDate(iso, locale),
    defaultCategories: DEFAULT_CATEGORIES,
  }
}

type BudgetDataContextValue = ReturnType<typeof useBudgetDataInner>

const BudgetDataContext = createContext<BudgetDataContextValue | null>(null)

export function BudgetDataProvider({ children }: { children: ReactNode }) {
  const value = useBudgetDataInner()
  return (
    <BudgetDataContext.Provider value={value}>{children}</BudgetDataContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components -- hook paired with provider */
export function useBudgetData(): BudgetDataContextValue {
  const ctx = useContext(BudgetDataContext)
  if (!ctx) throw new Error('useBudgetData must be used within BudgetDataProvider')
  return ctx
}
