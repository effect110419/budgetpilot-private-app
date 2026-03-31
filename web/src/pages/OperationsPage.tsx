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
import SelectField from '../components/SelectField'

type TypeFilter = 'all' | TransactionType
type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'

export default function OperationsPage() {
  const {
    t,
    form,
    setForm,
    incomeCategories,
    expenseCategories,
    monthTransactions,
    handleAddTransaction,
    handleDeleteTransaction,
    updateTransaction,
    currencyFmt,
    formatDate,
  } = useBudgetData()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    date: '',
    note: '',
  })

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date_desc')

  const setTypeFilterAndResetCategory = (v: TypeFilter) => {
    setTypeFilter(v)
    setCategoryFilter('all')
  }

  const typeOptions = useMemo(
    () => [
      { value: 'expense', label: t('typeExpense') },
      { value: 'income', label: t('typeIncome') },
    ],
    [t],
  )

  const categoryOptions = useMemo(() => {
    const list = form.type === 'income' ? incomeCategories : expenseCategories
    return list.map((item) => ({
      value: item,
      label: categoryLabel(item, t),
    }))
  }, [form.type, incomeCategories, expenseCategories, t])

  const editCategoryOptions = useMemo(() => {
    const list = editDraft.type === 'income' ? incomeCategories : expenseCategories
    return list.map((item) => ({
      value: item,
      label: categoryLabel(item, t),
    }))
  }, [editDraft.type, incomeCategories, expenseCategories, t])

  const filterTypeOptions = useMemo(
    () => [
      { value: 'all', label: t('operationsFilterTypeAll') },
      { value: 'income', label: t('operationsFilterTypeIncome') },
      { value: 'expense', label: t('operationsFilterTypeExpense') },
    ],
    [t],
  )

  const categoryFilterOptions = useMemo(() => {
    const base = [{ value: 'all', label: t('operationsFilterCategoryAll') }]
    if (typeFilter === 'all') return base
    const list = typeFilter === 'income' ? incomeCategories : expenseCategories
    return [
      ...base,
      ...list.map((c) => ({ value: c, label: categoryLabel(c, t) })),
    ]
  }, [typeFilter, incomeCategories, expenseCategories, t])

  const sortOptions = useMemo(
    () => [
      { value: 'date_desc', label: t('operationsSortDateDesc') },
      { value: 'date_asc', label: t('operationsSortDateAsc') },
      { value: 'amount_desc', label: t('operationsSortAmountDesc') },
      { value: 'amount_asc', label: t('operationsSortAmountAsc') },
    ],
    [t],
  )

  const displayedTransactions = useMemo(() => {
    let list: Transaction[] = monthTransactions
    if (typeFilter !== 'all') {
      list = list.filter((item) => item.type === typeFilter)
    }
    if (categoryFilter !== 'all') {
      list = list.filter((item) => item.category === categoryFilter)
    }
    const sorted = [...list].sort((a, b) => {
      if (sortKey === 'date_desc' || sortKey === 'date_asc') {
        const cmp = a.date.localeCompare(b.date)
        const order = sortKey === 'date_desc' ? -1 : 1
        if (cmp !== 0) return cmp * order
        return b.id.localeCompare(a.id)
      }
      const order = sortKey === 'amount_desc' ? -1 : 1
      if (a.amount !== b.amount) return (a.amount - b.amount) * order
      return b.id.localeCompare(a.id)
    })
    return sorted
  }, [monthTransactions, typeFilter, categoryFilter, sortKey])

  /** Пока строка скрыта фильтром — форма не показывается; id сохраняем, чтобы вернуться к черновику при смене фильтра. */
  const activeEditId = useMemo(() => {
    if (!editingId) return null
    return displayedTransactions.some((x) => x.id === editingId) ? editingId : null
  }, [editingId, displayedTransactions])

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

  const cancelEdit = useCallback(() => setEditingId(null), [])

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

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!editingId) return
    const amount = clampMoneyAmount(parseMoneyInput(editDraft.amount))
    if (amount <= 0) return
    updateTransaction(editingId, {
      type: editDraft.type,
      amount,
      category: editDraft.category.trim(),
      date: editDraft.date,
      note: editDraft.note.trim(),
    })
    setEditingId(null)
  }

  return (
    <div className="page page--stack">
      <div className="section-heading">
        <h1 className="page-title">{t('sectionEntryTitle')}</h1>
        <p className="section-desc">{t('sectionEntryDesc')}</p>
      </div>

      <div className="panel panel--feature">
        <form className="form form--structured" onSubmit={handleAddTransaction}>
          <div className="form-grid form-grid--2">
            <label className="form-field">
              <span className="form-field-label">{t('type')}</span>
              <SelectField
                value={form.type}
                onChange={(v) =>
                  setForm((prev) => {
                    const next = v as TransactionType
                    const list = next === 'income' ? incomeCategories : expenseCategories
                    const nextCat = (list as readonly string[]).includes(prev.category)
                      ? prev.category
                      : defaultCategoryForType(next)
                    return { ...prev, type: next, category: nextCat }
                  })
                }
                options={typeOptions}
                ariaLabel={t('type')}
              />
            </label>
            <label className="form-field">
              <span className="form-field-label">{t('amount')}</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="5000,50"
                required
                autoComplete="off"
              />
              <span className="field-hint">{t('hintAmount')}</span>
            </label>
          </div>

          <label className="form-field">
            <span className="form-field-label">{t('category')}</span>
            <SelectField
              value={form.category}
              onChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
              options={categoryOptions}
              ariaLabel={t('category')}
              menuMaxHeight={320}
            />
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
                maxLength={NOTE_MAX_LENGTH}
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

      <div className="section-heading section-heading--tight">
        <h2 className="section-title">{t('transactions')}</h2>
        <p className="section-desc">{t('sectionTransactionsDesc')}</p>
      </div>

      {monthTransactions.length > 0 && (
        <div className="panel operations-toolbar">
          <div className="operations-toolbar__row">
            <label className="form-field operations-toolbar__field">
              <span className="form-field-label">{t('operationsFilterType')}</span>
              <SelectField
                value={typeFilter}
                onChange={(v) => setTypeFilterAndResetCategory(v as TypeFilter)}
                options={filterTypeOptions}
                ariaLabel={t('operationsFilterType')}
              />
            </label>
            <label className="form-field operations-toolbar__field">
              <span className="form-field-label">{t('operationsFilterCategory')}</span>
              <SelectField
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryFilterOptions}
                ariaLabel={t('operationsFilterCategory')}
                disabled={typeFilter === 'all'}
              />
            </label>
            <label className="form-field operations-toolbar__field">
              <span className="form-field-label">{t('operationsSortLabel')}</span>
              <SelectField
                value={sortKey}
                onChange={(v) => setSortKey(v as SortKey)}
                options={sortOptions}
                ariaLabel={t('operationsSortLabel')}
              />
            </label>
          </div>
        </div>
      )}

      <div className="panel">
        {monthTransactions.length === 0 ? (
          <p className="empty-state">{t('emptyTransactionsLong')}</p>
        ) : displayedTransactions.length === 0 ? (
          <p className="empty-state">{t('operationsNoMatches')}</p>
        ) : (
          <ul className="transactions">
            {displayedTransactions.map((item) => (
              <li
                key={item.id}
                className={activeEditId === item.id ? 'transactions__item--editing' : undefined}
              >
                {activeEditId === item.id ? (
                  <form className="txn-edit-form" onSubmit={handleEditSubmit}>
                    <label className="form-field">
                      <span className="form-field-label">{t('type')}</span>
                      <SelectField
                        value={editDraft.type}
                        onChange={onEditTypeChange}
                        options={typeOptions}
                        ariaLabel={t('type')}
                      />
                    </label>
                    <div className="form-grid form-grid--2">
                      <label className="form-field">
                        <span className="form-field-label">{t('amount')}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editDraft.amount}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                          }
                          required
                          autoComplete="off"
                        />
                      </label>
                      <label className="form-field">
                        <span className="form-field-label">{t('category')}</span>
                        <SelectField
                          value={editDraft.category}
                          onChange={(v) => setEditDraft((prev) => ({ ...prev, category: v }))}
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
                            setEditDraft((prev) => ({ ...prev, date: e.target.value }))
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
                            setEditDraft((prev) => ({ ...prev, note: e.target.value }))
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
                      <span className="txn-badge">
                        {item.type === 'income' ? t('typeIncome') : t('typeExpense')}
                      </span>
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
