import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/20/solid'
import {
  DocumentTextIcon,
  BuildingLibraryIcon,
  BoltIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import type { Bill, Transaction, BillDetailData } from '../lib/types'

interface BillDetailModalProps {
  data: BillDetailData | null
  loading: boolean
  onClose: () => void
}

// ─── Formatting helpers ──────────────────────

function fmtCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function fmtDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  try {
    return format(new Date(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

// ─── Reusable sub-components ─────────────────

function Section({ label, icon, children }: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="la-detail-section">
      <div className="la-detail-section-header">
        {icon}
        <span className="la-detail-section-label">{label}</span>
      </div>
      <div className="la-detail-section-body">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, mono }: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="la-detail-row">
      <span className="la-detail-row-label">{label}</span>
      <span className={`la-detail-row-value${mono ? ' la-detail-row-mono' : ''}`}>{value}</span>
    </div>
  )
}

// ─── Tariff section ──────────────────────────

function TariffSection({ tariff, currency }: { tariff: Record<string, unknown>; currency: string }) {
  const unitRate = tariff.unitRate as number | undefined
  const unitType = (tariff.unitType as string | undefined) ?? 'unit'
  const standingCharge = tariff.standingCharge as number | undefined
  const standingChargePeriod = (tariff.standingChargePeriod as string | undefined) ?? 'day'
  const planName = tariff.planName as string | undefined
  const contractEndDate = tariff.contractEndDate as string | undefined
  const earlyExitFee = tariff.earlyExitFee as number | undefined

  const hasContent = unitRate != null || standingCharge != null || planName || contractEndDate

  if (!hasContent) return null

  return (
    <Section label="Tariff" icon={<BoltIcon className="la-detail-section-icon" aria-hidden="true" />}>
      <Row label="Plan" value={planName} />
      <Row label="Unit rate" value={unitRate != null ? `${unitRate}c/${unitType}` : null} mono />
      <Row
        label="Standing charge"
        value={standingCharge != null ? `${fmtCurrency(standingCharge, currency)}/${standingChargePeriod}` : null}
        mono
      />
      <Row label="Contract end" value={fmtDate(contractEndDate)} mono />
      <Row label="Early exit fee" value={earlyExitFee != null ? fmtCurrency(earlyExitFee, currency) : null} mono />
    </Section>
  )
}

// ─── Line items section ──────────────────────

function LineItemsSection({ items, currency }: {
  items: Array<{ description: string; amount: number; quantity?: number; unit_price?: number }>
  currency: string
}) {
  if (!items.length) return null
  return (
    <Section label="Line items" icon={<DocumentTextIcon className="la-detail-section-icon" aria-hidden="true" />}>
      <table className="la-detail-line-items" role="table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="col-num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((li, i) => (
            <tr key={i}>
              <td>{li.description}</td>
              <td className="col-num">{fmtCurrency(li.amount, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

// ─── Confidence indicator ────────────────────

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  return (
    <div className="la-detail-confidence">
      <div className="la-detail-confidence-bar">
        <div className="la-detail-confidence-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="la-detail-confidence-label">{pct}%</span>
    </div>
  )
}

// ─── Bill detail view ────────────────────────

function BillDetail({ bill, transaction }: { bill: Bill; transaction: Transaction | null }) {
  const currency = bill.currency ?? 'EUR'
  const hasTariff = bill.tariff_data && Object.keys(bill.tariff_data).length > 0
  const hasLineItems = bill.line_items && bill.line_items.length > 0
  const hasAccount = bill.account_number || bill.reference_number || bill.previous_balance != null
  const hasBillingPeriod = bill.billing_period_start || bill.billing_period_end
  const hasEmail = bill.email_subject

  return (
    <>
      {/* Summary */}
      <Section label="Summary" icon={<DocumentTextIcon className="la-detail-section-icon" aria-hidden="true" />}>
        {bill.amount != null && (
          <div className="la-detail-amount">{fmtCurrency(bill.amount, currency)}</div>
        )}
        <Row label="Provider" value={bill.provider} />
        <Row label="Category" value={bill.category} />
        <Row label="Status" value={bill.status?.replace('_', ' ')} />
        <Row label="Email date" value={fmtDate(bill.email_date)} mono />
        <Row label="Due date" value={fmtDate(bill.due_date)} mono />
        {hasBillingPeriod && (
          <Row
            label="Billing period"
            value={`${fmtDate(bill.billing_period_start) ?? '\u2014'} \u2013 ${fmtDate(bill.billing_period_end) ?? '\u2014'}`}
            mono
          />
        )}
        {bill.confidence != null && (
          <Row label="Confidence" value={<ConfidenceBar confidence={bill.confidence} />} />
        )}
      </Section>

      {/* Tariff */}
      {hasTariff && <TariffSection tariff={bill.tariff_data!} currency={currency} />}

      {/* Line items */}
      {hasLineItems && <LineItemsSection items={bill.line_items!} currency={currency} />}

      {/* Account details */}
      {hasAccount && (
        <Section label="Account" icon={<IdentificationIcon className="la-detail-section-icon" aria-hidden="true" />}>
          <Row label="Account number" value={bill.account_number} mono />
          <Row label="Reference" value={bill.reference_number} mono />
          <Row
            label="Previous balance"
            value={bill.previous_balance != null ? fmtCurrency(bill.previous_balance, currency) : null}
            mono
          />
        </Section>
      )}

      {/* Email source */}
      {hasEmail && (
        <Section label="Email source" icon={<EnvelopeIcon className="la-detail-section-icon" aria-hidden="true" />}>
          <Row label="Subject" value={bill.email_subject} />
          <Row label="From" value={bill.email_sender} />
          <Row label="Date" value={fmtDate(bill.email_date)} mono />
        </Section>
      )}

      {/* Matched bank transaction */}
      {transaction && (
        <Section label="Bank transaction" icon={<BuildingLibraryIcon className="la-detail-section-icon" aria-hidden="true" />}>
          <Row label="Description" value={transaction.description} />
          <Row label="Merchant" value={transaction.merchant_normalized ?? transaction.merchant_name} />
          <Row label="Bank category" value={transaction.category} />
          <Row label="Date" value={fmtDate(transaction.timestamp)} mono />
          {transaction.is_pending && <Row label="Status" value="Pending" />}
        </Section>
      )}
    </>
  )
}

// ─── Transaction detail view (bank-only) ─────

function TransactionDetail({ transaction }: { transaction: Transaction }) {
  const currency = transaction.currency ?? 'EUR'

  return (
    <Section label="Bank transaction" icon={<BuildingLibraryIcon className="la-detail-section-icon" aria-hidden="true" />}>
      {transaction.amount != null && (
        <div className="la-detail-amount">{fmtCurrency(Math.abs(transaction.amount), currency)}</div>
      )}
      <Row label="Merchant" value={transaction.merchant_normalized ?? transaction.merchant_name} />
      <Row label="Description" value={transaction.description} />
      <Row label="Date" value={fmtDate(transaction.timestamp)} mono />
      <Row label="Category" value={transaction.ai_category ?? transaction.category} />
      {transaction.is_pending && <Row label="Status" value="Pending" />}
      {transaction.is_recurring && <Row label="Recurring" value="Yes" />}
    </Section>
  )
}

// ─── Modal shell ─────────────────────────────

export default function BillDetailModal({ data, loading, onClose }: BillDetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  // Capture and restore focus
  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement
    panelRef.current?.focus()
    return () => { previousFocus.current?.focus() }
  }, [])

  // Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [])

  const title = loading
    ? 'Loading\u2026'
    : data?.kind === 'bill'
      ? data.bill.provider ?? 'Bill detail'
      : 'Transaction detail'

  return createPortal(
    <>
      <div className="la-detail-backdrop" onClick={onClose} />
      <div
        ref={panelRef}
        className="la-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="la-detail-header">
          <div className="la-detail-header-left">
            <DocumentTextIcon className="la-detail-header-icon" aria-hidden="true" />
            <h2 className="la-detail-title">{title}</h2>
          </div>
          <button className="la-detail-close" onClick={onClose} aria-label="Close detail">
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>

        <div className="la-detail-body" aria-live="polite">
          {loading && (
            <div className="la-detail-loading">
              <span className="cf-loading-cursor" aria-hidden="true" />
              <span className="la-detail-loading-text">Fetching detail</span>
            </div>
          )}
          {!loading && data?.kind === 'bill' && (
            <BillDetail bill={data.bill} transaction={data.transaction} />
          )}
          {!loading && data?.kind === 'transaction' && (
            <TransactionDetail transaction={data.transaction} />
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
