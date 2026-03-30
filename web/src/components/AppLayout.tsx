import { NavLink, Outlet } from 'react-router-dom'
import { LOCALE_OPTIONS, monthMessageKey, type Locale } from '../i18n/locales'
import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'
import { useBudgetData } from '../data/BudgetDataContext'

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AppLayout() {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const {
    yearOptions,
    selectedYear,
    selectedMonthPart,
    setSelectedMonth,
  } = useBudgetData()

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-main">
          <p className="hero-eyebrow">{t('appTitle')}</p>
          <p className="hero-lead">{t('heroLead')}</p>
        </div>

        <div className="toolbar" role="presentation">
          <div className="toolbar-block">
            <p className="toolbar-heading">{t('toolbarPeriod')}</p>
            <div className="toolbar-row">
              <label className="field-stack">
                <span className="field-stack-label">{t('monthLabel')}</span>
                <select
                  className="select-input"
                  value={selectedMonthPart}
                  onChange={(e) =>
                    setSelectedMonth(`${selectedYear}-${e.target.value}`)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                    const v = String(m).padStart(2, '0')
                    return (
                      <option key={m} value={v}>
                        {t(monthMessageKey(m))}
                      </option>
                    )
                  })}
                </select>
              </label>
              <label className="field-stack">
                <span className="field-stack-label">{t('yearLabel')}</span>
                <select
                  className="select-input"
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedMonth(`${e.target.value}-${selectedMonthPart}`)
                  }
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="toolbar-block toolbar-block--end">
            <p className="toolbar-heading">{t('toolbarDisplay')}</p>
            <div className="toolbar-row toolbar-row--compact">
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={t('themeToggle')}
                title={theme === 'light' ? t('themeDark') : t('themeLight')}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
              <label className="field-stack field-stack--grow">
                <span className="field-stack-label">{t('language')}</span>
                <select
                  className="select-input"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  aria-label={t('language')}
                >
                  {LOCALE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <nav className="main-nav" aria-label={t('navAria')}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'main-nav-link' + (isActive ? ' is-active' : '')
            }
          >
            {t('navDashboard')}
          </NavLink>
          <NavLink
            to="/operations"
            className={({ isActive }) =>
              'main-nav-link' + (isActive ? ' is-active' : '')
            }
          >
            {t('navOperations')}
          </NavLink>
          <NavLink
            to="/budgets"
            className={({ isActive }) =>
              'main-nav-link' + (isActive ? ' is-active' : '')
            }
          >
            {t('navBudgets')}
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              'main-nav-link' + (isActive ? ' is-active' : '')
            }
          >
            {t('navAnalytics')}
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
