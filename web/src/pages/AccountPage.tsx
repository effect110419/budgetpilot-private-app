import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import {
  deleteRecurringIncome,
  fetchProfile,
  fetchRecurringIncomes,
  insertRecurringIncome,
  upsertProfileBasics,
  type ProfileRow,
  type RecurringIncomeRow,
} from '../lib/accountsApi'
import { getDisplayNameForEdit, validateUsername } from '../lib/authDisplay'
import { getSupabase } from '../lib/supabase'
import { INCOME_CATEGORIES } from '../data/budgetTypes'
import SelectField from '../components/SelectField'
import { useI18n } from '../i18n/I18nProvider'
import { categoryLabel, type MessageKey } from '../i18n/locales'

const FREE_BULLET_KEYS: MessageKey[] = [
  'subscriptionFreeBullet1',
  'subscriptionFreeBullet2',
  'subscriptionFreeBullet3',
  'subscriptionFreeBullet4',
]

function FreeCheckIcon() {
  return (
    <span className="subscription-free-bullets__check" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function notifyRecurringChanged() {
  window.dispatchEvent(new Event('budgetpilot:recurring-changed'))
}

export default function AccountPage() {
  const { t } = useI18n()
  const { user, cloudAvailable } = useAuth()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [premiumNotice, setPremiumNotice] = useState(false)
  const [hubInviteEmail, setHubInviteEmail] = useState('')
  const [hubInviteNotice, setHubInviteNotice] = useState(false)
  const [recErr, setRecErr] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  /** First load finished — subscription/recurring list can reflect server data */
  const [accountDataReady, setAccountDataReady] = useState(false)

  const [recurring, setRecurring] = useState<RecurringIncomeRow[]>([])
  const [recAmount, setRecAmount] = useState('')
  const [recDay, setRecDay] = useState('1')
  const [recCategory, setRecCategory] = useState<string>(INCOME_CATEGORIES[0])
  const [recNote, setRecNote] = useState('')
  const [recPending, setRecPending] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    try {
      setLoadError(null)
      const [p, r] = await Promise.all([
        fetchProfile(user.id),
        fetchRecurringIncomes(user.id),
      ])
      setProfile(p)
      setRecurring(r)
      if (user) setName(getDisplayNameForEdit(user))
      if (p?.age != null) setAge(String(p.age))
      else setAge('')
    } catch {
      setLoadError(t('accountSaveErrorProfile'))
    } finally {
      setAccountDataReady(true)
    }
  }, [user, t])

  useEffect(() => {
    if (user) void load()
  }, [user, load])

  useEffect(() => {
    if (user) setName(getDisplayNameForEdit(user))
  }, [user])

  if (!cloudAvailable) {
    return (
      <div className="page">
        <p className="muted">{t('accountCloudOnly')}</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSaved(false)
    setPremiumNotice(false)

    const trimmed = name.trim()
    if (!validateUsername(trimmed)) {
      setProfileError(t('authUsernameInvalid'))
      return
    }

    const raw = age.trim()
    let n: number | null = null
    if (raw !== '') {
      n = Number(raw)
      if (!Number.isInteger(n) || n < 13 || n > 120) {
        setProfileError(t('accountAgeInvalid'))
        return
      }
    }

    const sb = getSupabase()
    if (!sb) {
      setProfileError(t('authErrorCloudUnavailable'))
      return
    }
    setPending(true)
    const { error: uErr } = await sb.auth.updateUser({ data: { username: trimmed } })
    if (uErr) {
      setProfileError(t('accountSaveErrorAuth'))
      setPending(false)
      return
    }
    const { error: pErr } = await upsertProfileBasics(user.id, user.email ?? null, trimmed, n)
    setPending(false)
    if (pErr) {
      setProfileError(t('accountSaveErrorProfile'))
      return
    }
    setProfileSaved(true)
    void load()
  }

  const onAddRecurring = async (e: FormEvent) => {
    e.preventDefault()
    setRecErr(null)
    const amount = Number(recAmount.replace(',', '.'))
    const day = Number(recDay)
    if (!Number.isFinite(amount) || amount <= 0) return
    if (!Number.isInteger(day) || day < 1 || day > 31) return
    setRecPending(true)
    const { error: err } = await insertRecurringIncome({
      user_id: user.id,
      amount,
      category: recCategory,
      day_of_month: day,
      note: recNote.trim(),
    })
    setRecPending(false)
    if (err) {
      setRecErr(t('accountSaveErrorProfile'))
      return
    }
    setRecAmount('')
    setRecNote('')
    notifyRecurringChanged()
    void load()
  }

  const onDeleteRecurring = async (id: string) => {
    setRecErr(null)
    const { error: err } = await deleteRecurringIncome(id)
    if (err) {
      setRecErr(t('accountSaveErrorProfile'))
      return
    }
    notifyRecurringChanged()
    void load()
  }

  const planLabel =
    profile?.plan === 'premium' ? t('subscriptionPlanPremium') : t('subscriptionPlanFree')
  const isPremium = accountDataReady && profile?.plan === 'premium'

  const categoryOptions = INCOME_CATEGORIES.map((c) => ({
    value: c,
    label: categoryLabel(c, t),
  }))

  const onHubInviteSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isPremium) return
    setHubInviteNotice(true)
  }

  return (
    <div className="page page--account">
      <div className="section-heading">
        <h1 className="page-title">{t('accountTitle')}</h1>
        <p className="section-desc">{t('accountDesc')}</p>
      </div>

      {loadError && <p className="auth-error">{loadError}</p>}

      {!accountDataReady && !loadError ? (
        <section
          className="subscription-block subscription-block--skeleton"
          aria-busy="true"
          aria-label={t('subscriptionHeading')}
        >
          <h2 className="section-title section-title--inline">{t('subscriptionHeading')}</h2>
          <div className="subscription-skeleton">
            <div className="subscription-skeleton__line subscription-skeleton__line--wide" />
            <div className="subscription-skeleton__line subscription-skeleton__line--mid" />
            <div className="subscription-skeleton__grid">
              <div className="subscription-skeleton__card" />
              <div className="subscription-skeleton__card" />
            </div>
            <div className="subscription-skeleton__hub" />
          </div>
        </section>
      ) : (
        <section className="subscription-block">
          <h2 className="section-title section-title--inline">{t('subscriptionHeading')}</h2>
          <p className="subscription-current">
            <span className="subscription-current__label">{t('subscriptionCurrentLabel')}:</span>{' '}
            <strong>{planLabel}</strong>
          </p>
            <h3 className="subscription-compare-title">{t('subscriptionCompareTitle')}</h3>
            <div className="subscription-grid">
              <div className="subscription-card subscription-card--free panel">
                <div className="subscription-card__badge">{t('subscriptionFreeCardTitle')}</div>
                <p className="subscription-card__lead">{t('subscriptionFreeCardBody')}</p>
                <ul className="subscription-free-bullets">
                  {FREE_BULLET_KEYS.map((key) => (
                    <li key={key}>
                      <FreeCheckIcon />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="subscription-card subscription-card--premium panel">
                <h4 className="subscription-card__title">{t('subscriptionPremiumCardTitle')}</h4>
                <p className="subscription-card__body">{t('subscriptionPremiumCardBody')}</p>
                <ul className="subscription-features">
                  <li>{t('subscriptionFeature1')}</li>
                  <li>{t('subscriptionFeature2')}</li>
                  <li>{t('subscriptionFeature3')}</li>
                  <li>{t('subscriptionFeature4')}</li>
                </ul>
                <div className="subscription-card__cta">
                  {isPremium ? (
                    <p className="subscription-card__status">{t('subscriptionAlreadyPremium')}</p>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn-primary subscription-buy-btn"
                        onClick={() => {
                          setPremiumNotice(true)
                          setProfileError(null)
                        }}
                      >
                        {t('subscriptionBuy')}
                      </button>
                      {premiumNotice && (
                        <p className="field-hint subscription-buy-hint">{t('subscriptionBuySoon')}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={
                'premium-hub panel' + (!isPremium ? ' premium-hub--locked' : ' premium-hub--active')
              }
            >
              {!isPremium && (
                <div className="premium-hub__lock" aria-hidden="true">
                  <span className="premium-hub__lock-badge">{t('subscriptionLockedLabel')}</span>
                </div>
              )}
              <div className="premium-hub__inner">
                <h3 className="premium-hub__title">{t('subscriptionHubTitle')}</h3>
                <p className="premium-hub__desc">{t('subscriptionHubDesc')}</p>
                <ul className="premium-hub__list">
                  <li>{t('subscriptionHubItem1')}</li>
                  <li>{t('subscriptionHubItem2')}</li>
                  <li>{t('subscriptionHubItem3')}</li>
                  <li>{t('subscriptionHubItem4')}</li>
                  <li>{t('subscriptionHubItem5')}</li>
                </ul>
                <form className="premium-hub__invite" onSubmit={onHubInviteSubmit}>
                  <span className="form-field-label premium-hub__invite-label">
                    {t('subscriptionHubInviteLabel')}
                  </span>
                  <div className="premium-hub__invite-row">
                    <input
                      type="email"
                      className="premium-hub__invite-input"
                      placeholder={t('subscriptionHubInvitePlaceholder')}
                      value={hubInviteEmail}
                      onChange={(e) => {
                        setHubInviteEmail(e.target.value)
                        setHubInviteNotice(false)
                      }}
                      disabled={!isPremium}
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      className="btn-primary premium-hub__invite-btn"
                      disabled={!isPremium}
                    >
                      {t('subscriptionHubInviteButton')}
                    </button>
                  </div>
                  {hubInviteNotice && isPremium && (
                    <p className="field-hint premium-hub__invite-hint">{t('subscriptionHubInviteSoon')}</p>
                  )}
                </form>
              </div>
            </div>
        </section>
      )}

      <div className="panel account-panel">
            <h2 className="section-title section-title--inline">{t('accountProfileSection')}</h2>
            <div className="account-readonly">
              <span className="form-field-label">{t('accountEmailLabel')}</span>
              <p className="account-readonly__value">{user.email}</p>
            </div>

            <form className="form form--structured account-form" onSubmit={onSaveProfile}>
              <label className="form-field">
                <span className="form-field-label">{t('authUsername')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setProfileSaved(false)
                  }}
                  maxLength={40}
                  autoComplete="nickname"
                  required
                  minLength={2}
                />
              </label>
              <label className="form-field">
                <span className="form-field-label">{t('accountAgeLabel')}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={13}
                  max={120}
                  placeholder="—"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value)
                    setProfileSaved(false)
                  }}
                />
                <span className="field-hint">{t('accountAgeHint')}</span>
              </label>
              {profileError && <p className="auth-error">{profileError}</p>}
              {profileSaved && <p className="account-saved">{t('accountSaved')}</p>}
              <div className="form-actions account-form__actions">
                <button type="submit" className="btn-primary" disabled={pending}>
                  {t('accountSave')}
                </button>
              </div>
            </form>
          </div>

          <section className="recurring-block">
            <h2 className="section-title section-title--inline">{t('recurringTitle')}</h2>
            <p className="section-desc">{t('recurringDesc')}</p>

            <form className="panel recurring-form" onSubmit={onAddRecurring}>
              <div className="form-grid form-grid--2 recurring-form__grid">
                <label className="form-field">
                  <span className="form-field-label">{t('recurringAmount')}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={recAmount}
                    onChange={(e) => setRecAmount(e.target.value)}
                    required
                  />
                </label>
                <label className="form-field">
                  <span className="form-field-label">{t('recurringDay')}</span>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={recDay}
                    onChange={(e) => setRecDay(e.target.value)}
                    required
                  />
                </label>
                <div className="form-field">
                  <span className="form-field-label">{t('recurringCategory')}</span>
                  <SelectField
                    value={recCategory}
                    onChange={setRecCategory}
                    options={categoryOptions}
                    ariaLabel={t('recurringCategory')}
                  />
                </div>
                <label className="form-field">
                  <span className="form-field-label">{t('recurringNote')}</span>
                  <input
                    type="text"
                    value={recNote}
                    onChange={(e) => setRecNote(e.target.value)}
                  />
                </label>
              </div>
              {recErr && <p className="auth-error">{recErr}</p>}
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={recPending}>
                  {t('recurringAdd')}
                </button>
              </div>
            </form>

            {!accountDataReady ? (
              <p className="muted recurring-empty" aria-busy="true">
                …
              </p>
            ) : recurring.length === 0 ? (
              <p className="muted recurring-empty">{t('recurringEmpty')}</p>
            ) : (
              <ul className="recurring-list">
                {recurring.map((r) => (
                  <li key={r.id} className="recurring-list__item panel">
                    <div>
                      <strong>{r.amount} ₽</strong> · {categoryLabel(r.category, t)} · {t('recurringDay')}:{' '}
                      {r.day_of_month}
                      {r.note ? ` · ${r.note}` : ''}
                    </div>
                    <button
                      type="button"
                      className="recurring-list__del"
                      onClick={() => onDeleteRecurring(r.id)}
                    >
                      {t('recurringDelete')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
    </div>
  )
}
