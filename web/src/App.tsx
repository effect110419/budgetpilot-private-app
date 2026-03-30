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
  const monthName = t(monthMessageKey(Number(selectedMonthPart)))

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
    <div className="app-shell">
      <header className="hero">
        <div className="hero-main">
          <p className="hero-eyebrow">{t('appTitle')}</p>
          <p className="hero-lead">{t('heroLead')}</p>
        </div>

        <div className="toolbar" role="presentation">
          <div className="toolbar-block">
            <p className="toolbar-heading">{t('toolbarPeriod')}</p>
            <div className="toolbar-row">
              <label className="field-stack">
                <span className="field-stack-label">{t('monthLabel')}</span>
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
                <span className="field-stack-label">{t('yearLabel')}</span>
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

          <div className="toolbar-block toolbar-block--end">
            <p className="toolbar-heading">{t('toolbarDisplay')}</p>
            <div className="toolbar-row toolbar-row--compact">
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={t('themeToggle')}
                title={theme === 'light' ? t('themeDark') : t('themeLight')}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
              <label className="field-stack field-stack--grow">
                <span className="field-stack-label">{t('language')}</span>
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
            </div>
          </div>
        </div>
      </header>

      <main className="app">
        <section className="page-section page-section--first" aria-labelledby="summary-heading">
          <div className="section-heading">
            <h2 id="summary-heading" className="section-title">
              {t('sectionSummaryTitle')}
            </h2>
            <p className="section-period">
              {monthName} {selectedYear}
            </p>
            <p className="section-desc">{t('sectionSummaryDesc')}</p>
          </div>

          <div className="stat-cards">
            <article className="stat-card stat-card--income">
              <h3 className="stat-card__title">{t('summaryIncome')}</h3>
              <p className="stat-card__hint">{t('kpiCardIncomeSub')}</p>
              <p className="stat-card__value ok">{currency(totalIncome, locale)}</p>
            </article>
            <article className="stat-card stat-card--expense">
              <h3 className="stat-card__title">{t('summaryExpenses')}</h3>
              <p className="stat-card__hint">{t('kpiCardExpenseSub')}</p>
              <p className="stat-card__value danger">{currency(totalExpense, locale)}</p>
            </article>
            <article className="stat-card stat-card--balance">
              <h3 className="stat-card__title">{t('summaryBalance')}</h3>
              <p className="stat-card__hint">{t('kpiCardBalanceSub')}</p>
              <p className={`stat-card__value ${balance >= 0 ? 'ok' : 'danger'}`}>
                {currency(balance, locale)}
              </p>
            </article>
          </div>
        </section>

        <section className="page-section" aria-labelledby="entry-heading">
          <div className="section-heading">
            <h2 id="entry-heading" className="section-title">
              {t('sectionEntryTitle')}
            </h2>
            <p className="section-desc">{t('sectionEntryDesc')}</p>
          </div>

          <div className="panel panel--feature">
            <form className="form form--structured" onSubmit={handleAddTransaction}>
              <div className="form-grid form-grid--2">
                <label className="form-field">
                  <span className="form-field-label">{t('type')}</span>
                  <select
                    className="select-input"
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as TransactionType,
                      }))
                    }
                  >
                    <option value="expense">{t('typeExpense')}</option>
                    <option value="income">{t('typeIncome')}</option>
                  </select>
                </label>
                <label className="form-field">
                  <span className="form-field-label">{t('amount')}</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    placeholder="5000"
                    required
                    autoComplete="off"
                  />
                  <span className="field-hint">{t('hintAmount')}</span>
                </label>
              </div>

              <label className="form-field">
                <span className="form-field-label">{t('category')}</span>
                <select
                  className="select-input"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  required
                >
                  {DEFAULT_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {categoryLabel(item, t)}
                    </option>
                  ))}
                </select>
                <span className="field-hint">{t('hintCategory')}</span>
              </label>

              <div className="form-grid form-grid--2">
                <label className="form-field">
                  <span className="form-field-label">{t('date')}</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                  <span className="field-hint">{t('hintDate')}</span>
                </label>
                <label className="form-field">
                  <span className="form-field-label">{t('note')}</span>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, note: e.target.value }))
                    }
                    placeholder={t('optional')}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {t('saveTransaction')}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="page-section" aria-labelledby="budget-heading">
          <div className="section-heading">
            <h2 id="budget-heading" className="section-title">
              {t('sectionBudgetTitle')}
            </h2>
            <p className="section-desc">{t('sectionBudgetDesc')}</p>
          </div>

          <div className="panel">
            <div className="budget-list">
              {DEFAULT_CATEGORIES.filter(
                (item) => item !== 'Salary' && item !== 'Freelance',
              ).map((category) => {
                const spent =
                  expensesByCategory.find(([name]) => name === category)?.[1] ?? 0
                const limit = budgets[category] ?? 0
                const ratio = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                return (
                  <div className="budget-row" key={category}>
                    <div className="budget-head">
                      <span className="budget-name">{categoryLabel(category, t)}</span>
                      <span className="budget-meta">
                        {currency(spent, locale)} /{' '}
                        {limit > 0 ? currency(limit, locale) : t('noLimit')}
                      </span>
                    </div>
                    <label className="budget-limit-label">
                      <span className="visually-hidden">{t('setLimit')}</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={limit || ''}
                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                        placeholder={t('setLimit')}
                        aria-label={`${categoryLabel(category, t)} — ${t('setLimit')}`}
                      />
                    </label>
                    <div className="progress" role="presentation">
                      <div style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="page-section" aria-labelledby="insights-heading">
          <div className="section-heading">
            <h2 id="insights-heading" className="section-title">
              {t('sectionInsightsTitle')}
            </h2>
          </div>

          <div className="insights-grid">
            <article className="panel panel--sub">
              <h3 className="panel-subtitle">{t('expenseAnalytics')}</h3>
              <p className="panel-lead muted">{t('sectionAnalyticsDesc')}</p>
              {expensesByCategory.length === 0 ? (
                <p className="empty-state">{t('emptyAnalyticsLong')}</p>
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

            <article className="panel panel--sub">
              <h3 className="panel-subtitle">{t('transactions')}</h3>
              <p className="panel-lead muted">{t('sectionTransactionsDesc')}</p>
              {monthTransactions.length === 0 ? (
                <p className="empty-state">{t('emptyTransactionsLong')}</p>
              ) : (
                <ul className="transactions">
                  {monthTransactions.map((item) => (
                    <li key={item.id}>
                      <div className="txn-main">
                        <span className="txn-title">{categoryLabel(item.category, t)}</span>
                        <span className="txn-meta">
                          {formatDisplayDate(item.date, locale)}
                          {item.note ? ` — ${item.note}` : ''}
                        </span>
                      </div>
                      <div className="row-actions">
                        <span
                          className={`txn-amount ${item.type === 'income' ? 'ok' : 'danger'}`}
                        >
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
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
