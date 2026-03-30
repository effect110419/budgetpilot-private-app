import { useBudgetData } from '../data/BudgetDataContext'

export default function DashboardPage() {
  const {
    t,
    monthName,
    selectedYear,
    totalIncome,
    totalExpense,
    balance,
    currencyFmt,
  } = useBudgetData()

  return (
    <div className="page">
      <div className="section-heading">
        <h1 className="page-title">{t('sectionSummaryTitle')}</h1>
        <p className="section-period">
          {monthName} {selectedYear}
        </p>
        <p className="section-desc">{t('sectionSummaryDesc')}</p>
      </div>

      <div className="stat-cards">
        <article className="stat-card stat-card--income">
          <h2 className="stat-card__title">{t('summaryIncome')}</h2>
          <p className="stat-card__hint">{t('kpiCardIncomeSub')}</p>
          <p className="stat-card__value text-income">{currencyFmt(totalIncome)}</p>
        </article>
        <article className="stat-card stat-card--expense">
          <h2 className="stat-card__title">{t('summaryExpenses')}</h2>
          <p className="stat-card__hint">{t('kpiCardExpenseSub')}</p>
          <p className="stat-card__value text-expense">{currencyFmt(totalExpense)}</p>
        </article>
        <article className="stat-card stat-card--balance">
          <h2 className="stat-card__title">{t('summaryBalance')}</h2>
          <p className="stat-card__hint">{t('kpiCardBalanceSub')}</p>
          <p
            className={`stat-card__value ${balance >= 0 ? 'text-income' : 'text-expense'}`}
          >
            {currencyFmt(balance)}
          </p>
        </article>
      </div>
    </div>
  )
}
