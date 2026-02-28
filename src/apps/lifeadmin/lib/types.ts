import { subMonths, format } from 'date-fns'

// LifeAdmin TypeScript types
// Mirrors the Supabase schema. All IDs are UUIDs (string).

export interface Household {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserHousehold {
  id: string
  user_id: string
  household_id: string
  is_owner: boolean
  created_at: string
}

export interface BankConnection {
  id: string
  household_id: string
  provider: string
  access_token: string | null
  refresh_token: string | null
  token_expires_at: string | null
  consent_expires_at: string | null
  status: 'active' | 'expired' | 'revoked'
  institution_id: string | null
  institution_name: string | null
  created_at: string
  updated_at: string
}

export interface BankAccount {
  id: string
  connection_id: string
  household_id: string
  external_id: string
  account_type: string | null
  display_name: string | null
  currency: string
  iban: string | null
  sort_code: string | null
  account_number: string | null
  last_synced_at: string | null
  sync_error: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  household_id: string
  account_id: string
  external_id: string | null
  fingerprint: string
  amount: number
  currency: string
  description: string | null
  merchant_name: string | null
  timestamp: string
  category: string | null
  subcategory: string | null
  is_pending: boolean
  running_balance: number | null
  ai_category: string | null
  ai_subcategory: string | null
  ai_confidence: number | null
  merchant_normalized: string | null
  category_override: string | null
  matched_bill_id: string | null
  match_confidence: number | null
  is_recurring: boolean
  recurring_pattern_id: string | null
  raw_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  household_id: string
  provider: string | null
  amount: number | null
  currency: string
  due_date: string | null
  status: 'pending_extraction' | 'pending_review' | 'confirmed' | 'rejected'
  category: string | null
  confidence: number | null
  billing_period_start: string | null
  billing_period_end: string | null
  account_number: string | null
  reference_number: string | null
  tariff_data: Record<string, unknown> | null
  line_items: Array<{ description: string; amount: number; quantity?: number; unit_price?: number }> | null
  previous_balance: number | null
  email_subject: string | null
  email_sender: string | null
  email_date: string | null
  message_id: string | null
  attachment_id: string | null
  storage_path: string | null
  original_filename: string | null
  property_id: string | null
  vehicle_id: string | null
  child_id: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  household_id: string
  address_line1: string
  address_line2: string | null
  city: string | null
  county: string | null
  postcode: string | null
  eircode: string | null
  council_tax_band: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PropertyUtility {
  id: string
  property_id: string
  household_id: string
  utility_type: string
  provider_name: string
  account_number: string | null
  monthly_amount: number | null
  contract_end_date: string | null
  tariff_name: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  household_id: string
  make: string
  model: string
  year: number | null
  registration: string | null
  nct_due_date: string | null
  insurance_due_date: string | null
  tax_due_date: string | null
  service_due_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Child {
  id: string
  household_id: string
  name: string
  date_of_birth: string | null
  school: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChildExpense {
  id: string
  child_id: string
  household_id: string
  description: string
  amount: number
  currency: string
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'one-off'
  category: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringPattern {
  id: string
  household_id: string
  merchant_name: string
  amount: number | null
  currency: string
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual'
  confidence: number | null
  last_seen_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Unified list types ───────────────────────

export type LineItemSource = 'bank' | 'bill' | 'hydrated'
export type LineItemStatus = 'confirmed' | 'pending' | 'pending_extraction' | 'pending_review' | 'overdue'

export interface UnifiedLineItem {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: string | null
  source: LineItemSource
  entity_label: string | null
  status: LineItemStatus
  provider: string | null
  is_recurring: boolean
  // Original references
  transaction_id: string | null
  bill_id: string | null
}

// ─── Detail modal payload ─────────────────────

export type BillDetailData =
  | { kind: 'bill'; bill: Bill; transaction: Transaction | null }
  | { kind: 'transaction'; transaction: Transaction }

// ─── Filter types ─────────────────────────────

export type BillCategory =
  | 'utilities'
  | 'insurance'
  | 'subscription'
  | 'education'
  | 'activities'
  | 'telecom'
  | 'council'
  | 'groceries'
  | 'transport'
  | 'dining'
  | 'health'
  | 'entertainment'
  | 'other'

export interface ListFilters {
  dateFrom: string | null
  dateTo: string | null
  categories: BillCategory[]
  sources: LineItemSource[]
  entityId: string | null
  entityType: 'property' | 'vehicle' | 'child' | null
  search: string
}

export const DEFAULT_FILTERS: ListFilters = {
  dateFrom: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
  dateTo: format(new Date(), 'yyyy-MM-dd'),
  categories: [],
  sources: [],
  entityId: null,
  entityType: null,
  search: '',
}

// ─── Entity union for filter dropdown ─────────

export interface EntityOption {
  id: string
  label: string
  type: 'property' | 'vehicle' | 'child'
}
