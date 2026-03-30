import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

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

function currency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
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
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions],
  )

  const totalExpense = useMemo(
    () =>
      monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
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
          <h1>BudgetPilot</h1>
          <p>Track income, expenses, and monthly limits in one place.</p>
        </div>
        <label className="month-picker">
          <span>Month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
      </header>

      <section className="cards">
        <article className="card">
          <h2>Income</h2>
          <strong className="ok">{currency(totalIncome)}</strong>
        </article>
        <article className="card">
          <h2>Expenses</h2>
          <strong className="danger">{currency(totalExpense)}</strong>
        </article>
        <article className="card">
          <h2>Balance</h2>
          <strong className={balance >= 0 ? 'ok' : 'danger'}>{currency(balance)}</strong>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Add transaction</h2>
          <form className="form" onSubmit={handleAddTransaction}>
            <label>
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value as TransactionType }))
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label>
              Amount
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
              Category
              <input
                list="categories"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
              <datalist id="categories">
                {DEFAULT_CATEGORIES.map((item) => (
                  <option value={item} key={item} />
                ))}
              </datalist>
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </label>

            <label>
              Note
              <input
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Optional"
              />
            </label>

            <button type="submit">Save transaction</button>
          </form>
        </article>

        <article className="panel">
          <h2>Category budgets</h2>
          <p className="muted">Set monthly budget per expense category.</p>
          <div className="budget-list">
            {DEFAULT_CATEGORIES.filter((item) => item !== 'Salary' && item !== 'Freelance').map(
              (category) => {
                const spent = expensesByCategory.find(([name]) => name === category)?.[1] ?? 0
                const limit = budgets[category] ?? 0
                const ratio = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                return (
                  <div className="budget-row" key={category}>
                    <div className="budget-head">
                      <span>{category}</span>
                      <small>
                        {currency(spent)} / {limit > 0 ? currency(limit) : 'No limit'}
                      </small>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={limit || ''}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      placeholder="Set limit"
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
          <h2>Expense analytics</h2>
          {expensesByCategory.length === 0 ? (
            <p className="muted">No expenses for selected month.</p>
          ) : (
            <ul className="analytics">
              {expensesByCategory.map(([name, value]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{currency(value)}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <h2>Transactions</h2>
          {monthTransactions.length === 0 ? (
            <p className="muted">No transactions for selected month.</p>
          ) : (
            <ul className="transactions">
              {monthTransactions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.category}</strong>
                    <small>
                      {item.date}
                      {item.note ? ` - ${item.note}` : ''}
                    </small>
                  </div>
                  <div className="row-actions">
                    <span className={item.type === 'income' ? 'ok' : 'danger'}>
                      {item.type === 'income' ? '+' : '-'}
                      {currency(item.amount)}
                    </span>
                    <button type="button" onClick={() => handleDeleteTransaction(item.id)}>
                      Delete
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
