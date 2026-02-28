import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../../lib/supabase'
import { deleteConnection } from '../../../lib/connections'
import type { Connection } from '../../../lib/types'

interface SettingsMenuProps {
  householdId: string
  connections: Connection[]
  onActionComplete: (msg: { text: string; isError?: boolean }) => void
  onDataCleared: () => void
}

type ConfirmAction = 'clear-bank' | 'clear-email' | 'disconnect-bank' | 'disconnect-email' | null

export default function SettingsMenu({
  householdId,
  connections,
  onActionComplete,
  onDataCleared,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [busy, setBusy] = useState(false)
  const [bankLastSync, setBankLastSync] = useState<string | null>(null)
  const [emailLastScan, setEmailLastScan] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const bankConns = connections.filter(c => c.provider_type === 'bank' && c.status === 'active')
  const emailConns = connections.filter(c => c.provider_type === 'email' && c.status === 'active')
  const hasBankConn = bankConns.length > 0
  const hasEmailConn = emailConns.length > 0

  // Fetch timestamps
  useEffect(() => {
    if (!householdId) return

    async function loadTimestamps() {
      if (bankConns.length > 0) {
        const { data } = await supabase
          .from('connection_accounts')
          .select('last_synced_at')
          .in('connection_id', bankConns.map(c => c.id))
          .not('last_synced_at', 'is', null)
          .order('last_synced_at', { ascending: false })
          .limit(1)
        setBankLastSync(data?.[0]?.last_synced_at ?? null)
      } else {
        setBankLastSync(null)
      }

      if (emailConns.length > 0) {
        const { data } = await supabase
          .from('email_scan_state')
          .select('last_scan_at')
          .in('connection_id', emailConns.map(c => c.id))
          .not('last_scan_at', 'is', null)
          .order('last_scan_at', { ascending: false })
          .limit(1)
        setEmailLastScan(data?.[0]?.last_scan_at ?? null)
      } else {
        setEmailLastScan(null)
      }
    }

    loadTimestamps()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdId, connections])

  // Position dropdown
  const updatePos = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 260
    setPos({
      top: rect.bottom + 4,
      left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
    })
  }, [])

  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  function close() {
    setOpen(false)
    setConfirmAction(null)
  }

  function toggle() {
    if (open) close()
    else setOpen(true)
  }

  // ─── Actions ────────────────────────────────────

  async function handleClearBank() {
    setBusy(true)
    try {
      // Count before deleting so we can report the result
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('household_id', householdId)

      const { error: txErr } = await supabase
        .from('transactions')
        .delete()
        .eq('household_id', householdId)
      if (txErr) throw txErr

      if (bankConns.length > 0) {
        await supabase
          .from('connection_accounts')
          .update({ last_synced_at: null, sync_error: null })
          .in('connection_id', bankConns.map(c => c.id))
      }

      onActionComplete({ text: `Bank data cleared (${count ?? 0} transactions removed)` })
      onDataCleared()
      close()
    } catch (err) {
      onActionComplete({ text: err instanceof Error ? err.message : 'Failed to clear bank data', isError: true })
    } finally {
      setBusy(false)
    }
  }

  async function handleClearEmail() {
    setBusy(true)
    try {
      const emailConnIds = emailConns.map(c => c.id)
      let deleted = 0

      // Collect all email-sourced bill IDs using multiple strategies
      const billIds = new Set<string>()

      if (emailConnIds.length > 0) {
        // Strategy 1: bills linked via pending_extractions (has connection_id + bill_id)
        const { data: linkedBills } = await supabase
          .from('pending_extractions')
          .select('bill_id')
          .in('connection_id', emailConnIds)
          .not('bill_id', 'is', null)
        for (const pe of linkedBills || []) if (pe.bill_id) billIds.add(pe.bill_id)

        // Strategy 2: bills directly tagged with email connection_id (new bills)
        const { data: connBills } = await supabase
          .from('bills')
          .select('id')
          .in('connection_id', emailConnIds)
        for (const b of connBills || []) billIds.add(b.id)
      }

      // Strategy 3: bills with /email/ in storage_path (email PDF extractions)
      const { data: pathBills } = await supabase
        .from('bills')
        .select('id')
        .eq('household_id', householdId)
        .like('storage_path', '%/email/%')
      for (const b of pathBills || []) billIds.add(b.id)

      // Strategy 4: body-extracted bills (null storage_path, null original_filename)
      const { data: bodyBills } = await supabase
        .from('bills')
        .select('id')
        .eq('household_id', householdId)
        .is('storage_path', null)
        .is('original_filename', null)
      for (const b of bodyBills || []) billIds.add(b.id)

      // Delete all identified email bills
      if (billIds.size > 0) {
        const ids = Array.from(billIds)
        const { error: billErr } = await supabase
          .from('bills')
          .delete()
          .in('id', ids)
        if (billErr) throw billErr
        deleted = ids.length
      }

      // Clean up pending_extractions and reset scan state
      if (emailConnIds.length > 0) {
        const { error: peErr } = await supabase
          .from('pending_extractions')
          .delete()
          .in('connection_id', emailConnIds)
        if (peErr) throw peErr

        const { error: essErr } = await supabase
          .from('email_scan_state')
          .update({ cursor_value: null, last_scan_at: null, messages_scanned: 0, bills_found: 0 })
          .in('connection_id', emailConnIds)
        if (essErr) throw essErr
      }

      onActionComplete({ text: `Email data cleared (${deleted} bills removed)` })
      onDataCleared()
      close()
    } catch (err) {
      onActionComplete({ text: err instanceof Error ? err.message : 'Failed to clear email data', isError: true })
    } finally {
      setBusy(false)
    }
  }

  async function handleDisconnectBank() {
    setBusy(true)
    try {
      for (const conn of bankConns) {
        await deleteConnection(conn.id)
      }
      onActionComplete({ text: 'Bank disconnected' })
      onDataCleared()
      close()
    } catch (err) {
      onActionComplete({ text: err instanceof Error ? err.message : 'Failed to disconnect bank', isError: true })
    } finally {
      setBusy(false)
    }
  }

  async function handleDisconnectEmail() {
    setBusy(true)
    try {
      for (const conn of emailConns) {
        await deleteConnection(conn.id)
      }
      onActionComplete({ text: 'Email disconnected' })
      onDataCleared()
      close()
    } catch (err) {
      onActionComplete({ text: err instanceof Error ? err.message : 'Failed to disconnect email', isError: true })
    } finally {
      setBusy(false)
    }
  }

  // ─── Render ─────────────────────────────────────

  function formatRelative(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  function renderConfirm(label: string, onConfirm: () => void, destructive = false) {
    return (
      <div className="la-settings-confirm" aria-live="assertive">
        <span className="la-settings-confirm-text">{label}</span>
        <button
          className={`la-settings-confirm-yes${destructive ? ' la-settings-confirm-yes--destructive' : ''}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Working\u2026' : 'Confirm'}
        </button>
        <button
          className="la-settings-confirm-no"
          onClick={() => setConfirmAction(null)}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="la-action-btn"
        onClick={toggle}
        aria-label="Settings"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Cog6ToothIcon aria-hidden="true" />
      </button>

      {open && pos && createPortal(
        <div
          ref={dropdownRef}
          className="la-settings-dropdown"
          role="menu"
          aria-label="LifeAdmin settings"
          style={{ top: pos.top, left: pos.left }}
        >
          {/* Bank section */}
          <div className="la-settings-section">
            <div className="la-settings-section-label">Bank</div>
            {bankLastSync && (
              <div className="la-settings-meta">Last synced {formatRelative(bankLastSync)}</div>
            )}
            {!hasBankConn && (
              <div className="la-settings-meta">No bank connected</div>
            )}
            {hasBankConn && confirmAction !== 'clear-bank' && (
              <button
                className="la-settings-item"
                role="menuitem"
                onClick={() => setConfirmAction('clear-bank')}
              >
                Clear bank data
              </button>
            )}
            {confirmAction === 'clear-bank' && renderConfirm('Delete all transactions?', handleClearBank)}
            {hasBankConn && confirmAction !== 'disconnect-bank' && (
              <button
                className="la-settings-item la-settings-item--destructive"
                role="menuitem"
                onClick={() => setConfirmAction('disconnect-bank')}
              >
                Disconnect bank
              </button>
            )}
            {confirmAction === 'disconnect-bank' && renderConfirm('Revoke bank connection?', handleDisconnectBank, true)}
          </div>

          <div className="la-settings-divider" />

          {/* Email section */}
          <div className="la-settings-section">
            <div className="la-settings-section-label">Email</div>
            {emailLastScan && (
              <div className="la-settings-meta">Last scanned {formatRelative(emailLastScan)}</div>
            )}
            {!hasEmailConn && (
              <div className="la-settings-meta">No email connected</div>
            )}
            {hasEmailConn && confirmAction !== 'clear-email' && (
              <button
                className="la-settings-item"
                role="menuitem"
                onClick={() => setConfirmAction('clear-email')}
              >
                Clear email data
              </button>
            )}
            {confirmAction === 'clear-email' && renderConfirm('Delete all bills and re-scan?', handleClearEmail)}
            {hasEmailConn && confirmAction !== 'disconnect-email' && (
              <button
                className="la-settings-item la-settings-item--destructive"
                role="menuitem"
                onClick={() => setConfirmAction('disconnect-email')}
              >
                Disconnect email
              </button>
            )}
            {confirmAction === 'disconnect-email' && renderConfirm('Revoke email connection?', handleDisconnectEmail, true)}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
