import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { categoryLabel } from '../i18n/locales'
import { useBudgetData } from '../data/BudgetDataContext'
import type { Transaction, TransactionType } from '../data/budgetTypes'
import { coerceCategoryForType, defaultCategoryForType } from '../data/budgetTypes'
import {
  clampMoneyAmount,
  NOTE_MAX_LENGTH,
  parseMoneyInput,
} from '../lib/validation'
import SelectField from './SelectField'

export type DetailMode = 'income' | 'expense' | 'balance'

type AddFormState = {
  type: TransactionType
  amount: string
  category: string
  date: string
  note: string
}

function initialAddForm(mode: DetailMode): AddFormState {
  const today = new Date().toISOString().slice(0, 10)
  if (mode === 'income') {
    return {
      type: 'income',
      amount: '',
      category: 'Salary',
      date: today,
      note: '',
    }
  }
  return {
    type: 'expense',
    amount: '',
    category: 'Food',
    date: today,
    note: '',
  }
}

export default function TransactionDetailSection({ mode }: { mode: DetailMode }) {
  const {
    t,
    monthName,
    selectedYear,
    incomeCategories,
    expenseCategories,
    monthTransactions,
    totalIncome,
    totalExpense,
    balance,
    expensesByCategory,
    incomesByCategory,
    createTransaction,
    updateTransaction,
    handleDeleteTransaction,
    currencyFmt,
    formatDate,
  } = useBudgetData()

  const [addForm, setAddForm] = useState(() => initialAddForm(mode))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    date: '',
    note: '',
  })

  const typeOptions = useMemo(
    () => [
      { value: 'expense', label: t('typeExpense') },
      { value: 'income', label: t('typeIncome') },
    ],
    [t],
  )

  const addCategoryOptions = useMemo(() => {
    const type =
      mode === 'balance'
        ? addForm.type
        : mode === 'income'
          ? 'income'
          : 'expense'
    const list = type === 'income' ? incomeCategories : expenseCategories
    return list.map((item) => ({
      value: item,
      label: categoryLabel(item, t),
    }))
  }, [mode, addForm.type, incomeCategories, expenseCategories, t])

  const editCategoryOptions = useMemo(() => {
    const type =
      mode === 'balance'
        ? editDraft.type
        : mode === 'income'
          ? 'income'
          : 'expense'
    const list = type === 'income' ? incomeCategories : expenseCategories
    return list.map((item) => ({
      value: item,
      label: categoryLabel(item, t),
    }))
  }, [mode, editDraft.type, incomeCategories, expenseCategories, t])

  const filtered = useMemo(() => {
    if (mode === 'balance') {
      return [...monthTransactions].sort((a, b) => b.date.localeCompare(a.date))
    }
    return monthTransactions
      .filter((x) => x.type === mode)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [monthTransactions, mode])

  const titleKey =
    mode === 'income'
      ? 'detailIncomeTitle'
      : mode === 'expense'
        ? 'detailExpenseTitle'
        : 'detailBalanceTitle'
  const descKey =
    mode === 'income'
      ? 'detailIncomeDesc'
      : mode === 'expense'
        ? 'detailExpenseDesc'
        : 'detailBalanceDesc'

  const startEdit = useCallback((tr: Transaction) => {
    setEditingId(tr.id)
    setEditDraft({
      type: tr.type,
      amount: String(tr.amount),
      category: coerceCategoryForType(tr.type, tr.category),
      date: tr.date,
      note: tr.note,
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const handleAddSubmit = (event: FormEvent) => {
    event.preventDefault()
    const amount = clampMoneyAmount(parseMoneyInput(addForm.amount))
    if (amount <= 0) return
    const type: TransactionType =
      mode === 'balance'
        ? addForm.type
        : mode === 'income'
          ? 'income'
          : 'expense'
    createTransaction({
      type,
      amount,
      category: addForm.category.trim(),
      date: addForm.date,
      note: addForm.note.trim(),
    })
    setAddForm((prev) => ({ ...prev, amount: '', note: '' }))
  }

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!editingId) return
    const amount = clampMoneyAmount(parseMoneyInput(editDraft.amount))
    if (amount <= 0) return
    const type: TransactionType =
      mode === 'balance'
        ? editDraft.type
        : mode === 'income'
          ? 'income'
          : 'expense'
    updateTransaction(editingId, {
      type,
      amount,
      category: editDraft.category.trim(),
      date: editDraft.date,
      note: editDraft.note.trim(),
    })
    setEditingId(null)
  }

  const onAddTypeChange = (v: string) => {
    const next = v as TransactionType
    const list = next === 'income' ? incomeCategories : expenseCategories
    setAddForm((prev) => ({
      ...prev,
      type: next,
      category: (list as readonly string[]).includes(prev.category)
        ? prev.category
        : defaultCategoryForType(next),
    }))
  }

  const onEditTypeChange = (v: string) => {
    const next = v as TransactionType
    const list = next === 'income' ? incomeCategories : expenseCategories
    setEditDraft((prev) => ({
      ...prev,
      type: next,
      category: (list as readonly string[]).includes(prev.category)
        ? prev.category
        : defaultCategoryForType(next),
    }))
  }

  const emptyListMessage =
    mode === 'income'
      ? t('emptyIncomeMonth')
      : mode === 'expense'
        ? t('emptyExpenseMonth')
        : t('noTransactionsMonth')

  return (
    <div className="page page--stack">
      <div className="section-heading">
        <h1 className="page-title">{t(titleKey)}</h1>
        <p className="section-period">
          {monthName} {selectedYear}
        </p>
        <p className="section-desc">{t(descKey)}</p>
      </div>

      {mode === 'balance' && (
        <div className="balance-recap">
          <div className="balance-recap__row">
            <span className="balance-recap__label">{t('summaryIncome')}</span>
            <span className="balance-recap__value text-income">
              {currencyFmt(totalIncome)}
            </span>
          </div>
          <div className="balance-recap__row">
            <span className="balance-recap__label">{t('summaryExpenses')}</span>
            <span className="balance-recap__value text-expense">
              {currencyFmt(totalExpense)}
            </span>
          </div>
          <div className="balance-recap__row balance-recap__row--strong">
            <span className="balance-recap__label">{t('summaryBalance')}</span>
            <span
              className={`balance-recap__value ${balance >= 0 ? 'text-income' : 'text-expense'}`}
            >
              {currencyFmt(balance)}
            </span>
          </div>
        </div>
      )}

      {mode === 'income' && (
        <div className="panel">
          <h2 className="section-title section-title--inline">{t('breakdownIncome')}</h2>
          {incomesByCategory.length === 0 ? (
            <p className="muted breakdown-empty">{t('emptyIncomeMonth')}</p>
          ) : (
            <ul className="breakdown-list">
              {incomesByCategory.map(([cat, amt]) => (
                <li key={cat}>
                  <span>{categoryLabel(cat, t)}</span>
                  <span className="text-income">{currencyFmt(amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mode === 'expense' && (
        <div className="panel">
          <h2 className="section-title section-title--inline">{t('breakdownExpense')}</h2>
          {expensesByCategory.length === 0 ? (
            <p className="muted breakdown-empty">{t('emptyExpenseMonth')}</p>
          ) : (
            <ul className="breakdown-list">
              {expensesByCategory.map(([cat, amt]) => (
                <li key={cat}>
                  <span>{categoryLabel(cat, t)}</span>
                  <span className="text-expense">{currencyFmt(amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mode === 'balance' && (
        <>
          <div className="panel">
            <h2 className="section-title section-title--inline">{t('breakdownIncome')}</h2>
            {incomesByCategory.length === 0 ? (
              <p className="muted breakdown-empty">{t('emptyIncomeMonth')}</p>
            ) : (
              <ul className="breakdown-list">
                {incomesByCategory.map(([cat, amt]) => (
                  <li key={cat}>
                    <span>{categoryLabel(cat, t)}</span>
                    <span className="text-income">{currencyFmt(amt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="panel">
            <h2 className="section-title section-title--inline">{t('breakdownExpense')}</h2>
            {expensesByCategory.length === 0 ? (
              <p className="muted breakdown-empty">{t('emptyExpenseMonth')}</p>
            ) : (
              <ul className="breakdown-list">
                {expensesByCategory.map(([cat, amt]) => (
                  <li key={cat}>
                    <span>{categoryLabel(cat, t)}</span>
                    <span className="text-expense">{currencyFmt(amt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className="panel panel--feature">
        <h2 className="section-title section-title--inline">{t('addTransaction')}</h2>
        <form className="form form--structured" onSubmit={handleAddSubmit}>
          {mode === 'balance' && (
            <label className="form-field">
              <span className="form-field-label">{t('type')}</span>
              <SelectField
                value={addForm.type}
                onChange={onAddTypeChange}
                options={typeOptions}
                ariaLabel={t('type')}
              />
            </label>
          )}

          <div className="form-grid form-grid--2">
            <label className="form-field">
              <span className="form-field-label">{t('amount')}</span>
              <input
                type="text"
                inputMode="decimal"
                value={addForm.amount}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="5000,50"
                required
                autoComplete="off"
              />
              <span className="field-hint">{t('hintAmount')}</span>
            </label>
            <label className="form-field">
              <span className="form-field-label">{t('category')}</span>
              <SelectField
                value={addForm.category}
                onChange={(v) => setAddForm((prev) => ({ ...prev, category: v }))}
                options={addCategoryOptions}
                ariaLabel={t('category')}
                menuMaxHeight={320}
              />
              <span className="field-hint">{t('hintCategory')}</span>
            </label>
          </div>

          <div className="form-grid form-grid--2">
            <label className="form-field">
              <span className="form-field-label">{t('date')}</span>
              <input
                type="date"
                value={addForm.date}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
              <span className="field-hint">{t('hintDate')}</span>
            </label>
            <label className="form-field">
              <span className="form-field-label">{t('note')}</span>
              <input
                type="text"
                value={addForm.note}
                maxLength={NOTE_MAX_LENGTH}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, note: e.target.value }))
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

      <div className="section-heading section-heading--tight">
        <h2 className="section-title">{t('transactions')}</h2>
      </div>

      <div className="panel">
        {filtered.length === 0 ? (
          <p className="empty-state">{emptyListMessage}</p>
        ) : (
          <ul className="transactions">
            {filtered.map((item) => (
              <li
                key={item.id}
                className={editingId === item.id ? 'transactions__item--editing' : undefined}
              >
                {editingId === item.id ? (
                  <form className="txn-edit-form" onSubmit={handleEditSubmit}>
                    {mode === 'balance' && (
                      <label className="form-field">
                        <span className="form-field-label">{t('type')}</span>
                        <SelectField
                          value={editDraft.type}
                          onChange={onEditTypeChange}
                          options={typeOptions}
                          ariaLabel={t('type')}
                        />
                      </label>
                    )}
                    <div className="form-grid form-grid--2">
                      <label className="form-field">
                        <span className="form-field-label">{t('amount')}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editDraft.amount}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          required
                          autoComplete="off"
                        />
                      </label>
                      <label className="form-field">
                        <span className="form-field-label">{t('category')}</span>
                        <SelectField
                          value={editDraft.category}
                          onChange={(v) =>
                            setEditDraft((prev) => ({ ...prev, category: v }))
                          }
                          options={editCategoryOptions}
                          ariaLabel={t('category')}
                          menuMaxHeight={320}
                        />
                      </label>
                    </div>
                    <div className="form-grid form-grid--2">
                      <label className="form-field">
                        <span className="form-field-label">{t('date')}</span>
                        <input
                          type="date"
                          value={editDraft.date}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label className="form-field">
                        <span className="form-field-label">{t('note')}</span>
                        <input
                          type="text"
                          value={editDraft.note}
                          maxLength={NOTE_MAX_LENGTH}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              note: e.target.value,
                            }))
                          }
                          placeholder={t('optional')}
                          autoComplete="off"
                        />
                      </label>
                    </div>
                    <div className="form-actions txn-edit-form__actions">
                      <button type="submit" className="btn-primary">
                        {t('saveEdit')}
                      </button>
                      <button type="button" className="btn-cancel" onClick={cancelEdit}>
                        {t('cancelEdit')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="txn-main">
                      {mode === 'balance' && (
                        <span className="txn-badge">
                          {item.type === 'income' ? t('typeIncome') : t('typeExpense')}
                        </span>
                      )}
                      <span className="txn-title">{categoryLabel(item.category, t)}</span>
                      <span className="txn-meta">
                        {formatDate(item.date)}
                        {item.note ? ` — ${item.note}` : ''}
                      </span>
                    </div>
                    <div className="row-actions">
                      <span
                        className={`txn-amount ${item.type === 'income' ? 'text-income' : 'text-expense'}`}
                      >
                        {item.type === 'income' ? '+' : '-'}
                        {currencyFmt(item.amount)}
                      </span>
                      <button
                        type="button"
                        className="row-actions__edit"
                        onClick={() => startEdit(item)}
                      >
                        {t('edit')}
                      </button>
                      <button type="button" onClick={() => handleDeleteTransaction(item.id)}>
                        {t('delete')}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
