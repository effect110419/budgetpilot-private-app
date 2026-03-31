import { getSupabase } from './supabase'

export type ProfileRow = {
  id: string
  email: string | null
  display_name: string | null
  plan: 'free' | 'premium'
  age: number | null
  settings?: Record<string, unknown>
  created_at?: string
}

export type RecurringIncomeRow = {
  id: string
  user_id: string
  amount: number
  category: string
  day_of_month: number
  note: string
  enabled: boolean
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from('profiles')
    .select('id, plan, age, email, display_name')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as ProfileRow | null
}

export async function upsertProfileDisplayName(
  userId: string,
  email: string | null,
  displayName: string,
): Promise<{ error: Error | null }> {
  const sb = getSupabase()
  if (!sb) return { error: new Error('no_supabase') }
  const { error } = await sb.from('profiles').upsert(
    {
      id: userId,
      email: email ?? undefined,
      display_name: displayName,
    },
    { onConflict: 'id' },
  )
  return { error: error ? new Error(error.message) : null }
}

export async function updateProfileAge(
  userId: string,
  email: string | null,
  age: number | null,
): Promise<{ error: Error | null }> {
  const sb = getSupabase()
  if (!sb) return { error: new Error('no_supabase') }
  const { error } = await sb.from('profiles').upsert(
    {
      id: userId,
      email: email ?? undefined,
      age,
    },
    { onConflict: 'id' },
  )
  return { error: error ? new Error(error.message) : null }
}

/** Одним запросом: имя в профиле и возраст (после updateUser для metadata). */
export async function upsertProfileBasics(
  userId: string,
  email: string | null,
  displayName: string,
  age: number | null,
): Promise<{ error: Error | null }> {
  const sb = getSupabase()
  if (!sb) return { error: new Error('no_supabase') }
  const { error } = await sb.from('profiles').upsert(
    {
      id: userId,
      email: email ?? undefined,
      display_name: displayName,
      age,
    },
    { onConflict: 'id' },
  )
  return { error: error ? new Error(error.message) : null }
}

export async function fetchRecurringIncomes(userId: string): Promise<RecurringIncomeRow[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from('recurring_incomes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as RecurringIncomeRow[]
}

export async function insertRecurringIncome(row: {
  user_id: string
  amount: number
  category: string
  day_of_month: number
  note: string
}): Promise<{ error: Error | null }> {
  const sb = getSupabase()
  if (!sb) return { error: new Error('no_supabase') }
  const { error } = await sb.from('recurring_incomes').insert({
    user_id: row.user_id,
    amount: row.amount,
    category: row.category,
    day_of_month: row.day_of_month,
    note: row.note,
    enabled: true,
  })
  return { error: error ? new Error(error.message) : null }
}

export async function deleteRecurringIncome(id: string): Promise<{ error: Error | null }> {
  const sb = getSupabase()
  if (!sb) return { error: new Error('no_supabase') }
  const { error } = await sb.from('recurring_incomes').delete().eq('id', id)
  return { error: error ? new Error(error.message) : null }
}
