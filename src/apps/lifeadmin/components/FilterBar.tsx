import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import DateRangePicker from '../../../components/DateRangePicker'
import CfSelect from '../../../components/CfSelect'
import type { ListFilters, BillCategory, LineItemSource, EntityOption } from '../lib/types'

interface FilterBarProps {
  filters: ListFilters
  entities: EntityOption[]
  onChange: (filters: ListFilters) => void
}

const CATEGORIES: { value: BillCategory; label: string }[] = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscription', label: 'Subscriptions' },
  { value: 'telecom', label: 'Telecom' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'transport', label: 'Transport' },
  { value: 'dining', label: 'Dining' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'council', label: 'Council' },
  { value: 'other', label: 'Other' },
]

const SOURCES: { value: LineItemSource; label: string }[] = [
  { value: 'bank', label: 'Bank' },
  { value: 'bill', label: 'Bill' },
  { value: 'hydrated', label: 'Matched' },
]

export default function FilterBar({ filters, entities, onChange }: FilterBarProps) {
  function update(partial: Partial<ListFilters>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className="la-filter-bar">
      <div className="la-filter-search">
        <MagnifyingGlassIcon className="la-filter-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="la-filter-search-input"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => update({ search: e.target.value })}
          aria-label="Search transactions"
        />
      </div>

      <DateRangePicker
        from={filters.dateFrom}
        to={filters.dateTo}
        onChange={(from, to) => update({ dateFrom: from, dateTo: to })}
      />

      <div className="la-filter-group">
        <label className="la-filter-label" htmlFor="la-filter-category">Category</label>
        <CfSelect
          id="la-filter-category"
          value={filters.categories[0] ?? ''}
          onChange={val => {
            const v = val as BillCategory
            update({ categories: v ? [v] : [] })
          }}
          options={[
            { value: '', label: 'All' },
            ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
          ]}
          aria-label="Category"
        />
      </div>

      <div className="la-filter-group">
        <label className="la-filter-label" htmlFor="la-filter-source">Source</label>
        <CfSelect
          id="la-filter-source"
          value={filters.sources[0] ?? ''}
          onChange={val => {
            const v = val as LineItemSource
            update({ sources: v ? [v] : [] })
          }}
          options={[
            { value: '', label: 'All' },
            ...SOURCES.map(s => ({ value: s.value, label: s.label })),
          ]}
          aria-label="Source"
        />
      </div>

      {entities.length > 0 && (
        <div className="la-filter-group">
          <label className="la-filter-label" htmlFor="la-filter-entity">Entity</label>
          <CfSelect
            id="la-filter-entity"
            value={filters.entityId ?? ''}
            onChange={val => {
              const id = val || null
              const entity = entities.find(en => en.id === id)
              update({
                entityId: id,
                entityType: entity?.type ?? null,
              })
            }}
            options={[
              { value: '', label: 'All' },
              ...entities.map(e => ({ value: e.id, label: e.label })),
            ]}
            aria-label="Entity"
          />
        </div>
      )}
    </div>
  )
}
