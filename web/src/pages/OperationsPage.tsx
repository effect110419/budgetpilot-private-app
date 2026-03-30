import { categoryLabel } from '../i18n/locales'
import { useBudgetData } from '../data/BudgetDataContext'
import type { TransactionType } from '../data/budgetTypes'

export default function OperationsPage() {
  const {
    t,
    form,
    setForm,
    defaultCategories,
    monthTransactions,
    handleAddTransaction,
    handleDeleteTransaction,
    currencyFmt,
    formatDate,
  } = useBudgetData()

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
              {defaultCategories.map((item) => (
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

      <div className="section-heading section-heading--tight">
        <h2 className="section-title">{t('transactions')}</h2>
        <p className="section-desc">{t('sectionTransactionsDesc')}</p>
      </div>

      <div className="panel">
        {monthTransactions.length === 0 ? (
          <p className="empty-state">{t('emptyTransactionsLong')}</p>
        ) : (
          <ul className="transactions">
            {monthTransactions.map((item) => (
              <li key={item.id}>
                <div className="txn-main">
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
                  <button type="button" onClick={() => handleDeleteTransaction(item.id)}>
                    {t('delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
