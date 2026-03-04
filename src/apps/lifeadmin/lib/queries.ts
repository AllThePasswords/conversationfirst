import { supabase } from '../../../lib/supabase'
import {
  fetchUserHouseholdId as _fetchUserHouseholdId,
  ensureHousehold,
} from '../../../lib/connections'
import type {
  Transaction,
  Bill,
  BankAccount,
  BankConnection,
  Property,
  PropertyUtility,
  Vehicle,
  Child,
  ChildExpense,
  RecurringPattern,
  UnifiedLineItem,
  EntityOption,
} from './types'

// ─── Household (re-exported from platform) ────

export const fetchUserHouseholdId = _fetchUserHouseholdId

export async function createHouseholdForUser(): Promise<string | null> {
  try {
    return await ensureHousehold()
  } catch {
    return null
  }
}

// ─── Transactions ─────────────────────────────

export async function fetchTransactions(
  householdId: string,
  opts?: { from?: string; to?: string; category?: string; limit?: number }
): Promise<Transaction[]> {
  const pageSize = opts?.limit ?? 5000;
  const allRows: Transaction[] = [];
  let from = 0;

  // Supabase defaults to 1000 rows. Paginate to get everything
  while (true) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('household_id', householdId)
      .order('timestamp', { ascending: false })
      .range(from, from + pageSize - 1)

    if (opts?.from) query = query.gte('timestamp', opts.from)
    if (opts?.to) query = query.lte('timestamp', opts.to)
    if (opts?.category) query = query.or(`category.eq.${opts.category},ai_category.eq.${opts.category}`)

    const { data, error } = await query
    if (error) throw error

    const rows = (data ?? []) as Transaction[]
    allRows.push(...rows)

    // If we got fewer rows than page size, we've reached the end
    if (rows.length < pageSize) break
    // If a specific limit was requested, stop after one page
    if (opts?.limit) break
    from += pageSize
  }

  return allRows
}

// ─── Bills ────────────────────────────────────

export async function fetchBills(
  householdId: string,
  opts?: { status?: string; category?: string; from?: string; to?: string }
): Promise<Bill[]> {
  const pageSize = 5000;
  const allRows: Bill[] = [];
  let from = 0;

  // Supabase defaults to 1000 rows. Paginate to get everything
  while (true) {
    let query = supabase
      .from('bills')
      .select('*')
      .eq('household_id', householdId)
      .order('due_date', { ascending: false })
      .range(from, from + pageSize - 1)

    if (opts?.status) query = query.eq('status', opts.status)
    else query = query.neq('status', 'rejected')
    if (opts?.category) query = query.eq('category', opts.category)
    if (opts?.from) query = query.or(`due_date.gte.${opts.from},due_date.is.null`)
    if (opts?.to) query = query.or(`due_date.lte.${opts.to},due_date.is.null`)

    const { data, error } = await query
    if (error) throw error

    const rows = (data ?? []) as Bill[]
    allRows.push(...rows)

    if (rows.length < pageSize) break
    from += pageSize
  }

  return allRows
}

// ─── Single-record fetches (for detail modal) ────

export async function fetchBillById(billId: string): Promise<Bill | null> {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', billId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as Bill
}

export async function fetchTransactionById(txId: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', txId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as Transaction
}

// ─── Bank accounts (via unified connection_accounts table) ────

export async function fetchBankAccounts(householdId: string): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from('connection_accounts')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)
    .order('display_name')

  if (error) throw error
  // Map from connection_accounts schema (metadata jsonb) to BankAccount shape
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id,
    connection_id: row.connection_id,
    household_id: row.household_id,
    external_id: row.external_id,
    account_type: row.account_type,
    display_name: row.display_name,
    currency: row.currency,
    iban: (row.metadata as Record<string, unknown>)?.iban ?? null,
    sort_code: (row.metadata as Record<string, unknown>)?.sort_code ?? null,
    account_number: (row.metadata as Record<string, unknown>)?.account_number ?? null,
    last_synced_at: row.last_synced_at,
    sync_error: row.sync_error,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  })) as BankAccount[]
}

export async function fetchBankConnections(householdId: string): Promise<BankConnection[]> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('household_id', householdId)
    .eq('provider_type', 'bank')
    .order('created_at', { ascending: false })

  if (error) throw error
  // Map from connections schema (metadata jsonb) to BankConnection shape
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id,
    household_id: row.household_id,
    provider: row.provider_name,
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    token_expires_at: row.token_expires_at,
    consent_expires_at: row.consent_expires_at,
    status: row.status,
    institution_id: (row.metadata as Record<string, unknown>)?.institution_id ?? null,
    institution_name: (row.metadata as Record<string, unknown>)?.institution_name ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  })) as BankConnection[]
}

// ─── Entities ─────────────────────────────────

export async function fetchProperties(householdId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as Property[]
}

export async function fetchPropertyUtilities(propertyId: string): Promise<PropertyUtility[]> {
  const { data, error } = await supabase
    .from('property_utilities')
    .select('*')
    .eq('property_id', propertyId)

  if (error) throw error
  return (data ?? []) as PropertyUtility[]
}

export async function fetchVehicles(householdId: string): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as Vehicle[]
}

export async function fetchChildren(householdId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as Child[]
}

export async function fetchChildExpenses(childId: string): Promise<ChildExpense[]> {
  const { data, error } = await supabase
    .from('child_expenses')
    .select('*')
    .eq('child_id', childId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as ChildExpense[]
}

export async function fetchRecurringPatterns(householdId: string): Promise<RecurringPattern[]> {
  const { data, error } = await supabase
    .from('recurring_patterns')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)

  if (error) throw error
  return (data ?? []) as RecurringPattern[]
}

// ─── Entity CRUD ─────────────────────────────

export async function createProperty(
  householdId: string,
  data: { address_line1: string; city?: string; postcode?: string }
): Promise<Property> {
  const { data: property, error } = await supabase
    .from('properties')
    .insert({ household_id: householdId, ...data })
    .select('*')
    .single()

  if (error) throw error
  return property as Property
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

export async function createVehicle(
  householdId: string,
  data: { make: string; model: string; year?: number; registration?: string; insurance_due_date?: string; tax_due_date?: string }
): Promise<Vehicle> {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .insert({ household_id: householdId, ...data })
    .select('*')
    .single()

  if (error) throw error
  return vehicle as Vehicle
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

export async function createChild(
  householdId: string,
  data: { name: string; date_of_birth?: string; school?: string }
): Promise<Child> {
  const { data: child, error } = await supabase
    .from('children')
    .insert({ household_id: householdId, ...data })
    .select('*')
    .single()

  if (error) throw error
  return child as Child
}

export async function deleteChild(id: string): Promise<void> {
  const { error } = await supabase
    .from('children')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

// ─── Entity options for filter dropdown ───────

export async function fetchEntityOptions(householdId: string): Promise<EntityOption[]> {
  const [properties, vehicles, children] = await Promise.all([
    fetchProperties(householdId),
    fetchVehicles(householdId),
    fetchChildren(householdId),
  ])

  const options: EntityOption[] = []

  for (const p of properties) {
    options.push({
      id: p.id,
      label: `Property: ${p.address_line1}`,
      type: 'property',
    })
  }

  for (const v of vehicles) {
    options.push({
      id: v.id,
      label: `Car: ${v.make} ${v.model}`,
      type: 'vehicle',
    })
  }

  for (const c of children) {
    options.push({
      id: c.id,
      label: `Child: ${c.name}`,
      type: 'child',
    })
  }

  return options
}

// ─── Unified line items ───────────────────────

export async function fetchUnifiedLineItems(
  householdId: string,
  opts?: { from?: string; to?: string }
): Promise<UnifiedLineItem[]> {
  const [transactions, bills, properties, vehicles, children] = await Promise.all([
    fetchTransactions(householdId, { from: opts?.from, to: opts?.to }),
    fetchBills(householdId, {
      from: opts?.from,
      to: opts?.to,
    }),
    fetchProperties(householdId),
    fetchVehicles(householdId),
    fetchChildren(householdId),
  ])

  // Build entity label maps
  const propMap = new Map(properties.map(p => [p.id, p.address_line1]))
  const vehMap = new Map(vehicles.map(v => [v.id, `${v.make} ${v.model}`]))
  const childMap = new Map(children.map(c => [c.id, c.name]))

  // Build bill lookup so hydrated transactions can pull in bill metadata
  const billMap = new Map(bills.map(b => [b.id, b]))

  // Track which bills are matched to transactions (hydrated)
  const matchedBillIds = new Set<string>()
  const items: UnifiedLineItem[] = []

  // Process transactions: hydrated items merge bill metadata
  for (const tx of transactions) {
    const matchedBill = tx.matched_bill_id ? billMap.get(tx.matched_bill_id) ?? null : null
    const isHydrated = matchedBill !== null
    if (isHydrated) matchedBillIds.add(tx.matched_bill_id!)

    const effectiveCategory = tx.category_override ?? tx.ai_category ?? tx.category

    // For hydrated items, prefer bill's entity label and provider name
    let entityLabel: string | null = null
    if (matchedBill) {
      if (matchedBill.property_id && propMap.has(matchedBill.property_id)) {
        entityLabel = `Property: ${propMap.get(matchedBill.property_id)}`
      } else if (matchedBill.vehicle_id && vehMap.has(matchedBill.vehicle_id)) {
        entityLabel = `Car: ${vehMap.get(matchedBill.vehicle_id)}`
      } else if (matchedBill.child_id && childMap.has(matchedBill.child_id)) {
        entityLabel = `Child: ${childMap.get(matchedBill.child_id)}`
      }
    }

    items.push({
      id: tx.id,
      date: tx.timestamp,
      description: matchedBill?.provider ?? tx.merchant_normalized ?? tx.merchant_name ?? tx.description ?? 'Unknown',
      amount: tx.amount,
      currency: tx.currency,
      category: matchedBill?.category ?? effectiveCategory,
      source: isHydrated ? 'hydrated' : 'bank',
      entity_label: entityLabel,
      status: tx.is_pending ? 'pending' : 'confirmed',
      provider: matchedBill?.provider ?? tx.merchant_normalized ?? tx.merchant_name ?? null,
      is_recurring: tx.is_recurring,
      transaction_id: tx.id,
      bill_id: tx.matched_bill_id,
    })
  }

  // Process unmatched bills
  for (const bill of bills) {
    if (matchedBillIds.has(bill.id)) continue

    let entityLabel: string | null = null
    if (bill.property_id && propMap.has(bill.property_id)) {
      entityLabel = `Property: ${propMap.get(bill.property_id)}`
    } else if (bill.vehicle_id && vehMap.has(bill.vehicle_id)) {
      entityLabel = `Car: ${vehMap.get(bill.vehicle_id)}`
    } else if (bill.child_id && childMap.has(bill.child_id)) {
      entityLabel = `Child: ${childMap.get(bill.child_id)}`
    }

    // Map bill status to display status. Never derive overdue from due_date
    // alone. Auto-pay subscriptions are not overdue. Only show overdue if
    // explicitly flagged in the DB (future: bank transaction matching).
    const s = bill.status as string
    const itemStatus = s === 'pending_review' ? 'pending_review'
      : s === 'pending_extraction' ? 'pending_extraction'
      : s === 'overdue' ? 'overdue'
      : s === 'confirmed' ? 'confirmed'
      : 'pending'

    items.push({
      id: bill.id,
      date: bill.email_date ?? bill.created_at,
      description: bill.provider ?? 'Unknown bill',
      amount: bill.amount ?? 0,
      currency: bill.currency,
      category: bill.category,
      source: 'bill',
      entity_label: entityLabel,
      status: itemStatus,
      provider: bill.provider,
      is_recurring: false,
      transaction_id: null,
      bill_id: bill.id,
    })
  }

  // Sort by date descending
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return items
}
