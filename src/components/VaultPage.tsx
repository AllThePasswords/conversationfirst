import { useState, useEffect, useCallback } from 'react'
import { KeyIcon, ArrowPathIcon, TrashIcon, EnvelopeIcon, BuildingLibraryIcon, PlusIcon, CpuChipIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import {
  fetchConnections,
  fetchConnectionAccounts,
  deleteConnection,
  fetchPlatformServices,
  createApiKeyConnection,
} from '../lib/connections'
import type { Connection, ConnectionAccount } from '../lib/types'
import type { PlatformService } from '../lib/connections'

interface VaultPageProps {
  householdId: string | null
}

const COMMON_PROVIDERS = [
  { name: 'openai', display: 'OpenAI' },
  { name: 'deepgram', display: 'Deepgram' },
  { name: 'stripe', display: 'Stripe' },
  { name: 'resend', display: 'Resend' },
  { name: 'elevenlabs', display: 'ElevenLabs' },
  { name: 'replicate', display: 'Replicate' },
  { name: 'pinecone', display: 'Pinecone' },
  { name: 'vercel', display: 'Vercel' },
  { name: 'godaddy', display: 'GoDaddy' },
]

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

function providerIcon(type: string, category?: string) {
  if (type === 'email') return <EnvelopeIcon className="vault-conn-icon" aria-hidden="true" />
  if (type === 'bank') return <BuildingLibraryIcon className="vault-conn-icon" aria-hidden="true" />
  if (category === 'ai') return <CpuChipIcon className="vault-conn-icon" aria-hidden="true" />
  return <KeyIcon className="vault-conn-icon" aria-hidden="true" />
}

function typeLabel(type: string, category?: string): string {
  if (category) return category.charAt(0).toUpperCase() + category.slice(1)
  switch (type) {
    case 'bank': return 'Banking'
    case 'email': return 'Email'
    case 'api': return 'API'
    default: return type
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Connected'
    case 'pending': return 'Pending'
    case 'expired': return 'Expired'
    case 'revoked': return 'Revoked'
    default: return status
  }
}

export default function VaultPage({ householdId }: VaultPageProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [accounts, setAccounts] = useState<ConnectionAccount[]>([])
  const [platformServices, setPlatformServices] = useState<PlatformService[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormState, setAddFormState] = useState({
    providerName: '',
    apiKey: '',
    apiSecret: '',
    displayName: '',
  })
  const [addFormError, setAddFormError] = useState<string | null>(null)
  const [addFormSubmitting, setAddFormSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    if (!householdId) return
    setLoading(true)
    try {
      const [conns, accts, platform] = await Promise.all([
        fetchConnections(householdId),
        fetchConnectionAccounts(householdId),
        fetchPlatformServices().catch(() => []),
      ])
      setConnections(conns)
      setAccounts(accts)
      setPlatformServices(platform)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections')
    } finally {
      setLoading(false)
    }
  }, [householdId])

  useEffect(() => {
    if (householdId) loadData()
  }, [householdId, loadData])

  async function handleRevoke(e: React.MouseEvent, connectionId: string) {
    e.stopPropagation()
    setRevoking(connectionId)
    try {
      await deleteConnection(connectionId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke connection')
    } finally {
      setRevoking(null)
    }
  }

  async function handleAddApiKey(e: React.FormEvent) {
    e.preventDefault()
    if (!addFormState.providerName.trim() || !addFormState.apiKey.trim()) return

    setAddFormSubmitting(true)
    setAddFormError(null)

    try {
      await createApiKeyConnection({
        providerName: addFormState.providerName.trim().toLowerCase(),
        apiKey: addFormState.apiKey.trim(),
        apiSecret: addFormState.apiSecret.trim() || undefined,
        displayName: addFormState.displayName.trim() || undefined,
      })
      setAddFormState({ providerName: '', apiKey: '', apiSecret: '', displayName: '' })
      setShowAddForm(false)
      await loadData()
    } catch (err) {
      setAddFormError(err instanceof Error ? err.message : 'Failed to add service')
    } finally {
      setAddFormSubmitting(false)
    }
  }

  const activeConnections = connections.filter(c => c.status === 'active')
  const inactiveConnections = connections.filter(c => c.status !== 'active')
  const configuredPlatform = platformServices.filter(s => s.configured)
  const allRows = [
    ...configuredPlatform.map(svc => ({ kind: 'platform' as const, svc })),
    ...activeConnections.map(conn => ({ kind: 'active' as const, conn })),
    ...inactiveConnections.map(conn => ({ kind: 'inactive' as const, conn })),
  ]

  return (
    <div className="vault-page">
      {/* ─── Header ─── */}
      <div className="vault-header">
        <div>
          <span className="vault-kicker">Security</span>
          <h1 className="vault-title">Vault</h1>
          <p className="vault-desc">
            All connections across your apps, secured in{'\u00A0'}one{'\u00A0'}place.
          </p>
        </div>
        <button
          className="vault-btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon aria-hidden="true" />
          Add service
        </button>
      </div>

      {error && (
        <div className="vault-error">
          <ExclamationTriangleIcon className="vault-error-icon" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Add form (inline, below header) ─── */}
      {showAddForm && (
        <div className="vault-add-form-wrapper">
          <form className="vault-add-form" onSubmit={handleAddApiKey}>
            <div className="vault-add-form-header">
              <span className="vault-add-form-title">Add API service</span>
              <button
                type="button"
                className="vault-add-form-close"
                onClick={() => { setShowAddForm(false); setAddFormError(null) }}
                aria-label="Cancel"
              >
                <XMarkIcon aria-hidden="true" />
              </button>
            </div>

            <div className="vault-add-form-body">
              <div className="vault-add-form-field">
                <label className="vault-add-form-label" htmlFor="vault-provider">
                  Service name
                </label>
                <input
                  id="vault-provider"
                  type="text"
                  className="vault-add-form-input"
                  placeholder="e.g. openai, stripe"
                  list="vault-provider-suggestions"
                  value={addFormState.providerName}
                  onChange={e => setAddFormState(s => ({ ...s, providerName: e.target.value }))}
                  required
                  autoFocus
                />
                <datalist id="vault-provider-suggestions">
                  {COMMON_PROVIDERS.map(p => (
                    <option key={p.name} value={p.name}>{p.display}</option>
                  ))}
                </datalist>
              </div>

              <div className="vault-add-form-field">
                <label className="vault-add-form-label" htmlFor="vault-api-key">
                  API key
                </label>
                <input
                  id="vault-api-key"
                  type="password"
                  className="vault-add-form-input"
                  placeholder="sk-..."
                  value={addFormState.apiKey}
                  onChange={e => setAddFormState(s => ({ ...s, apiKey: e.target.value }))}
                  required
                />
              </div>

              {addFormState.providerName.toLowerCase() === 'godaddy' && (
                <div className="vault-add-form-field">
                  <label className="vault-add-form-label" htmlFor="vault-api-secret">
                    API secret
                  </label>
                  <input
                    id="vault-api-secret"
                    type="password"
                    className="vault-add-form-input"
                    placeholder="GoDaddy API secret"
                    value={addFormState.apiSecret}
                    onChange={e => setAddFormState(s => ({ ...s, apiSecret: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="vault-add-form-field">
                <label className="vault-add-form-label" htmlFor="vault-display-name">
                  Display name <span className="vault-add-form-optional">optional</span>
                </label>
                <input
                  id="vault-display-name"
                  type="text"
                  className="vault-add-form-input"
                  placeholder="My OpenAI key"
                  value={addFormState.displayName}
                  onChange={e => setAddFormState(s => ({ ...s, displayName: e.target.value }))}
                />
              </div>
            </div>

            {addFormError && (
              <div className="vault-add-form-error" role="alert">
                <ExclamationTriangleIcon className="vault-error-icon" aria-hidden="true" />
                <span>{addFormError}</span>
              </div>
            )}

            <div className="vault-add-form-footer">
              <button
                type="submit"
                className="vault-add-form-submit"
                disabled={addFormSubmitting || !addFormState.providerName.trim() || !addFormState.apiKey.trim()}
              >
                {addFormSubmitting ? 'Adding\u2026' : 'Add to vault'}
              </button>
              <span className="vault-add-form-security">
                <KeyIcon className="vault-add-form-security-icon" aria-hidden="true" />
                Encrypted at rest
              </span>
            </div>
          </form>
        </div>
      )}

      {/* ─── Connections table ─── */}
      <div className="vault-table-wrapper">
        {loading && allRows.length === 0 ? (
          <div className="vault-loading">
            <span className="cf-loading-cursor" />
            <span className="cf-loading-text">Loading connections</span>
          </div>
        ) : allRows.length === 0 ? (
          <div className="vault-empty">
            <KeyIcon className="vault-empty-icon" aria-hidden="true" />
            <p className="vault-empty-title">No connections yet</p>
            <p className="vault-empty-desc">
              Add API keys here or connect accounts through your apps.
            </p>
          </div>
        ) : (
          <table className="vault-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Type</th>
                <th>Status</th>
                <th>Connected</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {configuredPlatform.map(svc => (
                <tr key={`platform-${svc.provider_name}`}>
                  <td>
                    <div className="vault-cell-service">
                      {providerIcon('api', svc.category)}
                      <div>
                        <span className="vault-cell-name">{svc.display_name}</span>
                        <span className="vault-cell-provider">{svc.provider_name}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="vault-cell-type">{typeLabel('api', svc.category)}</span></td>
                  <td>
                    <span className="vault-status-badge vault-status-active">
                      <span className="status-dot" />
                      Connected
                    </span>
                  </td>
                  <td><span className="vault-cell-mono">Built in</span></td>
                  <td />
                </tr>
              ))}

              {activeConnections.map(conn => {
                const connAccounts = accounts.filter(a => a.connection_id === conn.id)
                const isRevoking = revoking === conn.id
                return (
                  <tr key={conn.id}>
                    <td>
                      <div className="vault-cell-service">
                        {providerIcon(conn.provider_type)}
                        <div>
                          <span className="vault-cell-name">
                            {conn.display_name || conn.provider_name}
                          </span>
                          {connAccounts.length > 0 && (
                            <span className="vault-cell-provider">
                              {connAccounts.map(a => a.display_name || a.external_id).join(', ')}
                            </span>
                          )}
                          {connAccounts.length === 0 && (
                            <span className="vault-cell-provider">{conn.provider_name}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td><span className="vault-cell-type">{typeLabel(conn.provider_type)}</span></td>
                    <td>
                      <span className="vault-status-badge vault-status-active">
                        <span className="status-dot" />
                        Connected
                      </span>
                    </td>
                    <td>
                      <span className="vault-cell-mono">
                        {formatRelative(conn.created_at)}
                        {conn.created_by_app && (
                          <> via {conn.created_by_app}</>
                        )}
                      </span>
                    </td>
                    <td>
                      <button
                        className="vault-btn-icon vault-delete-btn"
                        onClick={(e) => handleRevoke(e, conn.id)}
                        disabled={isRevoking}
                        aria-label={`Revoke ${conn.display_name || conn.provider_name}`}
                      >
                        {isRevoking ? (
                          <ArrowPathIcon className="cf-spinning" aria-hidden="true" />
                        ) : (
                          <TrashIcon aria-hidden="true" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}

              {inactiveConnections.map(conn => (
                <tr key={conn.id} className="vault-row-inactive">
                  <td>
                    <div className="vault-cell-service">
                      {providerIcon(conn.provider_type)}
                      <div>
                        <span className="vault-cell-name">
                          {conn.display_name || conn.provider_name}
                        </span>
                        <span className="vault-cell-provider">{conn.provider_name}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="vault-cell-type">{typeLabel(conn.provider_type)}</span></td>
                  <td>
                    <span className="vault-status-badge vault-status-inactive">
                      {statusLabel(conn.status)}
                    </span>
                  </td>
                  <td><span className="vault-cell-mono">{formatRelative(conn.created_at)}</span></td>
                  <td>
                    <button
                      className="vault-btn-icon vault-delete-btn"
                      onClick={(e) => handleRevoke(e, conn.id)}
                      disabled={revoking === conn.id}
                      aria-label={`Remove ${conn.display_name || conn.provider_name}`}
                    >
                      <TrashIcon aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
