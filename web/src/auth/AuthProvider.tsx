import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthError, Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

/** Stable codes for UI copy; raw messages are not exposed to users. */
function normalizeAuthError(error: AuthError | null): string | null {
  if (!error) return null
  const code = error.code
  if (code === 'email_not_confirmed') return 'email_not_confirmed'
  if (code === 'invalid_credentials') return 'invalid_credentials'
  if (code === 'weak_password') return 'weak_password'
  const msg = error.message?.toLowerCase() ?? ''
  if (msg.includes('email not confirmed')) return 'email_not_confirmed'
  return 'unknown'
}

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  cloudAvailable: boolean
  /** Подтянуть сессию из клиента (после updateUser и т.п.), чтобы UI сразу видел новые user_metadata. */
  refreshAuth: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    username?: string,
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- нет клиента: сразу убираем «загрузку»
      setLoading(false)
      return
    }

    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'cloud_unavailable' }
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return { error: normalizeAuthError(error) }
  }, [])

  const signUp = useCallback(async (email: string, password: string, username?: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'cloud_unavailable' }
    const name = username?.trim()
    const { error } = await sb.auth.signUp({
      email,
      password,
      options:
        name && name.length > 0
          ? { data: { username: name } }
          : undefined,
    })
    return { error: normalizeAuthError(error) }
  }, [])

  const signOut = useCallback(async () => {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
    setSession(null)
  }, [])

  const refreshAuth = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data: refData, error: refErr } = await sb.auth.refreshSession()
    if (!refErr && refData.session) {
      setSession(refData.session)
      return
    }
    const {
      data: { session: next },
      error,
    } = await sb.auth.getSession()
    if (!error) setSession(next)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      cloudAvailable: isSupabaseConfigured,
      refreshAuth,
      signIn,
      signUp,
      signOut,
    }),
    [session, loading, refreshAuth, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* eslint-disable react-refresh/only-export-components -- useAuth is the public API for this module */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
