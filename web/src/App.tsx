import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  LOCALE_OPTIONS,
  categoryLabel,
  monthMessageKey,
  type Locale,
} from './i18n/locales'
import { useI18n } from './i18n/I18nProvider'
import { useTheme } from './theme/ThemeProvider'

type TransactionType = 'income' | 'expense'

type Transaction = {
  id: string
  type: TransactionType
  amount: number
  category: string
  date: string
  note: string
}

type BudgetMap = Record<string, number>

const DEFAULT_CATEGORIES = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Housing',
  'Health',
  'Entertainment',
  'Shopping',
  'Other',
]

const STORAGE_KEY = 'budgetpilot_v1'

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

function toMonthKey(date: string): string {
  return date.slice(0, 7)
}

function currency(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDisplayDate(iso: string, locale: Locale): string {
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

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function App() {
  const { locale, setLocale, t } = useI18n()
  const { theme, toggleTheme } = useTheme()
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

  const handleAddTransaction = (event: FormEvent) => {
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
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }

  const handleBudgetChange = (category: string, value: string) => {
    const amount = Number(value)
    setBudgets((prev) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: amount }
    })
  }

  return (
    <main className="app">
      <header className="top">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="tagline">{t('appTagline')}</p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t('themeToggle')}
            title={theme === 'light' ? t('themeDark') : t('themeLight')}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <label className="field-stack">
            <span>{t('language')}</span>
            <select
              className="select-input"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t('language')}
            >
              {LOCALE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <div className="month-picker-group" role="group" aria-label={t('monthLabel')}>
            <label className="field-stack">
              <span>{t('monthLabel')}</span>
              <select
                className="select-input"
                value={selectedMonthPart}
                onChange={(e) =>
                  setSelectedMonth(`${selectedYear}-${e.target.value}`)
                }
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                  const v = String(m).padStart(2, '0')
                  return (
                    <option key={m} value={v}>
                      {t(monthMessageKey(m))}
                    </option>
                  )
                })}
              </select>
            </label>
            <label className="field-stack">
              <span>{t('yearLabel')}</span>
              <select
                className="select-input"
                value={selectedYear}
                onChange={(e) =>
                  setSelectedMonth(`${e.target.value}-${selectedMonthPart}`)
                }
              >
                {yearOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <section className="cards">
        <article className="card">
          <h2>{t('summaryIncome')}</h2>
          <strong className="ok">{currency(totalIncome, locale)}</strong>
        </article>
        <article className="card">
          <h2>{t('summaryExpenses')}</h2>
          <strong className="danger">{currency(totalExpense, locale)}</strong>
        </article>
        <article className="card">
          <h2>{t('summaryBalance')}</h2>
          <strong className={balance >= 0 ? 'ok' : 'danger'}>
            {currency(balance, locale)}
          </strong>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <div className="panel-header">
            <h2>{t('addTransaction')}</h2>
          </div>
          <form className="form" onSubmit={handleAddTransaction}>
            <label>
              {t('type')}
              <select
                className="select-input"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value as TransactionType }))
                }
              >
                <option value="expense">{t('typeExpense')}</option>
                <option value="income">{t('typeIncome')}</option>
              </select>
            </label>

            <label>
              {t('amount')}
              <input
                type="number"
                min="1"
                step="1"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="5000"
                required
              />
            </label>

            <label>
              {t('category')}
              <select
                className="select-input"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              >
                {DEFAULT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {categoryLabel(item, t)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t('date')}
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </label>

            <label>
              {t('note')}
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={t('optional')}
              />
            </label>

            <button type="submit">{t('saveTransaction')}</button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>{t('categoryBudgets')}</h2>
            <p className="muted">{t('categoryBudgetsHint')}</p>
          </div>
          <div className="budget-list">
            {DEFAULT_CATEGORIES.filter((item) => item !== 'Salary' && item !== 'Freelance').map(
              (category) => {
                const spent = expensesByCategory.find(([name]) => name === category)?.[1] ?? 0
                const limit = budgets[category] ?? 0
                const ratio = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                return (
                  <div className="budget-row" key={category}>
                    <div className="budget-head">
                      <span>{categoryLabel(category, t)}</span>
                      <small>
                        {currency(spent, locale)} /{' '}
                        {limit > 0 ? currency(limit, locale) : t('noLimit')}
                      </small>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={limit || ''}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      placeholder={t('setLimit')}
                    />
                    <div className="progress">
                      <div style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <div className="panel-header">
            <h2>{t('expenseAnalytics')}</h2>
          </div>
          {expensesByCategory.length === 0 ? (
            <p className="muted">{t('noExpensesMonth')}</p>
          ) : (
            <ul className="analytics">
              {expensesByCategory.map(([name, value]) => (
                <li key={name}>
                  <span>{categoryLabel(name, t)}</span>
                  <strong>{currency(value, locale)}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>{t('transactions')}</h2>
          </div>
          {monthTransactions.length === 0 ? (
            <p className="muted">{t('noTransactionsMonth')}</p>
          ) : (
            <ul className="transactions">
              {monthTransactions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{categoryLabel(item.category, t)}</strong>
                    <small>
                      {formatDisplayDate(item.date, locale)}
                      {item.note ? ` — ${item.note}` : ''}
                    </small>
                  </div>
                  <div className="row-actions">
                    <span className={item.type === 'income' ? 'ok' : 'danger'}>
                      {item.type === 'income' ? '+' : '-'}
                      {currency(item.amount, locale)}
                    </span>
                    <button type="button" onClick={() => handleDeleteTransaction(item.id)}>
                      {t('delete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
