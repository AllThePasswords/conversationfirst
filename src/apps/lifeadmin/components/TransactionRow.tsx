import { format } from 'date-fns'
import { EnvelopeIcon, BuildingLibraryIcon } from '@heroicons/react/20/solid'
import type { UnifiedLineItem } from '../lib/types'

interface TransactionRowProps {
  item: UnifiedLineItem
  onClick?: (item: UnifiedLineItem) => void
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

function sourceAriaLabel(source: UnifiedLineItem['source']): string {
  switch (source) {
    case 'bank': return 'Bank transaction'
    case 'bill': return 'Email bill'
    case 'hydrated': return 'Matched \u2014 bank and email'
  }
}

function statusLabel(status: UnifiedLineItem['status']): string {
  switch (status) {
    case 'confirmed': return 'Confirmed'
    case 'pending': return 'Pending'
    case 'pending_extraction': return 'Extracting'
    case 'pending_review': return 'Review'
    case 'overdue': return 'Overdue'
  }
}

export default function TransactionRow({ item, onClick }: TransactionRowProps) {
  const hasAmount = item.amount !== null && item.amount !== undefined && item.amount !== 0
  const isNegative = hasAmount && item.amount < 0
  const dateStr = format(new Date(item.date), 'dd MMM yyyy')

  return (
    <tr
      className={`la-row${onClick ? ' la-row-clickable' : ''}`}
      onClick={onClick ? () => onClick(item) : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(item) }
      } : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${item.description}` : undefined}
    >
      <td className="la-cell-date">{dateStr}</td>
      <td className="la-cell-desc">
        <span className="la-desc-text">{item.description}</span>
        {item.entity_label && (
          <span className="la-entity-label">{item.entity_label}</span>
        )}
      </td>
      <td className="la-cell-category">{item.category ?? '\u2014'}</td>
      <td className="la-cell-source">
        <span className={`la-source-icons la-source-${item.source}`} aria-label={sourceAriaLabel(item.source)}>
          {(item.source === 'bank' || item.source === 'hydrated') && (
            <BuildingLibraryIcon className="la-source-icon" />
          )}
          {(item.source === 'bill' || item.source === 'hydrated') && (
            <EnvelopeIcon className="la-source-icon" />
          )}
        </span>
      </td>
      <td className={`la-cell-amount col-num ${isNegative ? 'negative' : hasAmount ? 'positive' : ''}`}>
        {hasAmount
          ? <>{isNegative ? '\u2212' : ''}{formatAmount(item.amount, item.currency)}</>
          : '\u2014'}
      </td>
      <td className="la-cell-status">
        <span className={`la-status la-status-${item.status}`}>
          {statusLabel(item.status)}
        </span>
      </td>
    </tr>
  )
}
