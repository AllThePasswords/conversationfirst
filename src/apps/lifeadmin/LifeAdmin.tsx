import { useState, useEffect, useCallback, useRef } from 'react'
import {
  BuildingLibraryIcon,
  EnvelopeIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import Fuse from 'fuse.js'
import { supabase } from '../../lib/supabase'
import { fetchConnections } from '../../lib/connections'
import type { Connection } from '../../lib/types'
import { fetchUnifiedLineItems, fetchEntityOptions, fetchBillById, fetchTransactionById } from './lib/queries'
import type { UnifiedLineItem, ListFilters, EntityOption, BillDetailData } from './lib/types'
import { DEFAULT_FILTERS } from './lib/types'
import FilterBar from './components/FilterBar'
import TransactionList from './components/TransactionList'
import BillDetailModal from './components/BillDetailModal'
import SettingsMenu from './components/SettingsMenu'

interface LifeAdminProps {
  householdId: string | null
}

export default function LifeAdmin({ householdId }: LifeAdminProps) {
  const [items, setItems] = useState<UnifiedLineItem[]>([])
  const [filteredItems, setFilteredItems] = useState<UnifiedLineItem[]>([])
  const [filters, setFilters] = useState<ListFilters>(DEFAULT_FILTERS)
  const [entities, setEntities] = useState<EntityOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Connection state
  const [connections, setConnections] = useState<Connection[]>([])
  const hasBankConn = connections.some(c => c.provider_type === 'bank' && c.status === 'active')
  const hasEmailConn = connections.some(c => c.provider_type === 'email' && c.status === 'active')

  // Action states
  const [syncingBank, setSyncingBank] = useState(false)
  const [scanningEmail, setScanningEmail] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [connectingBank, setConnectingBank] = useState(false)
  const [connectingEmail, setConnectingEmail] = useState(false)
  const [actionMsg, setActionMsg] = useState<{ text: string; isError?: boolean } | null>(null)
  const [scanProgress, setScanProgress] = useState<string | null>(null)
  const [detailData, setDetailData] = useState<BillDetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch data when household is resolved
  useEffect(() => {
    if (!householdId) return

    const isInitial = refreshKey === 0
    async function load() {
      if (isInitial) setLoading(true)
      try {
        const [lineItems, entityOpts, conns] = await Promise.all([
          fetchUnifiedLineItems(householdId!),
          fetchEntityOptions(householdId!),
          fetchConnections(householdId!),
        ])

        setItems(lineItems)
        setEntities(entityOpts)
        setConnections(conns)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [householdId, refreshKey])

  // Apply filters (client-side for responsiveness)
  const applyFilters = useCallback(() => {
    let result = [...items]

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime()
      result = result.filter(item => !item.date || new Date(item.date).getTime() >= from)
    }
    if (filters.dateTo) {
      // Use start of next day so the selected date is fully inclusive
      const to = new Date(filters.dateTo).getTime() + 86_400_000
      result = result.filter(item => !item.date || new Date(item.date).getTime() < to)
    }
    if (filters.categories.length > 0) {
      result = result.filter(item =>
        item.category && filters.categories.includes(item.category as ListFilters['categories'][number])
      )
    }
    if (filters.sources.length > 0) {
      result = result.filter(item => filters.sources.includes(item.source))
    }
    if (filters.entityId && filters.entityType) {
      result = result.filter(item => {
        if (!item.entity_label) return false
        const prefix = filters.entityType === 'property' ? 'Property:'
          : filters.entityType === 'vehicle' ? 'Car:'
          : 'Child:'
        return item.entity_label.startsWith(prefix)
      })
    }
    if (filters.search.trim()) {
      const fuse = new Fuse(result, {
        keys: ['description', 'provider', 'category', 'entity_label'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      result = fuse.search(filters.search).map(r => r.item)
    }

    setFilteredItems(result)
  }, [items, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Emit screen context for sidebar chat
  useEffect(() => {
    const overdue = filteredItems.filter(i => i.status === 'overdue')
    const totalDue = filteredItems.reduce((s, i) => s + (i.amount || 0), 0)

    window.__CF_SCREEN_CONTEXT = JSON.stringify({
      view: 'unified-list',
      summary: `${filteredItems.length} items visible. ${overdue.length} overdue. Total: \u20AC${totalDue.toFixed(2)}.`,
      filters: {
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        categories: filters.categories,
        sources: filters.sources,
        search: filters.search,
      },
      itemCount: filteredItems.length,
      totalCount: items.length,
    })

    return () => { window.__CF_SCREEN_CONTEXT = undefined }
  }, [filteredItems, items, filters])

  // Clear action message after 5s
  useEffect(() => {
    if (!actionMsg) return
    const t = setTimeout(() => setActionMsg(null), 5000)
    return () => clearTimeout(t)
  }, [actionMsg])

  // ─── Actions ────────────────────────────────────

  /** Extract the real error message from a Supabase function error */
  async function extractFnError(err: unknown): Promise<string> {
    const msg = (err as { message?: string })?.message ?? 'Unknown error'
    try {
      const ctx = (err as { context?: Response }).context
      if (ctx && typeof ctx.text === 'function') {
        const status = ctx.status
        const text = await ctx.text()
        try {
          const body = JSON.parse(text)
          if (body?.error) return `${body.error} (HTTP ${status})`
        } catch { /* not JSON */ }
        if (text && text.length < 300) return `HTTP ${status}: ${text}`
        return `HTTP ${status}`
      }
    } catch { /* fall through */ }
    return msg
  }

  // Re-check connections when the window regains focus (after OAuth popup)
  useEffect(() => {
    if (!householdId) return

    function handleFocus() {
      fetchConnections(householdId!).then(conns => {
        const hadBank = hasBankConn
        const hadEmail = hasEmailConn
        setConnections(conns)
        const nowHasBank = conns.some(c => c.provider_type === 'bank' && c.status === 'active')
        const nowHasEmail = conns.some(c => c.provider_type === 'email' && c.status === 'active')
        if (!hadBank && nowHasBank) {
          setActionMsg({ text: 'Bank connected \u2014 tap Sync bank to pull transactions' })
          setRefreshKey(k => k + 1)
        }
        if (!hadEmail && nowHasEmail) {
          setActionMsg({ text: 'Email connected \u2014 tap Scan email to find bills' })
          setRefreshKey(k => k + 1)
        }
      }).catch(() => {})
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [householdId, hasBankConn, hasEmailConn])

  async function handleConnectBank() {
    setConnectingBank(true)
    setActionMsg(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setActionMsg({ text: 'Not authenticated', isError: true }); return }

      const response = await supabase.functions.invoke('truelayer-auth', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (response.error) { setActionMsg({ text: response.error.message, isError: true }); return }
      window.open(response.data.auth_url, '_blank', 'noopener')
      setActionMsg({ text: 'Complete bank sign-in in the new tab, then return here' })
    } catch (err) {
      setActionMsg({ text: err instanceof Error ? err.message : 'Connection failed', isError: true })
    } finally {
      setConnectingBank(false)
    }
  }

  async function handleConnectEmail() {
    setConnectingEmail(true)
    setActionMsg(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setActionMsg({ text: 'Not authenticated', isError: true }); return }

      const response = await supabase.functions.invoke('google-auth', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (response.error) { setActionMsg({ text: response.error.message, isError: true }); return }
      window.open(response.data.auth_url, '_blank', 'noopener')
      setActionMsg({ text: 'Complete email sign-in in the new tab, then return here' })
    } catch (err) {
      setActionMsg({ text: err instanceof Error ? err.message : 'Connection failed', isError: true })
    } finally {
      setConnectingEmail(false)
    }
  }

  async function handleSyncBank() {
    if (!householdId || syncingBank) return
    setSyncingBank(true)
    setActionMsg(null)

    // Poll for new results during sync so transactions appear as they're inserted
    const pollInterval = setInterval(() => {
      setRefreshKey(k => k + 1)
    }, 3000)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setActionMsg({ text: 'Not authenticated', isError: true }); return }

      const bankConns = connections.filter(c => c.provider_type === 'bank' && c.status === 'active')
      if (bankConns.length === 0) { setActionMsg({ text: 'No bank connections', isError: true }); return }

      let totalCreated = 0
      let totalFetched = 0
      let timeLimited = false
      const errors: string[] = []
      for (const conn of bankConns) {
        const response = await supabase.functions.invoke('sync-bank', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: { connection_id: conn.id, months_back: 24 },
        })
        if (response.error) {
          errors.push(await extractFnError(response.error))
        } else if (response.data) {
          if (response.data.time_limited) timeLimited = true
          if (response.data.results) {
            for (const r of response.data.results as { created: number; fetched: number; error: string | null }[]) {
              totalCreated += r.created
              totalFetched += r.fetched
              if (r.error) errors.push(r.error)
            }
          }
        }
      }

      const hasTimeLimitMsg = timeLimited || errors.some(e => e.includes('time limit'))
      if (errors.length > 0 && totalFetched === 0 && !hasTimeLimitMsg) {
        setActionMsg({ text: `Bank sync: ${errors[0]}`, isError: true })
      } else if (totalCreated > 0 && hasTimeLimitMsg) {
        setActionMsg({ text: `Synced ${totalCreated} transaction${totalCreated > 1 ? 's' : ''} so far \u2014 sync again to continue` })
      } else if (totalCreated > 0) {
        setActionMsg({ text: `Synced ${totalCreated} new transaction${totalCreated > 1 ? 's' : ''}` })
      } else if (hasTimeLimitMsg) {
        setActionMsg({ text: `Processed some transactions \u2014 sync again to continue` })
      } else if (errors.length > 0) {
        setActionMsg({ text: `Bank sync: ${errors[0]}`, isError: true })
      } else {
        setActionMsg({ text: 'Bank up to date' })
      }
      setRefreshKey(k => k + 1)
    } catch (err) {
      setActionMsg({ text: err instanceof Error ? err.message : 'Sync failed', isError: true })
    } finally {
      clearInterval(pollInterval)
      setSyncingBank(false)
    }
  }

  async function handleScanEmail() {
    if (!householdId || scanningEmail) return
    setScanningEmail(true)
    setActionMsg(null)
    setScanProgress(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setActionMsg({ text: 'Not authenticated', isError: true }); return }

      const emailConns = connections.filter(c => c.provider_type === 'email' && c.status === 'active')
      if (emailConns.length === 0) { setActionMsg({ text: 'No email connections', isError: true }); return }

      setScanProgress('Starting scan\u2026')

      // Single SSE call to the agentic scanner
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/scan-email-agent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connection_id: emailConns[0].id }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ error: 'Scan failed' }))
        setActionMsg({ text: errBody.error || 'Scan failed', isError: true })
        return
      }

      // Read SSE stream for progress events
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let totalBills = 0
      let hasError = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'progress') {
              setScanProgress(event.detail || `Scanning\u2026 ${event.billsFound || 0} bills found`)
              totalBills = event.billsFound ?? totalBills
              if (event.tool === 'save_bill' && event.billsFound > 0) {
                setRefreshKey(k => k + 1)
              }
            } else if (event.type === 'text') {
              const text = (event.text as string) || ''
              if (text.length > 10) setScanProgress(text.slice(0, 120))
            } else if (event.type === 'done') {
              totalBills = event.billsFound ?? totalBills
            } else if (event.type === 'error') {
              hasError = true
              setActionMsg({ text: event.error || 'Scan failed', isError: true })
            }
          } catch { /* skip malformed */ }
        }
      }

      setRefreshKey(k => k + 1)
      if (!hasError) {
        if (totalBills > 0) {
          setActionMsg({ text: `Found ${totalBills} bill${totalBills > 1 ? 's' : ''}` })
        } else {
          setActionMsg({ text: 'No new bills found' })
        }
      }
    } catch (err) {
      setActionMsg({ text: err instanceof Error ? err.message : 'Scan failed', isError: true })
    } finally {
      setScanningEmail(false)
      setScanProgress(null)
    }
  }

  async function handleFileUpload(fileList: FileList) {
    if (!householdId || fileList.length === 0) return
    setUploading(true)
    setActionMsg(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setActionMsg({ text: 'Not authenticated', isError: true }); return }

      let extracted = 0
      for (const file of Array.from(fileList)) {
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const storagePath = `${householdId}/${timestamp}-${safeName}`

        const { error: uploadErr } = await supabase.storage
          .from('bills')
          .upload(storagePath, file, { contentType: file.type, upsert: false })

        if (uploadErr) continue

        const response = await supabase.functions.invoke('extract-bill', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: { storage_path: storagePath, original_filename: file.name },
        })

        if (!response.error && response.data?.is_bill) extracted++
      }

      setActionMsg({ text: extracted > 0
        ? `Extracted ${extracted} bill${extracted > 1 ? 's' : ''}`
        : 'No bills found in uploaded files' })
      setRefreshKey(k => k + 1)
    } catch (err) {
      setActionMsg({ text: err instanceof Error ? err.message : 'Upload failed', isError: true })
    } finally {
      setUploading(false)
    }
  }

  // ─── Detail modal ──────────────────────────────

  async function handleRowClick(item: UnifiedLineItem) {
    setDetailLoading(true)
    setDetailData(null)

    try {
      if (item.bill_id) {
        const [bill, transaction] = await Promise.all([
          fetchBillById(item.bill_id),
          item.transaction_id ? fetchTransactionById(item.transaction_id) : Promise.resolve(null),
        ])
        if (bill) {
          setDetailData({ kind: 'bill', bill, transaction })
        }
      } else if (item.transaction_id) {
        const transaction = await fetchTransactionById(item.transaction_id)
        if (transaction) {
          setDetailData({ kind: 'transaction', transaction })
        }
      }
    } catch {
      setDetailData(null)
    } finally {
      setDetailLoading(false)
    }
  }

  // ─── Render ─────────────────────────────────────

  if (!householdId) {
    return (
      <div className="la-loading">
        <span className="la-loading-cursor" />
        <span className="la-loading-text">Loading household</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="la-error">
        <span className="la-error-text">{error}</span>
      </div>
    )
  }

  const bankBusy = syncingBank || connectingBank
  const emailBusy = scanningEmail || connectingEmail

  return (
    <div className="la-container">
      <div className="la-header">
        <div>
          <span className="cf-section-label">Bills & finances</span>
          <h1 className="cf-section-title">LifeAdmin</h1>
        </div>
        <div className="la-header-actions">
          <button
            className={`la-action-btn ${bankBusy ? 'la-action-busy' : ''}`}
            onClick={hasBankConn ? handleSyncBank : handleConnectBank}
            disabled={bankBusy}
            aria-label={hasBankConn ? 'Sync bank transactions' : 'Connect bank account'}
          >
            {bankBusy
              ? <ArrowPathIcon className="cf-spinning" aria-hidden="true" />
              : <BuildingLibraryIcon aria-hidden="true" />}
            {syncingBank ? 'Syncing\u2026' : connectingBank ? 'Connecting\u2026' : hasBankConn ? 'Sync bank' : 'Connect bank'}
          </button>
          <button
            className={`la-action-btn ${emailBusy ? 'la-action-busy' : ''}`}
            onClick={hasEmailConn ? handleScanEmail : handleConnectEmail}
            disabled={emailBusy}
            aria-label={hasEmailConn ? 'Scan email for bills' : 'Connect email account'}
          >
            {emailBusy
              ? <ArrowPathIcon className="cf-spinning" aria-hidden="true" />
              : <EnvelopeIcon aria-hidden="true" />}
            {scanningEmail ? (scanProgress || 'Scanning\u2026') : connectingEmail ? 'Connecting\u2026' : hasEmailConn ? 'Scan email' : 'Connect email'}
          </button>
          <button
            className={`la-action-btn ${uploading ? 'la-action-busy' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Upload bill document"
          >
            <PlusIcon aria-hidden="true" />
            {uploading ? 'Uploading\u2026' : 'Add document'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
            multiple
            onChange={e => { if (e.target.files) handleFileUpload(e.target.files); e.target.value = '' }}
            className="la-sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <SettingsMenu
            householdId={householdId}
            connections={connections}
            onActionComplete={setActionMsg}
            onDataCleared={() => setRefreshKey(k => k + 1)}
          />
        </div>
      </div>

      {/* Connection status */}
      {!loading && (
        <div className="la-conn-status" role="status">
          <span className={`la-conn-indicator ${hasBankConn ? 'la-conn-active' : ''}`}>
            {hasBankConn ? '\u2713 Bank connected' : 'No bank connected'}
          </span>
          <span className="la-conn-sep">&middot;</span>
          <span className={`la-conn-indicator ${hasEmailConn ? 'la-conn-active' : ''}`}>
            {hasEmailConn ? '\u2713 Email connected' : 'No email connected'}
          </span>
          {filteredItems.length > 0 && (
            <>
              <span className="la-conn-sep">&middot;</span>
              <span className="la-conn-indicator">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      )}

      {actionMsg && (
        <div className={`la-action-msg ${actionMsg.isError ? 'la-action-msg-error' : ''}`} role="status">
          <span>{actionMsg.text}</span>
        </div>
      )}

      <FilterBar
        filters={filters}
        entities={entities}
        onChange={setFilters}
      />

      <TransactionList
        items={filteredItems}
        loading={loading}
        totalCount={items.length}
        scanning={scanningEmail}
        onRowClick={handleRowClick}
      />

      {(detailData || detailLoading) && (
        <BillDetailModal
          data={detailData}
          loading={detailLoading}
          onClose={() => { setDetailData(null); setDetailLoading(false) }}
        />
      )}
    </div>
  )
}
