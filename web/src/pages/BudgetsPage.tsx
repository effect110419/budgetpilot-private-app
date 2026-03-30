import { categoryLabel } from '../i18n/locales'
import { useBudgetData } from '../data/BudgetDataContext'

export default function BudgetsPage() {
  const {
    t,
    defaultCategories,
    expensesByCategory,
    budgets,
    handleBudgetChange,
    currencyFmt,
  } = useBudgetData()

  const expenseCats = defaultCategories.filter(
    (item) => item !== 'Salary' && item !== 'Freelance',
  )

  return (
    <div className="page">
      <div className="section-heading">
        <h1 className="page-title">{t('sectionBudgetTitle')}</h1>
        <p className="section-desc">{t('sectionBudgetDesc')}</p>
      </div>

      <div className="budget-list budget-list--page">
        {expenseCats.map((category) => {
          const spent =
            expensesByCategory.find(([name]) => name === category)?.[1] ?? 0
          const limit = budgets[category] ?? 0
          const ratio = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
          const over = limit > 0 && spent > limit

          return (
            <article className={`budget-card ${over ? 'budget-card--over' : ''}`} key={category}>
              <div className="budget-card-top">
                <h2 className="budget-card-name">{categoryLabel(category, t)}</h2>
                <p className="budget-card-stats">
                  <span className="budget-card-spent">{currencyFmt(spent)}</span>
                  <span className="budget-card-sep">/</span>
                  <span className="budget-card-limit">
                    {limit > 0 ? currencyFmt(limit) : t('noLimit')}
                  </span>
                </p>
              </div>
              <label className="budget-card-field">
                <span className="budget-field-label">{t('setLimit')}</span>
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
              <div
                className={`progress progress--budget ${over ? 'progress--over' : ''}`}
                role="presentation"
                aria-hidden
              >
                <div style={{ width: `${ratio}%` }} />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
