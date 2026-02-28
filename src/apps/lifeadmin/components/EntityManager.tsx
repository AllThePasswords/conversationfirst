import { useState, useEffect } from 'react'
import {
  HomeIcon,
  TruckIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import {
  fetchProperties,
  fetchVehicles,
  fetchChildren,
  createProperty,
  deleteProperty,
  createVehicle,
  deleteVehicle,
  createChild,
  deleteChild,
} from '../lib/queries'
import type { Property, Vehicle, Child } from '../lib/types'

interface EntityManagerProps {
  householdId: string
  onChanged?: () => void
}

export default function EntityManager({ householdId, onChanged }: EntityManagerProps) {
  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(false)

  async function loadAll() {
    setLoading(true)
    try {
      const [p, v, c] = await Promise.all([
        fetchProperties(householdId),
        fetchVehicles(householdId),
        fetchChildren(householdId),
      ])
      setProperties(p)
      setVehicles(v)
      setChildren(c)
    } catch (err) {
      console.error('Failed to load entities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadAll()
  }, [open, householdId])

  const totalCount = properties.length + vehicles.length + children.length

  return (
    <div className="la-entity-section">
      <button
        className="la-entity-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="la-entity-toggle-label">
          Manage entities
          {totalCount > 0 && (
            <span className="la-entity-count">{totalCount}</span>
          )}
        </span>
        {open
          ? <ChevronUpIcon className="la-entity-toggle-icon" aria-hidden="true" />
          : <ChevronDownIcon className="la-entity-toggle-icon" aria-hidden="true" />
        }
      </button>

      {open && (
        <div className="la-entity-panels">
          <PropertyPanel
            householdId={householdId}
            items={properties}
            loading={loading}
            onRefresh={() => { loadAll(); onChanged?.() }}
          />
          <VehiclePanel
            householdId={householdId}
            items={vehicles}
            loading={loading}
            onRefresh={() => { loadAll(); onChanged?.() }}
          />
          <ChildPanel
            householdId={householdId}
            items={children}
            loading={loading}
            onRefresh={() => { loadAll(); onChanged?.() }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Property panel ─────────────────────────────

function PropertyPanel({
  householdId,
  items,
  loading,
  onRefresh,
}: {
  householdId: string
  items: Property[]
  loading: boolean
  onRefresh: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!address.trim()) return
    setSaving(true)
    try {
      await createProperty(householdId, {
        address_line1: address.trim(),
        city: city.trim() || undefined,
        postcode: postcode.trim() || undefined,
      })
      setAddress('')
      setCity('')
      setPostcode('')
      setAdding(false)
      onRefresh()
    } catch (err) {
      console.error('Failed to add property:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProperty(id)
      onRefresh()
    } catch (err) {
      console.error('Failed to delete property:', err)
    }
  }

  return (
    <div className="la-entity-panel">
      <div className="la-entity-panel-header">
        <HomeIcon className="la-entity-panel-icon" aria-hidden="true" />
        <span className="la-entity-panel-title">Properties</span>
        <button
          className="la-entity-add-btn"
          onClick={() => setAdding(!adding)}
          aria-label="Add property"
        >
          <PlusIcon aria-hidden="true" />
        </button>
      </div>

      {adding && (
        <div className="la-entity-form">
          <input
            className="la-entity-input"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            autoFocus
          />
          <div className="la-entity-form-row">
            <input
              className="la-entity-input"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              className="la-entity-input"
              placeholder="Postcode"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
            />
          </div>
          <div className="la-entity-form-actions">
            <button
              className="la-entity-save-btn"
              onClick={handleAdd}
              disabled={saving || !address.trim()}
            >
              {saving ? 'Saving\u2026' : 'Add property'}
            </button>
            <button
              className="la-entity-cancel-btn"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <p className="la-entity-empty">Loading\u2026</p>
      )}

      {!loading && items.length === 0 && !adding && (
        <p className="la-entity-empty">No properties added</p>
      )}

      {items.map(p => (
        <div key={p.id} className="la-entity-item">
          <div className="la-entity-item-info">
            <span className="la-entity-item-name">{p.address_line1}</span>
            <span className="la-entity-item-meta">
              {[p.city, p.postcode].filter(Boolean).join(', ')}
            </span>
          </div>
          <button
            className="la-entity-delete-btn"
            onClick={() => handleDelete(p.id)}
            aria-label={`Remove ${p.address_line1}`}
          >
            <TrashIcon aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Vehicle panel ──────────────────────────────

function VehiclePanel({
  householdId,
  items,
  loading,
  onRefresh,
}: {
  householdId: string
  items: Vehicle[]
  loading: boolean
  onRefresh: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [registration, setRegistration] = useState('')
  const [insuranceDue, setInsuranceDue] = useState('')
  const [taxDue, setTaxDue] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!make.trim() || !model.trim()) return
    setSaving(true)
    try {
      await createVehicle(householdId, {
        make: make.trim(),
        model: model.trim(),
        registration: registration.trim() || undefined,
        insurance_due_date: insuranceDue || undefined,
        tax_due_date: taxDue || undefined,
      })
      setMake('')
      setModel('')
      setRegistration('')
      setInsuranceDue('')
      setTaxDue('')
      setAdding(false)
      onRefresh()
    } catch (err) {
      console.error('Failed to add vehicle:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteVehicle(id)
      onRefresh()
    } catch (err) {
      console.error('Failed to delete vehicle:', err)
    }
  }

  function formatDate(d: string | null): string {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="la-entity-panel">
      <div className="la-entity-panel-header">
        <TruckIcon className="la-entity-panel-icon" aria-hidden="true" />
        <span className="la-entity-panel-title">Vehicles</span>
        <button
          className="la-entity-add-btn"
          onClick={() => setAdding(!adding)}
          aria-label="Add vehicle"
        >
          <PlusIcon aria-hidden="true" />
        </button>
      </div>

      {adding && (
        <div className="la-entity-form">
          <div className="la-entity-form-row">
            <input
              className="la-entity-input"
              placeholder="Make"
              value={make}
              onChange={e => setMake(e.target.value)}
              autoFocus
            />
            <input
              className="la-entity-input"
              placeholder="Model"
              value={model}
              onChange={e => setModel(e.target.value)}
            />
          </div>
          <input
            className="la-entity-input"
            placeholder="Registration"
            value={registration}
            onChange={e => setRegistration(e.target.value)}
          />
          <div className="la-entity-form-row">
            <label className="la-entity-date-label">
              <span>Insurance due</span>
              <input
                className="la-entity-input"
                type="date"
                value={insuranceDue}
                onChange={e => setInsuranceDue(e.target.value)}
              />
            </label>
            <label className="la-entity-date-label">
              <span>Tax due</span>
              <input
                className="la-entity-input"
                type="date"
                value={taxDue}
                onChange={e => setTaxDue(e.target.value)}
              />
            </label>
          </div>
          <div className="la-entity-form-actions">
            <button
              className="la-entity-save-btn"
              onClick={handleAdd}
              disabled={saving || !make.trim() || !model.trim()}
            >
              {saving ? 'Saving\u2026' : 'Add vehicle'}
            </button>
            <button
              className="la-entity-cancel-btn"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <p className="la-entity-empty">Loading\u2026</p>
      )}

      {!loading && items.length === 0 && !adding && (
        <p className="la-entity-empty">No vehicles added</p>
      )}

      {items.map(v => (
        <div key={v.id} className="la-entity-item">
          <div className="la-entity-item-info">
            <span className="la-entity-item-name">{v.make} {v.model}</span>
            <span className="la-entity-item-meta">
              {[
                v.registration,
                v.insurance_due_date ? `Ins: ${formatDate(v.insurance_due_date)}` : null,
                v.tax_due_date ? `Tax: ${formatDate(v.tax_due_date)}` : null,
              ].filter(Boolean).join(' \u00b7 ')}
            </span>
          </div>
          <button
            className="la-entity-delete-btn"
            onClick={() => handleDelete(v.id)}
            aria-label={`Remove ${v.make} ${v.model}`}
          >
            <TrashIcon aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Child panel ────────────────────────────────

function ChildPanel({
  householdId,
  items,
  loading,
  onRefresh,
}: {
  householdId: string
  items: Child[]
  loading: boolean
  onRefresh: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [school, setSchool] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await createChild(householdId, {
        name: name.trim(),
        date_of_birth: dob || undefined,
        school: school.trim() || undefined,
      })
      setName('')
      setDob('')
      setSchool('')
      setAdding(false)
      onRefresh()
    } catch (err) {
      console.error('Failed to add child:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteChild(id)
      onRefresh()
    } catch (err) {
      console.error('Failed to delete child:', err)
    }
  }

  function formatAge(dob: string | null): string {
    if (!dob) return ''
    const years = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return `${years}y`
  }

  return (
    <div className="la-entity-panel">
      <div className="la-entity-panel-header">
        <UserIcon className="la-entity-panel-icon" aria-hidden="true" />
        <span className="la-entity-panel-title">Children</span>
        <button
          className="la-entity-add-btn"
          onClick={() => setAdding(!adding)}
          aria-label="Add child"
        >
          <PlusIcon aria-hidden="true" />
        </button>
      </div>

      {adding && (
        <div className="la-entity-form">
          <input
            className="la-entity-input"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <div className="la-entity-form-row">
            <label className="la-entity-date-label">
              <span>Date of birth</span>
              <input
                className="la-entity-input"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />
            </label>
            <input
              className="la-entity-input"
              placeholder="School"
              value={school}
              onChange={e => setSchool(e.target.value)}
            />
          </div>
          <div className="la-entity-form-actions">
            <button
              className="la-entity-save-btn"
              onClick={handleAdd}
              disabled={saving || !name.trim()}
            >
              {saving ? 'Saving\u2026' : 'Add child'}
            </button>
            <button
              className="la-entity-cancel-btn"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <p className="la-entity-empty">Loading\u2026</p>
      )}

      {!loading && items.length === 0 && !adding && (
        <p className="la-entity-empty">No children added</p>
      )}

      {items.map(c => (
        <div key={c.id} className="la-entity-item">
          <div className="la-entity-item-info">
            <span className="la-entity-item-name">{c.name}</span>
            <span className="la-entity-item-meta">
              {[
                c.date_of_birth ? formatAge(c.date_of_birth) : null,
                c.school,
              ].filter(Boolean).join(' \u00b7 ')}
            </span>
          </div>
          <button
            className="la-entity-delete-btn"
            onClick={() => handleDelete(c.id)}
            aria-label={`Remove ${c.name}`}
          >
            <TrashIcon aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
