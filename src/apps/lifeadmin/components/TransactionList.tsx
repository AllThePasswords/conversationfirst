import type { UnifiedLineItem } from '../lib/types'
import TransactionRow from './TransactionRow'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface TransactionListProps {
  items: UnifiedLineItem[]
  loading: boolean
  totalCount: number
  scanning?: boolean
  onRowClick?: (item: UnifiedLineItem) => void
}

export default function TransactionList({ items, loading, totalCount, scanning, onRowClick }: TransactionListProps) {
  if (loading) {
    return (
      <div className="la-table-wrapper">
        <div className="la-loading">
          <span className="la-loading-cursor" aria-hidden="true" />
          <span className="la-loading-text">Loading transactions</span>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !scanning) {
    return (
      <div className="la-table-wrapper">
        <div className="la-empty">
          <DocumentTextIcon className="la-empty-icon" aria-hidden="true" />
          <p className="la-empty-title">
            {totalCount === 0 ? 'No transactions yet' : 'No matching items'}
          </p>
          <p className="la-empty-desc">
            {totalCount === 0
              ? 'Connect a bank account or upload a bill to get started.'
              : 'Adjust your filters to see more results.'}
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0 && scanning) {
    return (
      <div className="la-table-wrapper">
        <div className="la-scanning-empty">
          <ArrowPathIcon className="cf-spinning la-scanning-icon" aria-hidden="true" />
          <p className="la-scanning-title">Scanning emails for bills</p>
          <p className="la-scanning-desc">Checking your inbox for invoices, statements, and payment notices. New items appear here as they{'\u2019'}re found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="la-table-wrapper">
      <table className="la-table" role="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Source</th>
            <th scope="col" className="col-num">Amount</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {scanning && (
            <tr className="la-scanning-row">
              <td colSpan={6}>
                <div className="la-scanning-indicator">
                  <ArrowPathIcon className="cf-spinning" aria-hidden="true" />
                  <span>Scanning emails for bills{'\u2026'} new items appear as they{'\u2019'}re found</span>
                </div>
              </td>
            </tr>
          )}
          {items.map(item => (
            <TransactionRow key={item.id} item={item} onClick={onRowClick} />
          ))}
        </tbody>
      </table>
      <div className="la-table-footer">
        <span className="la-table-count">
          {items.length === totalCount
            ? `${items.length} items`
            : `${items.length} of ${totalCount} items`}
        </span>
      </div>
    </div>
  )
}
