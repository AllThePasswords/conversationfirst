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

function categoryLabel(type: string, category?: string): string {
  if (category) return category.toUpperCase()
  switch (type) {
    case 'bank': return 'BANKING'
    case 'email': return 'EMAIL'
    case 'api': return 'API'
    default: return type.toUpperCase()
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

  async function handleRevoke(connectionId: string) {
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
  const totalActive = activeConnections.length + configuredPlatform.length

  return (
    <div className="vault-page">
      <div className="vault-page-header">
        <KeyIcon className="vault-page-header-icon" aria-hidden="true" />
        <div>
          <span className="cf-section-label">Security</span>
          <h1 className="cf-section-title">Vault</h1>
        </div>
        {totalActive > 0 && (
          <span className="vault-page-count">{totalActive}</span>
        )}
      </div>
      <p className="vault-page-desc">
        All connections across your apps, secured in{'\u00A0'}one{'\u00A0'}place.
      </p>

      {error && (
        <div className="vault-page-error">
          <ExclamationTriangleIcon className="vault-page-error-icon" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="vault-page-body">
        {loading && connections.length === 0 ? (
          <div className="vault-page-loading">
            <span className="cf-loading-cursor" />
            <span className="cf-loading-text">Loading connections</span>
          </div>
        ) : totalActive === 0 && inactiveConnections.length === 0 ? (
          <div className="vault-page-empty">
            <KeyIcon className="vault-page-empty-icon" aria-hidden="true" />
            <p className="vault-page-empty-text">
              No connections yet. Connect accounts through your apps and they will appear{'\u00A0'}here.
            </p>
          </div>
        ) : (
          <>
            {totalActive > 0 && (
              <div className="vault-page-section">
                <span className="vault-page-section-label">Active</span>
                <div className="vault-page-list">
                  {configuredPlatform.map(svc => (
                    <div key={`platform-${svc.provider_name}`} className="vault-conn">
                      <div className="vault-conn-top">
                        {providerIcon('api', svc.category)}
                        <div className="vault-conn-info">
                          <span className="vault-conn-name">{svc.display_name}</span>
                          <div className="vault-conn-meta-row">
                            <span className="vault-conn-category">
                              {categoryLabel('api', svc.category)}
                            </span>
                            <span className="vault-conn-provider">
                              {svc.provider_name}
                            </span>
                          </div>
                        </div>
                        <div className="vault-conn-status">
                          <div className="status-dot" aria-label="Connected" />
                        </div>
                      </div>
                      <div className="vault-conn-bottom">
                        <span className="vault-conn-meta">
                          Built in
                        </span>
                      </div>
                    </div>
                  ))}

                  {activeConnections.map(conn => {
                    const connAccounts = accounts.filter(a => a.connection_id === conn.id)
                    const isRevoking = revoking === conn.id
                    return (
                      <div key={conn.id} className="vault-conn">
                        <div className="vault-conn-top">
                          {providerIcon(conn.provider_type)}
                          <div className="vault-conn-info">
                            <span className="vault-conn-name">
                              {conn.display_name || conn.provider_name}
                            </span>
                            <div className="vault-conn-meta-row">
                              <span className="vault-conn-category">
                                {categoryLabel(conn.provider_type)}
                              </span>
                              <span className="vault-conn-provider">
                                {conn.provider_name}
                              </span>
                            </div>
                          </div>
                          <div className="vault-conn-status">
                            <div className="status-dot" aria-label={statusLabel(conn.status)} />
                          </div>
                        </div>

                        {connAccounts.length > 0 && (
                          <div className="vault-conn-accounts">
                            {connAccounts.map(acct => (
                              <div key={acct.id} className="vault-conn-account">
                                <span className="vault-conn-account-name">
                                  {acct.display_name || acct.external_id}
                                </span>
                                <span className="vault-conn-account-type">
                                  {acct.account_type || 'account'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="vault-conn-bottom">
                          <span className="vault-conn-meta">
                            Connected {formatRelative(conn.created_at)}
                            {conn.created_by_app && (
                              <> via <span className="vault-conn-app">{conn.created_by_app}</span></>
                            )}
                          </span>
                          <button
                            className="vault-conn-revoke-btn"
                            onClick={() => handleRevoke(conn.id)}
                            disabled={isRevoking}
                            aria-label={`Revoke ${conn.display_name || conn.provider_name}`}
                          >
                            {isRevoking ? (
                              <ArrowPathIcon className="vault-conn-revoke-icon cf-spinning" aria-hidden="true" />
                            ) : (
                              <TrashIcon className="vault-conn-revoke-icon" aria-hidden="true" />
                            )}
                            <span>{isRevoking ? 'Revoking' : 'Revoke'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {inactiveConnections.length > 0 && (
              <div className="vault-page-section">
                <span className="vault-page-section-label">Inactive</span>
                <div className="vault-page-list">
                  {inactiveConnections.map(conn => (
                    <div key={conn.id} className="vault-conn vault-conn--inactive">
                      <div className="vault-conn-top">
                        {providerIcon(conn.provider_type)}
                        <div className="vault-conn-info">
                          <span className="vault-conn-name">
                            {conn.display_name || conn.provider_name}
                          </span>
                          <span className="vault-conn-status-text">
                            {statusLabel(conn.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="vault-page-add-section">
          {!showAddForm ? (
            <button
              className="vault-page-add-btn"
              onClick={() => setShowAddForm(true)}
              aria-label="Add API service"
            >
              <PlusIcon className="vault-page-add-btn-icon" aria-hidden="true" />
              <span>Add service</span>
            </button>
          ) : (
            <form className="vault-page-add-form" onSubmit={handleAddApiKey}>
              <div className="vault-page-add-form-header">
                <span className="vault-page-add-form-title">Add API service</span>
                <button
                  type="button"
                  className="vault-page-add-form-close"
                  onClick={() => { setShowAddForm(false); setAddFormError(null) }}
                  aria-label="Cancel"
                >
                  <XMarkIcon aria-hidden="true" />
                </button>
              </div>

              <div className="vault-page-add-form-body">
                <div className="vault-page-add-form-field">
                  <label className="vault-page-add-form-label" htmlFor="vault-provider">
                    Service name
                  </label>
                  <input
                    id="vault-provider"
                    type="text"
                    className="vault-page-add-form-input"
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

                <div className="vault-page-add-form-field">
                  <label className="vault-page-add-form-label" htmlFor="vault-api-key">
                    API key
                  </label>
                  <input
                    id="vault-api-key"
                    type="password"
                    className="vault-page-add-form-input"
                    placeholder="sk-..."
                    value={addFormState.apiKey}
                    onChange={e => setAddFormState(s => ({ ...s, apiKey: e.target.value }))}
                    required
                  />
                </div>

                {addFormState.providerName.toLowerCase() === 'godaddy' && (
                  <div className="vault-page-add-form-field">
                    <label className="vault-page-add-form-label" htmlFor="vault-api-secret">
                      API secret
                    </label>
                    <input
                      id="vault-api-secret"
                      type="password"
                      className="vault-page-add-form-input"
                      placeholder="GoDaddy API secret"
                      value={addFormState.apiSecret}
                      onChange={e => setAddFormState(s => ({ ...s, apiSecret: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="vault-page-add-form-field">
                  <label className="vault-page-add-form-label" htmlFor="vault-display-name">
                    Display name <span className="vault-page-add-form-optional">optional</span>
                  </label>
                  <input
                    id="vault-display-name"
                    type="text"
                    className="vault-page-add-form-input"
                    placeholder="My OpenAI key"
                    value={addFormState.displayName}
                    onChange={e => setAddFormState(s => ({ ...s, displayName: e.target.value }))}
                  />
                </div>
              </div>

              {addFormError && (
                <div className="vault-page-add-form-error" role="alert">
                  <ExclamationTriangleIcon className="vault-page-error-icon" aria-hidden="true" />
                  <span>{addFormError}</span>
                </div>
              )}

              <div className="vault-page-add-form-footer">
                <button
                  type="submit"
                  className="vault-page-add-form-submit"
                  disabled={addFormSubmitting || !addFormState.providerName.trim() || !addFormState.apiKey.trim()}
                >
                  {addFormSubmitting ? 'Adding\u2026' : 'Add to vault'}
                </button>
                <span className="vault-page-add-form-security">
                  <KeyIcon className="vault-page-add-form-security-icon" aria-hidden="true" />
                  Encrypted at rest
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
