import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { monthMessageKey } from '../i18n/locales'
import { useI18n } from '../i18n/I18nProvider'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchRecurringIncomes } from '../lib/accountsApi'
import { injectRecurringTransactions } from '../lib/recurringIncome'
import { fetchCloudData, replaceCloudData } from '../lib/supabaseBudgetApi'
import {
  coerceCategoryForType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  STORAGE_KEY,
  toMonthKey,
  type BudgetMap,
  type Transaction,
  type TransactionType,
} from './budgetTypes'

let cachedStored: { transactions: Transaction[]; budgets: BudgetMap } | null = null

function invalidateLocalCache() {
  cachedStored = null
}

function normalizeTransactions(list: Transaction[]): Transaction[] {
  return list.map((tr) => ({
    ...tr,
    category: coerceCategoryForType(tr.type, tr.category),
  }))
}

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

type DataSource = 'local' | 'cloud'

function useBudgetDataInner() {
  const { t, locale } = useI18n()
  const auth = useAuth()
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = new Date().toISOString().slice(0, 7)

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    normalizeTransactions(getStoredSnapshot().transactions),
  )
  const [budgets, setBudgets] = useState<BudgetMap>(() => getStoredSnapshot().budgets)
  const [dataSource, setDataSource] = useState<DataSource>('local')

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

  /* Стабильный id в deps: объект auth.user от Supabase часто меняет ссылку при refresh токена — иначе эффекты крутятся заново и всё «тормозит». */
  useEffect(() => {
    if (auth.loading) return
    if (!isSupabaseConfigured) return
    if (auth.user) return
    invalidateLocalCache()
    setTransactions(normalizeTransactions(getStoredSnapshot().transactions))
    setBudgets(getStoredSnapshot().budgets)
    setDataSource('local')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auth.user часто новая ссылка при refresh токена
  }, [auth.loading, auth.user?.id])

  useEffect(() => {
    if (auth.loading || !isSupabaseConfigured || !auth.user) return
    let cancelled = false
    ;(async () => {
      try {
        let { transactions: remoteTx, budgets: remoteBud } = await fetchCloudData(
          auth.user!.id,
        )
        if (cancelled) return
        if (remoteTx.length === 0) {
          const snap = getStoredSnapshot()
          if (snap.transactions.length > 0 || Object.keys(snap.budgets).length > 0) {
            const normTx = normalizeTransactions(snap.transactions)
            await replaceCloudData(auth.user!.id, normTx, snap.budgets)
            const again = await fetchCloudData(auth.user!.id)
            remoteTx = again.transactions
            remoteBud = again.budgets
          }
        }
        if (cancelled) return
        setTransactions(normalizeTransactions(remoteTx))
        setBudgets(remoteBud)
        setDataSource('cloud')
      } catch (e) {
        console.error('Cloud load failed', e)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. комментарий у первого эффекта (id вместо user)
  }, [auth.loading, auth.user?.id])

  useEffect(() => {
    if (auth.loading || !isSupabaseConfigured || !auth.user) return
    if (dataSource !== 'cloud') return
    let cancelled = false
    ;(async () => {
      try {
        const rules = await fetchRecurringIncomes(auth.user!.id)
        if (cancelled) return
        setTransactions((prev) =>
          injectRecurringTransactions(prev, rules, selectedMonth),
        )
      } catch (e) {
        console.error('Recurring income merge failed', e)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. комментарий у первого эффекта (id вместо user)
  }, [auth.loading, auth.user?.id, dataSource, selectedMonth])

  useEffect(() => {
    if (dataSource !== 'cloud' || !auth.user) return
    const run = () => {
      fetchRecurringIncomes(auth.user!.id)
        .then((rules) => {
          setTransactions((prev) =>
            injectRecurringTransactions(prev, rules, selectedMonth),
          )
        })
        .catch((e) => console.error('recurring refresh', e))
    }
    window.addEventListener('budgetpilot:recurring-changed', run)
    return () => window.removeEventListener('budgetpilot:recurring-changed', run)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. комментарий у первого эффекта (id вместо user)
  }, [dataSource, auth.user?.id, selectedMonth])

  useEffect(() => {
    if (dataSource !== 'local') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, budgets }))
  }, [transactions, budgets, dataSource])

  useEffect(() => {
    if (dataSource !== 'cloud' || !auth.user) return
    const tmr = setTimeout(() => {
      replaceCloudData(auth.user!.id, transactions, budgets).catch((e) =>
        console.error('Cloud save failed', e),
      )
    }, 800)
    return () => clearTimeout(tmr)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. комментарий у первого эффекта (id вместо user)
  }, [transactions, budgets, dataSource, auth.user?.id])

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

  const incomesByCategory = useMemo(() => {
    const result: Record<string, number> = {}
    monthTransactions
      .filter((item) => item.type === 'income')
      .forEach((item) => {
        result[item.category] = (result[item.category] ?? 0) + item.amount
      })
    return Object.entries(result).sort((a, b) => b[1] - a[1])
  }, [monthTransactions])

  /** Expense categories where limit is set and spent exceeds it (selected month). */
  const overBudgetCategories = useMemo(() => {
    const out: { category: string; spent: number; limit: number }[] = []
    for (const category of EXPENSE_CATEGORIES) {
      const spent =
        expensesByCategory.find(([name]) => name === category)?.[1] ?? 0
      const limit = budgets[category] ?? 0
      if (limit > 0 && spent > limit) {
        out.push({ category, spent, limit })
      }
    }
    return out
  }, [expensesByCategory, budgets])

  const createTransaction = useCallback((payload: Omit<Transaction, 'id'>) => {
    const category = coerceCategoryForType(payload.type, payload.category.trim())
    setTransactions((prev) => [
      { ...payload, id: crypto.randomUUID(), category },
      ...prev,
    ])
  }, [])

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
      setTransactions((prev) =>
        prev.map((tr) => {
          if (tr.id !== id) return tr
          const merged = { ...tr, ...patch }
          merged.category = coerceCategoryForType(merged.type, merged.category.trim())
          return merged
        }),
      )
    },
    [],
  )

  const handleAddTransaction = useCallback((event: FormEvent) => {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) return

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: form.type,
      amount,
      category: coerceCategoryForType(form.type, form.category.trim()),
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
    incomesByCategory,
    overBudgetCategories,
    createTransaction,
    updateTransaction,
    handleAddTransaction,
    handleDeleteTransaction,
    handleBudgetChange,
    currencyFmt: (v: number) => currency(v, locale),
    formatDate: (iso: string) => formatDisplayDate(iso, locale),
    incomeCategories: INCOME_CATEGORIES,
    expenseCategories: EXPENSE_CATEGORIES,
    dataSource,
    /** Пользователь вошёл и облако настроено (данные уходят в Supabase). */
    cloudSyncActive: Boolean(auth.user && isSupabaseConfigured),
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
