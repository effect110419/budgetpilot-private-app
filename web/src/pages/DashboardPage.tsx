import { Link } from 'react-router-dom'
import FinanceDonutChart from '../components/FinanceDonutChart'
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
    overBudgetCategories,
    expensesByCategory,
    incomesByCategory,
  } = useBudgetData()

  const overBudget = overBudgetCategories.length > 0

  return (
    <div className="page">
      <div className="section-heading">
        <h1 className="page-title">{t('sectionSummaryTitle')}</h1>
        <p className="section-period">
          {monthName} {selectedYear}
        </p>
        <p className="section-desc">{t('sectionSummaryDesc')}</p>
      </div>

      {overBudget && (
        <div className="dashboard-alert panel" role="status">
          <p className="dashboard-alert__text">{t('dashboardOverBudgetBanner')}</p>
          <Link className="btn-primary dashboard-alert__cta" to="/budgets">
            {t('dashboardOverBudgetLink')}
          </Link>
        </div>
      )}

      <div className="dashboard-chart-panel">
        <FinanceDonutChart
          t={t}
          currencyFmt={currencyFmt}
          periodLabel={`${monthName} ${selectedYear}`}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          expensesByCategory={expensesByCategory}
          incomesByCategory={incomesByCategory}
        />
      </div>

      <div className="stat-cards">
        <Link
          className="stat-card stat-card--income stat-card--link"
          to="/income"
        >
          <h2 className="stat-card__title">{t('summaryIncome')}</h2>
          <p className="stat-card__hint">{t('kpiCardIncomeSub')}</p>
          <p className="stat-card__value text-income">{currencyFmt(totalIncome)}</p>
        </Link>
        <Link
          className="stat-card stat-card--expense stat-card--link"
          to="/expense"
        >
          <h2 className="stat-card__title">{t('summaryExpenses')}</h2>
          <p className="stat-card__hint">{t('kpiCardExpenseSub')}</p>
          <p className="stat-card__value text-expense">{currencyFmt(totalExpense)}</p>
        </Link>
        <Link
          className="stat-card stat-card--balance stat-card--link"
          to="/balance"
        >
          <h2 className="stat-card__title">{t('summaryBalance')}</h2>
          <p className="stat-card__hint">{t('kpiCardBalanceSub')}</p>
          <p
            className={`stat-card__value ${balance >= 0 ? 'text-income' : 'text-expense'}`}
          >
            {currencyFmt(balance)}
          </p>
        </Link>
      </div>
    </div>
  )
}
