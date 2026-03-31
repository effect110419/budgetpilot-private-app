import { categoryLabel } from '../i18n/locales'
import { useBudgetData } from '../data/BudgetDataContext'

export default function AnalyticsPage() {
  const {
    t,
    monthName,
    selectedYear,
    totalIncome,
    totalExpense,
    balance,
    incomesByCategory,
    expensesByCategory,
    currencyFmt,
  } = useBudgetData()

  return (
    <div className="page page--stack">
      <div className="section-heading">
        <h1 className="page-title">{t('navAnalytics')}</h1>
        <p className="section-period">
          {monthName} {selectedYear}
        </p>
        <p className="section-desc">{t('analyticsIntro')}</p>
      </div>

      <div className="analytics-recap">
        <div className="analytics-recap__item analytics-recap__item--income">
          <span className="analytics-recap__label">{t('summaryIncome')}</span>
          <span className="analytics-recap__value text-income">
            {currencyFmt(totalIncome)}
          </span>
        </div>
        <div className="analytics-recap__item analytics-recap__item--expense">
          <span className="analytics-recap__label">{t('summaryExpenses')}</span>
          <span className="analytics-recap__value text-expense">
            {currencyFmt(totalExpense)}
          </span>
        </div>
        <div className="analytics-recap__item analytics-recap__item--balance">
          <span className="analytics-recap__label">{t('summaryBalance')}</span>
          <span
            className={`analytics-recap__value ${balance >= 0 ? 'text-income' : 'text-expense'}`}
          >
            {currencyFmt(balance)}
          </span>
        </div>
      </div>

      <div className="section-heading section-heading--tight">
        <h2 className="section-title">{t('breakdownIncome')}</h2>
      </div>
      <div className="panel panel--analytics">
        {incomesByCategory.length === 0 ? (
          <p className="empty-state">{t('emptyIncomeMonth')}</p>
        ) : (
          <ul className="analytics analytics--full">
            {incomesByCategory.map(([name, value]) => (
              <li key={name}>
                <span className="analytics-label">{categoryLabel(name, t)}</span>
                <span className="analytics-value text-income">{currencyFmt(value)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section-heading section-heading--tight">
        <h2 className="section-title">{t('expenseAnalytics')}</h2>
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
                <span className="analytics-value text-expense">{currencyFmt(value)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
