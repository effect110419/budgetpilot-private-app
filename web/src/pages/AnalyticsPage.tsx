import { categoryLabel } from '../i18n/locales'
import { useBudgetData } from '../data/BudgetDataContext'

export default function AnalyticsPage() {
  const { t, expensesByCategory, currencyFmt } = useBudgetData()

  return (
    <div className="page">
      <div className="section-heading">
        <h1 className="page-title">{t('expenseAnalytics')}</h1>
        <p className="section-desc">{t('sectionAnalyticsDesc')}</p>
      </div>

      <div className="panel panel--analytics">
        {expensesByCategory.length === 0 ? (
          <p className="empty-state">{t('emptyAnalyticsLong')}</p>
        ) : (
          <ul className="analytics analytics--full">
            {expensesByCategory.map(([name, value]) => (
              <li key={name}>
                <span className="analytics-label">{categoryLabel(name, t)}</span>
                <span className="analytics-value">{currencyFmt(value)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
