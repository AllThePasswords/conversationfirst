import { useState, useEffect } from 'react'
import { KeyIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../../lib/supabase'
import { fetchBankConnections, fetchBankAccounts } from '../lib/queries'
import type { BankConnection, BankAccount } from '../lib/types'

interface BankConnectProps {
  householdId: string
  onSyncComplete?: () => void
}

export default function BankConnect({ householdId, onSyncComplete }: BankConnectProps) {
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBankData()
  }, [householdId])

  // Check URL for callback results
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const bankConnected = params.get('bank_connected')
    const bankError = params.get('bank_error')

    if (bankConnected) {
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
      loadBankData()
    }
    if (bankError) {
      window.history.replaceState({}, '', window.location.pathname)
      setError(`Bank connection failed: ${bankError}`)
    }
  }, [])

  async function loadBankData() {
    try {
      const [conns, accts] = await Promise.all([
        fetchBankConnections(householdId),
        fetchBankAccounts(householdId),
      ])
      setConnections(conns)
      setAccounts(accts)
    } catch (err) {
      console.error('Failed to load bank data:', err)
    }
  }

  async function handleConnect() {
    setConnecting(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        return
      }

      const response = await supabase.functions.invoke('truelayer-auth', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.error) {
        setError(response.error.message)
        return
      }

      const { auth_url } = response.data
      // Open TrueLayer auth in a new window/tab
      window.open(auth_url, '_blank', 'noopener')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setConnecting(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        return
      }

      const response = await supabase.functions.invoke('sync-bank', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { months_back: 3 },
      })

      if (response.error) {
        setError(response.error.message)
        return
      }

      await loadBankData()
      onSyncComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const activeConnections = connections.filter(c => c.status === 'active')
  const hasConnections = activeConnections.length > 0

  return (
    <div className="la-bank-section">
      <div className="la-bank-header">
        <div className="la-bank-header-left">
          <KeyIcon className="la-bank-icon" aria-hidden="true" />
          <span className="la-bank-title">Bank accounts</span>
          {hasConnections && (
            <span className="la-bank-count">{accounts.length}</span>
          )}
        </div>
        <div className="la-bank-actions">
          {hasConnections && (
            <button
              className="la-bank-sync-btn"
              onClick={handleSync}
              disabled={syncing}
              aria-label="Sync transactions"
            >
              <ArrowPathIcon
                className={`la-bank-sync-icon ${syncing ? 'cf-spinning' : ''}`}
                aria-hidden="true"
              />
              <span>{syncing ? 'Syncing' : 'Sync'}</span>
            </button>
          )}
          <button
            className="la-bank-connect-btn"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect bank'}
          </button>
        </div>
      </div>

      {error && (
        <div className="la-bank-error">
          <ExclamationTriangleIcon className="la-bank-error-icon" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="la-bank-accounts">
          {accounts.map(acct => (
            <div key={acct.id} className="la-bank-account">
              <div className="la-bank-account-info">
                <span className="la-bank-account-name">
                  {acct.display_name || 'Account'}
                </span>
                <span className="la-bank-account-meta">
                  {acct.currency}{acct.iban ? ` \u00b7 ${acct.iban.slice(-4)}` : ''}
                </span>
              </div>
              <div className="la-bank-account-status">
                {acct.sync_error ? (
                  <ExclamationTriangleIcon className="la-bank-status-warn" aria-hidden="true" />
                ) : (
                  <CheckCircleIcon className="la-bank-status-ok" aria-hidden="true" />
                )}
                <span className="la-bank-account-sync">
                  {acct.last_synced_at
                    ? `Synced ${formatRelative(acct.last_synced_at)}`
                    : 'Not synced'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
