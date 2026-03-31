import { useId, useMemo, useState } from 'react'
import SelectField from './SelectField'
import type { BudgetMap } from '../data/budgetTypes'
import { EXPENSE_CATEGORIES } from '../data/budgetTypes'
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
  budgets: BudgetMap
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
  budgets,
  expensesByCategory,
  incomesByCategory,
}: Props) {
  const gid = useId().replace(/:/g, '')

  const limitedBudgetRows = useMemo(() => {
    const rows: { category: string; limit: number; spent: number }[] = []
    for (const c of EXPENSE_CATEGORIES) {
      const lim = budgets[c] ?? 0
      if (lim > 0) {
        const spent =
          expensesByCategory.find(([name]) => name === c)?.[1] ?? 0
        rows.push({ category: c, limit: lim, spent })
      }
    }
    return rows
  }, [budgets, expensesByCategory])

  const [selectedBudgetCat, setSelectedBudgetCat] = useState<string | null>(null)

  const selectValue = useMemo(() => {
    if (limitedBudgetRows.length === 0) return ''
    if (
      selectedBudgetCat &&
      limitedBudgetRows.some((r) => r.category === selectedBudgetCat)
    ) {
      return selectedBudgetCat
    }
    return limitedBudgetRows[0].category
  }, [limitedBudgetRows, selectedBudgetCat])

  const selectedBudget = useMemo(() => {
    if (limitedBudgetRows.length === 0) return null
    return (
      limitedBudgetRows.find((r) => r.category === selectValue) ??
      limitedBudgetRows[0]
    )
  }, [limitedBudgetRows, selectValue])

  const budgetBar = useMemo(() => {
    if (!selectedBudget || selectedBudget.limit <= 0) {
      return { pct: 0, over: false }
    }
    const raw = (selectedBudget.spent / selectedBudget.limit) * 100
    return { pct: Math.min(100, raw), over: raw > 100 }
  }, [selectedBudget])

  const budgetSelectOptions = useMemo(
    () =>
      limitedBudgetRows.map((r) => ({
        value: r.category,
        label: categoryLabel(r.category, t),
      })),
    [limitedBudgetRows, t],
  )

  const topExp = useMemo(
    () => [...expensesByCategory].sort((a, b) => b[1] - a[1]).slice(0, 4),
    [expensesByCategory],
  )
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

        {limitedBudgetRows.length > 0 && selectedBudget && (
          <div className="finance-donut__budget">
            <p className="finance-donut__budget-title">{t('chartBudgetByCategory')}</p>
            <label className="finance-donut__budget-field">
              <span className="finance-donut__budget-select-label">
                {t('chartBudgetSelectLabel')}
              </span>
              <SelectField
                value={selectValue}
                onChange={setSelectedBudgetCat}
                options={budgetSelectOptions}
                ariaLabel={t('chartBudgetSelectLabel')}
                menuMaxHeight={280}
              />
            </label>
            <div className="finance-donut__budget-head">
              <span className="finance-donut__budget-spent-label">
                {t('chartBudgetSpentVsLimit')}
              </span>
              <span className="finance-donut__budget-nums">
                {currencyFmt(selectedBudget.spent)} / {currencyFmt(selectedBudget.limit)}
              </span>
            </div>
            <div
              className="finance-donut__budget-track"
              role="progressbar"
              aria-valuenow={Math.round(Math.min(100, budgetBar.pct))}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`finance-donut__budget-bar ${
                  budgetBar.over ? 'finance-donut__budget-bar--over' : ''
                }`}
                style={{ width: budgetBar.over ? '100%' : `${budgetBar.pct}%` }}
              />
            </div>
          </div>
        )}

        {(topExp.length > 0 || topInc.length > 0) && (
          <div className="finance-donut__breakdown">
            {topExp.length > 0 && (
              <div className="finance-donut__breakdown-block">
                <p className="finance-donut__breakdown-title">{t('chartTopExpenses')}</p>
                <ul className="finance-donut__mini-list">
                  {topExp.map(([name, val]) => (
                    <li key={name}>
                      <span>{categoryLabel(name, t)}</span>
                      <span className="text-expense">{currencyFmt(val)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {topInc.length > 0 && (
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}
