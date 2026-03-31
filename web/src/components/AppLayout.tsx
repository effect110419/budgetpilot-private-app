import { useMemo } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LOCALE_OPTIONS,
  monthMessageKey,
  type Locale,
} from '../i18n/locales'
import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'
import { useAuth } from '../auth/AuthProvider'
import { useBudgetData } from '../data/BudgetDataContext'
import { getDisplayName } from '../lib/authDisplay'
import SelectField from './SelectField'

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
  const { user, loading: authLoading, cloudAvailable, signOut } = useAuth()
  const {
    yearOptions,
    selectedYear,
    selectedMonthPart,
    setSelectedMonth,
    cloudSyncActive,
  } = useBudgetData()

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const m = i + 1
        const v = String(m).padStart(2, '0')
        return { value: v, label: t(monthMessageKey(m)) }
      }),
    [t],
  )

  const yearSelectOptions = useMemo(
    () => yearOptions.map((y) => ({ value: String(y), label: String(y) })),
    [yearOptions],
  )

  const localeSelectOptions = useMemo(
    () => LOCALE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    [],
  )

  return (
    <div className="app-shell">
      <div className="app-surface">
        <header className="app-surface__header">
          <div className="app-brand">
            <p className="hero-eyebrow">{t('appTitle')}</p>
            <p className="hero-lead">{t('heroLead')}</p>
          </div>
          <div className="app-header-actions" aria-live="polite">
            {authLoading ? (
              <span className="app-header-actions__muted">…</span>
            ) : user ? (
              <>
                <span className="app-header-actions__display" title={user.email ?? ''}>
                  {getDisplayName(user)}
                </span>
                <Link className="app-header-account-link" to="/account">
                  {t('navAccount')}
                </Link>
                <span
                  className={
                    'app-header-actions__badge' +
                    (cloudSyncActive ? ' app-header-actions__badge--on' : '')
                  }
                >
                  {cloudSyncActive ? t('authCloudSync') : t('authLocalOnly')}
                </span>
                <button type="button" className="btn-header btn-header--ghost" onClick={() => signOut()}>
                  {t('authSignOut')}
                </button>
              </>
            ) : cloudAvailable ? (
              <>
                <Link className="btn-header btn-header--ghost" to="/login">
                  {t('authSubmitSignIn')}
                </Link>
                <Link className="btn-header btn-header--primary" to="/login?mode=signup">
                  {t('authSubmitSignUp')}
                </Link>
              </>
            ) : (
              <span className="app-header-actions__muted">{t('authLocalOnly')}</span>
            )}
          </div>
        </header>

        <div className="toolbar" role="presentation">
          <div className="toolbar-block">
            <p className="toolbar-heading">{t('toolbarPeriod')}</p>
            <div className="toolbar-row">
              <div className="field-stack" role="group">
                <span className="field-stack-label">{t('monthLabel')}</span>
                <SelectField
                  value={selectedMonthPart}
                  onChange={(v) => setSelectedMonth(`${selectedYear}-${v}`)}
                  options={monthOptions}
                  ariaLabel={t('monthLabel')}
                />
              </div>
              <div className="field-stack" role="group">
                <span className="field-stack-label">{t('yearLabel')}</span>
                <SelectField
                  value={selectedYear}
                  onChange={(v) => setSelectedMonth(`${v}-${selectedMonthPart}`)}
                  options={yearSelectOptions}
                  ariaLabel={t('yearLabel')}
                />
              </div>
            </div>
          </div>

          <div className="toolbar-block toolbar-block--end">
            <p className="toolbar-heading">{t('toolbarInterface')}</p>
            <div className="toolbar-row">
              <div className="field-stack field-stack--toolbar" role="group">
                <span className="field-stack-label">{t('language')}</span>
                <SelectField
                  value={locale}
                  onChange={(v) => setLocale(v as Locale)}
                  options={localeSelectOptions}
                  ariaLabel={t('language')}
                />
              </div>
              <div className="field-stack field-stack--toolbar field-stack--theme">
                <span className="field-stack-label">{t('labelTheme')}</span>
                <button
                  type="button"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={t('themeToggle')}
                  title={theme === 'light' ? t('themeDark') : t('themeLight')}
                >
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
              </div>
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

        <main className="app-main app-main--surface">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
