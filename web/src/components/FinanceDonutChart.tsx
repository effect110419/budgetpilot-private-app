import { useId, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { categoryLabel } from '../i18n/locales'
import type { MessageKey } from '../i18n/locales'

type TFn = (key: MessageKey) => string

type Props = {
  t: TFn
  currencyFmt: (n: number) => string
  /** Период для подписи, напр. «Март 2026» */
  periodLabel: string
  totalIncome: number
  totalExpense: number
  balance: number
  expensesByCategory: [string, number][]
  incomesByCategory: [string, number][]
}

/** Радиус до середины обводки; тоньше кольцо — больше «дырка» под диск с текстом */
const R = 78
const STROKE = 14
const CIRC = 2 * Math.PI * R

export default function FinanceDonutChart({
  t,
  currencyFmt,
  periodLabel,
  totalIncome,
  totalExpense,
  balance,
  expensesByCategory,
  incomesByCategory,
}: Props) {
  const gid = useId().replace(/:/g, '')

  const expenseRows = useMemo(() => {
    return [...expensesByCategory]
      .filter(([, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])
  }, [expensesByCategory])

  const topInc = useMemo(
    () => [...incomesByCategory].sort((a, b) => b[1] - a[1]).slice(0, 4),
    [incomesByCategory],
  )

  const seg = useMemo(() => {
    const i = totalIncome
    const e = totalExpense
    const hasData = i > 0 || e > 0

    if (!hasData) {
      return {
        hasData: false as const,
        expFrac: 0,
        remFrac: 0,
        expenseOnly: false,
      }
    }

    if (i <= 0 && e > 0) {
      return {
        hasData: true as const,
        expFrac: 1,
        remFrac: 0,
        expenseOnly: true,
      }
    }

    const expFrac = Math.min(1, e / i)
    const remFrac = Math.max(0, 1 - expFrac)
    return {
      hasData: true as const,
      expFrac,
      remFrac,
      expenseOnly: false,
    }
  }, [totalIncome, totalExpense])

  const dash = useMemo(() => {
    if (!seg.hasData) {
      return { expDash: `0 ${CIRC}`, remDash: `0 ${CIRC}`, remRot: 0 }
    }
    const expLen = seg.expFrac * CIRC
    const remLen = seg.remFrac * CIRC
    const gap = CIRC - expLen
    const gap2 = CIRC - remLen
    return {
      expDash: `${expLen} ${gap}`,
      remDash: `${remLen} ${gap2}`,
      remRot: seg.expFrac * 360,
    }
  }, [seg])

  return (
    <div className="finance-donut">
      <div className="finance-donut__chart-col">
        <div className="finance-donut__chart-panel">
          <header className="finance-donut__chart-panel-head">
            <span className="finance-donut__chart-panel-eyebrow">{t('chartPanelEyebrow')}</span>
            <span className="finance-donut__chart-panel-period">{periodLabel}</span>
          </header>

        <div className="finance-donut__ring-slot">
          <svg
            className="finance-donut__svg"
            viewBox="0 0 200 200"
            role="img"
            aria-label={t('chartAriaLabel')}
          >
            <defs>
              <linearGradient id={`${gid}-exp`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id={`${gid}-rem`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <g transform="translate(100,100)">
              <circle
                className="finance-donut__track"
                r={R}
                fill="none"
                strokeWidth={STROKE}
              />
              {!seg.hasData ? (
                <circle
                  r={R}
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth={STROKE}
                  strokeDasharray={`${CIRC * 0.06} ${CIRC * 0.06}`}
                  strokeLinecap="round"
                  opacity={0.35}
                  className="finance-donut__empty-ring"
                />
              ) : (
                <>
                  <g transform="rotate(-90)">
                    <circle
                      r={R}
                      fill="none"
                      stroke={`url(#${gid}-exp)`}
                      strokeWidth={STROKE}
                      strokeDasharray={dash.expDash}
                      strokeLinecap="round"
                      className="finance-donut__arc finance-donut__arc--exp"
                    />
                  </g>
                  {!seg.expenseOnly && seg.remFrac > 0.001 && (
                    <g transform={`rotate(${-90 + dash.remRot})`}>
                      <circle
                        r={R}
                        fill="none"
                        stroke={`url(#${gid}-rem)`}
                        strokeWidth={STROKE}
                        strokeDasharray={dash.remDash}
                        strokeLinecap="round"
                        className="finance-donut__arc finance-donut__arc--rem"
                      />
                    </g>
                  )}
                </>
              )}
            </g>
          </svg>

          <div className="finance-donut__center-disc">
            <p className="finance-donut__center-label">{t('summaryBalance')}</p>
            <p
              className={`finance-donut__center-value ${
                balance >= 0 ? 'finance-donut__center-value--pos' : 'finance-donut__center-value--neg'
              }`}
            >
              {currencyFmt(balance)}
            </p>
            {!seg.hasData && (
              <p className="finance-donut__center-hint">{t('chartNoData')}</p>
            )}
            {seg.hasData && totalExpense > totalIncome && (
              <p className="finance-donut__center-hint finance-donut__center-hint--warn">
                {t('chartDeficitHint')}
              </p>
            )}
          </div>
        </div>
        </div>
      </div>

      <div className="finance-donut__side">
        <section className="finance-donut__side-section" aria-labelledby="finance-kpi-heading">
          <h3 id="finance-kpi-heading" className="finance-donut__side-heading">
            {t('chartSideKpiTitle')}
          </h3>
          <ul className="finance-donut__legend">
            <li className="finance-donut__legend-row">
              <span className="finance-donut__dot finance-donut__dot--income" aria-hidden />
              <span className="finance-donut__legend-label">{t('summaryIncome')}</span>
              <span className="finance-donut__legend-val text-income">
                {currencyFmt(totalIncome)}
              </span>
            </li>
            <li className="finance-donut__legend-row">
              <span className="finance-donut__dot finance-donut__dot--expense" aria-hidden />
              <span className="finance-donut__legend-label">{t('summaryExpenses')}</span>
              <span className="finance-donut__legend-val text-expense">
                {currencyFmt(totalExpense)}
              </span>
            </li>
          </ul>
          <p className="finance-donut__side-note muted">{t('chartBalanceInRingHint')}</p>
        </section>

        <section
          className="finance-donut__expense-cat"
          aria-labelledby="finance-expense-cat-heading"
        >
          <h3 id="finance-expense-cat-heading" className="finance-donut__side-heading">
            {t('expenseAnalytics')}
          </h3>
          {expenseRows.length === 0 ? (
            <p className="finance-donut__expense-cat-empty muted">{t('noExpensesMonth')}</p>
          ) : (
            <ul className="finance-donut__expense-cat-list">
              {expenseRows.map(([cat, amount]) => {
                const pct =
                  totalExpense > 0 ? Math.min(100, Math.round((amount / totalExpense) * 1000) / 10) : 0
                return (
                  <li key={cat}>
                    <div className="finance-donut__expense-cat-row">
                      <span className="finance-donut__expense-cat-name">{categoryLabel(cat, t)}</span>
                      <span className="finance-donut__expense-cat-amt text-expense">
                        {currencyFmt(amount)}
                      </span>
                    </div>
                    <div className="finance-donut__expense-cat-track" aria-hidden>
                      <div
                        className="finance-donut__expense-cat-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Link className="finance-donut__analytics-link" to="/analytics">
            {t('chartExpenseAnalyticsLink')}
          </Link>
        </section>

        {topInc.length > 0 && (
          <div className="finance-donut__breakdown">
            <div className="finance-donut__breakdown-block">
              <p className="finance-donut__breakdown-title">{t('chartTopIncome')}</p>
              <ul className="finance-donut__mini-list">
                {topInc.map(([name, val]) => (
                  <li key={name}>
                    <span>{categoryLabel(name, t)}</span>
                    <span className="text-income">{currencyFmt(val)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
