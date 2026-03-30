import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  LOCALE_OPTIONS,
  categoryLabel,
  type Locale,
} from './i18n/locales'
import { useI18n } from './i18n/I18nProvider'

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

function App() {
  const { locale, setLocale, t } = useI18n()
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = new Date().toISOString().slice(0, 7)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<BudgetMap>({})
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [form, setForm] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: 'Food',
    date: today,
    note: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as {
        transactions: Transaction[]
        budgets: BudgetMap
      }
      setTransactions(parsed.transactions ?? [])
      setBudgets(parsed.budgets ?? {})
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

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
          <p>{t('appTagline')}</p>
        </div>
        <div className="top-actions">
          <label className="lang-picker">
            <span>{t('language')}</span>
            <select
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
          <label className="month-picker">
            <span>{t('monthLabel')}</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </label>
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
          <h2>{t('addTransaction')}</h2>
          <form className="form" onSubmit={handleAddTransaction}>
            <label>
              {t('type')}
              <select
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
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={t('optional')}
              />
            </label>

            <button type="submit">{t('saveTransaction')}</button>
          </form>
        </article>

        <article className="panel">
          <h2>{t('categoryBudgets')}</h2>
          <p className="muted">{t('categoryBudgetsHint')}</p>
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
          <h2>{t('expenseAnalytics')}</h2>
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
          <h2>{t('transactions')}</h2>
          {monthTransactions.length === 0 ? (
            <p className="muted">{t('noTransactionsMonth')}</p>
          ) : (
            <ul className="transactions">
              {monthTransactions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{categoryLabel(item.category, t)}</strong>
                    <small>
                      {item.date}
                      {item.note ? ` - ${item.note}` : ''}
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
