import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { validateUsername } from '../lib/authDisplay'
import { validateEmailFormat, validatePasswordSignup } from '../lib/validation'
import { useI18n } from '../i18n/I18nProvider'
import type { MessageKey } from '../i18n/locales'

function ArrowBackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeVisibleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function EyeHiddenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function pwdReasonToKey(
  reason: 'short' | 'charset' | 'upper' | 'lower' | 'digit' | 'ok',
): MessageKey | null {
  const m: Record<string, MessageKey> = {
    short: 'authPwdErrShort',
    charset: 'authPwdErrAscii',
    upper: 'authPwdErrUpper',
    lower: 'authPwdErrLower',
    digit: 'authPwdErrDigit',
  }
  return m[reason] ?? null
}

export default function LoginPage() {
  const { t } = useI18n()
  const { signIn, signUp, cloudAvailable } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!cloudAvailable) {
      setError(t('authErrorCloudUnavailable'))
      return
    }

    const em = email.trim()

    if (mode === 'signup') {
      const u = username.trim()
      if (!em) {
        setError(t('authEmailRequired'))
        return
      }
      if (!validateEmailFormat(em)) {
        setError(t('authEmailInvalid'))
        return
      }
      if (!validateUsername(u)) {
        setError(t('authUsernameInvalid'))
        return
      }
      const pv = validatePasswordSignup(password)
      if (!pv.ok) {
        const key = pwdReasonToKey(pv.reason)
        setError(key ? t(key) : t('authErrorWeakPassword'))
        return
      }
    } else {
      if (!em) {
        setError(t('authEmailRequired'))
        return
      }
      if (!validateEmailFormat(em)) {
        setError(t('authEmailInvalid'))
        return
      }
      if (!password) {
        setError(t('authPasswordRequired'))
        return
      }
    }

    setPending(true)
    let err: string | null = null
    if (mode === 'signin') {
      const r = await signIn(em, password)
      err = r.error
    } else {
      const r = await signUp(em, password, username.trim())
      err = r.error
    }
    setPending(false)
    if (err) {
      if (err === 'cloud_unavailable') setError(t('authErrorCloudUnavailable'))
      else if (err === 'email_not_confirmed') setError(t('authErrorEmailNotConfirmed'))
      else if (err === 'invalid_credentials') setError(t('authErrorInvalidCredentials'))
      else if (err === 'weak_password') setError(t('authErrorWeakPassword'))
      else setError(t('authErrorGeneric'))
      return
    }
    navigate('/', { replace: true })
  }

  const toggleMode = () => {
    const next = mode === 'signin' ? 'signup' : 'signin'
    setError(null)
    setUsername('')
    setPasswordVisible(false)
    setSearchParams(next === 'signup' ? { mode: 'signup' } : {})
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-surface">
          <header className="auth-surface__header">
            <p className="auth-surface__eyebrow">{t('appTitle')}</p>
            <h1 className="auth-surface__title">
              {mode === 'signin' ? t('authLoginTitle') : t('authRegisterTitle')}
            </h1>
            <p className="auth-surface__subtitle">{t('authSubtitle')}</p>
          </header>

          <div className="auth-surface__body">
            {!cloudAvailable && (
              <p className="auth-surface__warn">{t('authErrorCloudUnavailable')}</p>
            )}
            <form
              className="form form--structured auth-form"
              onSubmit={onSubmit}
              aria-busy={pending}
              noValidate
            >
              {mode === 'signup' && (
                <label className="form-field">
                  <span className="form-field-label">{t('authUsername')}</span>
                  <input
                    type="text"
                    autoComplete="nickname"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError(null)
                    }}
                    maxLength={40}
                  />
                </label>
              )}
              <label className="form-field">
                <span className="form-field-label">{t('authEmail')}</span>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                />
              </label>
              <label className="form-field form-field--password-auth">
                <span className="form-field-label">{t('authPassword')}</span>
                <div className="auth-password-wrap">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setPasswordVisible((v) => !v)}
                    aria-label={passwordVisible ? t('authPasswordHide') : t('authPasswordShow')}
                    aria-pressed={passwordVisible}
                  >
                    {passwordVisible ? <EyeHiddenIcon /> : <EyeVisibleIcon />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <span className="field-hint auth-field-hint">{t('authPasswordHintList')}</span>
                )}
              </label>
              {error && <p className="auth-error">{error}</p>}
              <div className="form-actions auth-form__submit">
                <button type="submit" className="btn-primary btn-primary--auth" disabled={pending}>
                  {pending && <span className="btn-primary__spinner" aria-hidden />}
                  <span>
                    {pending
                      ? mode === 'signin'
                        ? t('authSubmitLoadingSignIn')
                        : t('authSubmitLoadingSignUp')
                      : mode === 'signin'
                        ? t('authSubmitSignIn')
                        : t('authSubmitSignUp')}
                  </span>
                </button>
              </div>
            </form>
          </div>

          <footer className="auth-surface__footer">
            <button type="button" className="auth-mode-toggle" onClick={toggleMode}>
              {mode === 'signin' ? t('authToggleSignUp') : t('authToggleSignIn')}
            </button>
            <Link className="auth-back-link" to="/">
              <ArrowBackIcon />
              <span>{t('authContinueWithoutLogin')}</span>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  )
}
