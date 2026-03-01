import {
  ArrowPathIcon,
  ChatBubbleOvalLeftIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowLeftIcon,
  BuildingLibraryIcon,
  CpuChipIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  PhotoIcon,
  EyeIcon,
  PencilSquareIcon,
  BellIcon,
  ShieldCheckIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  FolderIcon,
  UserIcon,
  InformationCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'

import {
  CheckIcon as CheckIconSolid,
  ChevronDownIcon as ChevronDownSolid,
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  CheckCircleIcon as CheckCircleSolid,
  PlusIcon as PlusIconSolid,
  XMarkIcon as XMarkSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
} from '@heroicons/react/20/solid'

/* ═══ HELPERS ═══ */

function IconCell({ icon: Icon, name, variant }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; name: string; variant: 'outline' | 'solid' }) {
  return (
    <div className="ds-icon-cell">
      <div className="ds-icon-preview">
        <Icon width={variant === 'outline' ? 24 : 20} height={variant === 'outline' ? 24 : 20} aria-hidden="true" />
      </div>
      <div className="ds-icon-meta">
        <span className="ds-icon-name">{name}</span>
        <span className="ds-icon-variant">{variant === 'outline' ? '24/outline' : '20/solid'}</span>
      </div>
    </div>
  )
}

function RuleCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'baseline',
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>✓</span>
      {children}
    </div>
  )
}

/* ═══ MAIN ═══ */

export default function IconDemo() {
  return (
    <>
      {/* --- Library overview --- */}
      <h3 style={{ marginTop: 0 }}>Icon library — Heroicons</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        The system uses <strong>Heroicons v2</strong> as its sole icon set. No custom SVGs, no
        other icon libraries. Every icon in the product comes from the same family,
        ensuring visual consistency across all surfaces.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { label: 'Package', desc: '@heroicons/react v2' },
          { label: 'Variants used', desc: '24/outline · 20/solid' },
          { label: 'Rendering', desc: 'React SVG components' },
          { label: 'Sizing', desc: 'Explicit width + height props' },
        ].map((item, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* --- Two variants --- */}
      <h3>Two variants, two purposes</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Every icon decision starts here: <strong>outline</strong> for UI chrome, <strong>solid</strong> for
        compact indicators. Never mix variants in the same context.
      </p>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>
            <code style={{ fontSize: 'var(--text-xs)' }}>24/outline</code> — UI &amp; navigation
          </h4>
          <div style={{
            padding: 'var(--space-5)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: Cog6ToothIcon, label: 'Settings' },
                { icon: TrashIcon, label: 'Delete' },
                { icon: PlusIcon, label: 'Add' },
                { icon: MagnifyingGlassIcon, label: 'Search' },
                { icon: ArrowLeftIcon, label: 'Back' },
                { icon: XMarkIcon, label: 'Close' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon width={24} height={24} style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>When:</strong> Navigation buttons, drawer headers, page actions, empty states, sidebar items, toolbar buttons. Default size: 24×24.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>
            <code style={{ fontSize: 'var(--text-xs)' }}>20/solid</code> — compact indicators
          </h4>
          <div style={{
            padding: 'var(--space-5)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: CheckIconSolid, label: 'Confirm' },
                { icon: ChevronDownSolid, label: 'Expand' },
                { icon: ExclamationTriangleSolid, label: 'Warning' },
                { icon: CheckCircleSolid, label: 'Success' },
                { icon: PlusIconSolid, label: 'Add' },
                { icon: MagnifyingGlassSolid, label: 'Search' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Icon width={20} height={20} style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>When:</strong> Inside buttons (14–16px), select dropdowns, form validation marks, inline status indicators. Downsized to 14–16px for tight spaces.
          </p>
        </div>
      </div>

      {/* --- Sizing scale --- */}
      <h3>Sizing scale</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Icons are sized with explicit <code>width</code> and <code>height</code> props, never CSS classes.
        Four sizes cover every context. Always set both dimensions.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'end',
        gap: 'var(--space-8)',
        flexWrap: 'wrap',
        padding: 'var(--space-6)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-3)',
      }}>
        {[
          { size: 14, label: '14px', context: 'Inside small buttons' },
          { size: 16, label: '16px', context: 'Inline with text' },
          { size: 20, label: '20px', context: 'Standard UI' },
          { size: 24, label: '24px', context: 'Navigation, headers' },
          { size: 32, label: '32px', context: 'Empty states' },
        ].map(({ size, label, context }) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <ChatBubbleOvalLeftIcon width={size} height={size} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{label}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 80 }}>{context}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { title: '14px', desc: 'Compact buttons (btn-sm), inline badge icons, chat input micro-actions.' },
          { title: '16px', desc: 'Standard button icons, form field indicators, list item prefixes.' },
          { title: '20–24px', desc: 'Nav items, drawer close buttons, page-level actions, card headers.' },
          { title: '32px', desc: 'Empty states only. The cf-empty-icon class applies this automatically.' },
        ].map((item, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontWeight: 700, marginBottom: 2, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{item.title}</div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* --- Icons in UI contexts --- */}
      <h3>Icons in context</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Live examples of how icons sit alongside text, buttons, and status indicators across the product.
      </p>

      {/* Buttons with icons */}
      <h4>Buttons</h4>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)', alignItems: 'center' }}>
        <button className="btn btn-primary" type="button">
          <PlusIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
          New chat
        </button>
        <button className="btn btn-secondary" type="button">
          <ArrowUpTrayIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
          Upload
        </button>
        <button className="btn btn-ghost" type="button">
          <ArrowPathIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
          Refresh
        </button>
        <button className="btn btn-destructive" type="button">
          <TrashIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
          Delete
        </button>
        <button className="btn btn-primary btn-sm" type="button">
          <PlusIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 2 }} />
          Add
        </button>
      </div>

      {/* Alerts with icons */}
      <h4>Alerts</h4>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div className="alert alert-accent">
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <InformationCircleIcon width={18} height={18} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <div><strong>Info:</strong> Vault connections sync every 15 minutes.</div>
          </div>
        </div>
        <div className="alert alert-warning">
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <ExclamationTriangleIcon width={18} height={18} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <div><strong>Warning:</strong> API key expires in 3 days.</div>
          </div>
        </div>
        <div className="alert alert-destructive">
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <ShieldCheckIcon width={18} height={18} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <div><strong>Error:</strong> Connection revoked. Re-authenticate to continue.</div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <h4>Empty state</h4>
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="empty-state">
          <DocumentTextIcon width={32} height={32} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }} aria-hidden="true" />
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>No documents yet.</p>
          <button className="btn btn-primary" type="button" style={{ marginTop: 'var(--space-3)' }}>
            <PlusIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
            Upload document
          </button>
        </div>
      </div>

      {/* Nav items */}
      <h4>Navigation</h4>
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="sidebar">
          <div className="sidebar-title">Workspace</div>
          <button className="nav-item active" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ChatBubbleOvalLeftIcon width={16} height={16} aria-hidden="true" /> Conversations
          </button>
          <button className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FolderIcon width={16} height={16} aria-hidden="true" /> Documents
          </button>
          <button className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <KeyIcon width={16} height={16} aria-hidden="true" /> Vault
          </button>
          <div className="sidebar-title" style={{ marginTop: 'var(--space-4)' }}>Settings</div>
          <button className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Cog6ToothIcon width={16} height={16} aria-hidden="true" /> Configuration
          </button>
          <button className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <UserIcon width={16} height={16} aria-hidden="true" /> Account
          </button>
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Pattern:</strong> Nav icons use 24/outline at 16px. The icon sits left of the label with an 8px gap. The icon inherits the nav item&apos;s text colour — no separate colour declarations.
          </p>
        </div>
      </div>

      {/* --- Icons in responses --- */}
      <h3>Icons in responses</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Assistant responses can use icons to reinforce meaning. Icons in responses follow stricter rules than UI icons — they must earn their place.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-4)' }}>

        <p>I&apos;ve connected your accounts. Here&apos;s what&apos;s set up:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          {[
            { icon: BuildingLibraryIcon, label: 'Chase Checking', status: 'Connected', ok: true },
            { icon: EnvelopeIcon, label: 'Gmail — work', status: 'Connected', ok: true },
            { icon: CpuChipIcon, label: 'OpenAI API', status: 'Key expired', ok: false },
          ].map(({ icon: Icon, label, status, ok }) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-2) var(--space-3)',
              background: ok ? 'var(--accent-subtle)' : 'var(--destructive-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
            }}>
              <Icon width={16} height={16} style={{ color: ok ? 'var(--accent)' : 'var(--destructive)', flexShrink: 0 }} aria-hidden="true" />
              <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: ok ? 'var(--accent)' : 'var(--destructive)', fontWeight: 600 }}>{status}</span>
            </div>
          ))}
        </div>

        <p style={{ marginBottom: 0 }}>
          The OpenAI key needs to be refreshed. Open the Vault to update it.
        </p>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-4)' }}>

        <p>Your deployment completed successfully.</p>
        <div className="chat-action-confirmed">
          <span className="chat-action-confirmed-icon confirm">
            <CheckCircleIcon width={14} height={14} aria-hidden="true" />
          </span>
          <span className="chat-action-confirmed-label">Deployed to production</span>
          <span className="chat-action-confirmed-time">Just now</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          'Icons in responses must convey meaning, not decoration',
          'Status rows use 16px outline icons, left-aligned',
          'Confirmed actions use 14px icons inside the status strip',
          'Icons inherit the semantic colour of their container',
          'Never use icons inline within prose paragraphs',
          'Status lists pair icons with a coloured background strip',
        ].map((rule, i) => (
          <RuleCard key={i}>{rule}</RuleCard>
        ))}
      </div>

      {/* --- Correct vs Incorrect --- */}
      <h3>Correct vs. incorrect usage</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
    
            <p>Your files are ready:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {['report-q3.pdf', 'slides-deck.pptx', 'data-export.csv'].map(name => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-sm)' }}>
                  <DocumentTextIcon width={16} height={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Icons identify file type at a glance. Consistent 16px sizing. The icon adds information — it doesn&apos;t just decorate.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed' }}>

            <p style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <CheckCircleIcon width={16} height={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              Great news! Your deployment went well
              <CheckCircleIcon width={16} height={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              and everything is
              <CheckCircleIcon width={16} height={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              looking good!
            </p>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--destructive-subtle)',
            border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> Icons scattered in prose. Purely decorative — no information added. Clutters reading flow. Feels like a notification spam.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct — icon button</h4>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <button className="btn btn-primary" type="button">
              <PlusIcon width={14} height={14} aria-hidden="true" style={{ marginRight: 4 }} />
              New chat
            </button>
            <button className="btn btn-ghost" type="button" aria-label="Close">
              <XMarkIcon width={20} height={20} aria-hidden="true" />
            </button>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--space-3)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Text button uses 14px icon with 4px margin-right. Icon-only button uses 20px with <code>aria-label</code>. Both have clear purpose.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect — icon button</h4>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', opacity: 0.7 }}>
            <button className="btn btn-primary" type="button" style={{ borderStyle: 'dashed' }}>
              <PlusIcon width={24} height={24} aria-hidden="true" style={{ marginRight: 8 }} />
              New chat
            </button>
            <button className="btn btn-ghost" type="button" style={{ borderStyle: 'dashed' }}>
              <XMarkIcon width={12} height={12} aria-hidden="true" />
            </button>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--destructive-subtle)',
            border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--space-3)',
          }}>
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> Icon too large for button (24px in a button should be 14px). Close icon too small to hit (12px — below minimum). Missing aria-label on icon-only button.
          </p>
        </div>
      </div>

      {/* --- Icon catalogue --- */}
      <h3>Core icon catalogue</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        The most frequently used icons across the product. Import from these first before reaching for less common Heroicons.
      </p>

      <h4>Navigation &amp; actions</h4>
      <div className="ds-icon-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <IconCell icon={PlusIcon} name="PlusIcon" variant="outline" />
        <IconCell icon={XMarkIcon} name="XMarkIcon" variant="outline" />
        <IconCell icon={ArrowLeftIcon} name="ArrowLeftIcon" variant="outline" />
        <IconCell icon={MagnifyingGlassIcon} name="MagnifyingGlassIcon" variant="outline" />
        <IconCell icon={Cog6ToothIcon} name="Cog6ToothIcon" variant="outline" />
        <IconCell icon={TrashIcon} name="TrashIcon" variant="outline" />
        <IconCell icon={ArrowPathIcon} name="ArrowPathIcon" variant="outline" />
        <IconCell icon={PencilSquareIcon} name="PencilSquareIcon" variant="outline" />
      </div>

      <h4>Content &amp; communication</h4>
      <div className="ds-icon-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <IconCell icon={ChatBubbleOvalLeftIcon} name="ChatBubbleOvalLeftIcon" variant="outline" />
        <IconCell icon={DocumentTextIcon} name="DocumentTextIcon" variant="outline" />
        <IconCell icon={EnvelopeIcon} name="EnvelopeIcon" variant="outline" />
        <IconCell icon={FolderIcon} name="FolderIcon" variant="outline" />
        <IconCell icon={PhotoIcon} name="PhotoIcon" variant="outline" />
        <IconCell icon={ClipboardDocumentIcon} name="ClipboardDocumentIcon" variant="outline" />
        <IconCell icon={LinkIcon} name="LinkIcon" variant="outline" />
        <IconCell icon={BookOpenIcon} name="BookOpenIcon" variant="outline" />
      </div>

      <h4>Vault &amp; connections</h4>
      <div className="ds-icon-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <IconCell icon={KeyIcon} name="KeyIcon" variant="outline" />
        <IconCell icon={BuildingLibraryIcon} name="BuildingLibraryIcon" variant="outline" />
        <IconCell icon={CpuChipIcon} name="CpuChipIcon" variant="outline" />
        <IconCell icon={ShieldCheckIcon} name="ShieldCheckIcon" variant="outline" />
        <IconCell icon={ArrowUpTrayIcon} name="ArrowUpTrayIcon" variant="outline" />
        <IconCell icon={UserIcon} name="UserIcon" variant="outline" />
        <IconCell icon={MicrophoneIcon} name="MicrophoneIcon" variant="outline" />
        <IconCell icon={CalendarDaysIcon} name="CalendarDaysIcon" variant="outline" />
      </div>

      <h4>Status &amp; indicators <code style={{ fontSize: 'var(--text-xs)' }}>20/solid</code></h4>
      <div className="ds-icon-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <IconCell icon={CheckIconSolid} name="CheckIcon" variant="solid" />
        <IconCell icon={CheckCircleSolid} name="CheckCircleIcon" variant="solid" />
        <IconCell icon={ExclamationTriangleSolid} name="ExclamationTriangleIcon" variant="solid" />
        <IconCell icon={ChevronDownSolid} name="ChevronDownIcon" variant="solid" />
        <IconCell icon={PlusIconSolid} name="PlusIcon" variant="solid" />
        <IconCell icon={XMarkSolid} name="XMarkIcon" variant="solid" />
        <IconCell icon={MagnifyingGlassSolid} name="MagnifyingGlassIcon" variant="solid" />
      </div>

      {/* --- Import patterns --- */}
      <h3>Import patterns</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Always import from the correct variant path. Tree-shaking ensures only the icons you use are bundled.
      </p>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="code-block-wrapper">
            <div className="code-block-header">
              <span className="code-block-lang">tsx</span>
            </div>
            <pre><code className="language-tsx">{`// UI icons — outline at 24px
import { PlusIcon, TrashIcon }
  from '@heroicons/react/24/outline'

// Compact indicators — solid at 20px
import { CheckIcon }
  from '@heroicons/react/20/solid'

// Usage — always set both dimensions
<PlusIcon
  width={14}
  height={14}
  aria-hidden="true"
/>`}</code></pre>
          </div>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="code-block-wrapper" style={{ opacity: 0.7 }}>
            <div className="code-block-header">
              <span className="code-block-lang">tsx</span>
            </div>
            <pre><code className="language-tsx">{`// ✗ Don't import the barrel
import { PlusIcon } from '@heroicons/react'

// ✗ Don't use className for sizing
<PlusIcon className="w-6 h-6" />

// ✗ Don't mix outline for indicators
import { CheckIcon }
  from '@heroicons/react/24/outline'
// (solid reads better at 14px)

// ✗ Don't skip aria-hidden
<PlusIcon width={14} height={14} />`}</code></pre>
          </div>
        </div>
      </div>

      {/* --- Accessibility --- */}
      <h3>Accessibility</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Icons are visual — screen readers need text alternatives. Two patterns, no exceptions.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Decorative — icon + visible text</div>
          <div className="code-block-wrapper" style={{ marginBottom: 'var(--space-2)' }}>
            <pre><code>{`<button>
  <PlusIcon aria-hidden="true" />
  New chat
</button>`}</code></pre>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
            The button label provides the accessible name. The icon is hidden from assistive technology with <code>aria-hidden=&quot;true&quot;</code>.
          </p>
        </div>
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Standalone — icon-only button</div>
          <div className="code-block-wrapper" style={{ marginBottom: 'var(--space-2)' }}>
            <pre><code>{`<button aria-label="Close">
  <XMarkIcon aria-hidden="true" />
</button>`}</code></pre>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
            The button needs <code>aria-label</code> since there is no visible text. The icon is still <code>aria-hidden</code> — the label is on the button, not the SVG.
          </p>
        </div>
      </div>

      {/* --- All rules --- */}
      <h3>Icon rules</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {[
          'Heroicons is the only icon library — no custom SVGs',
          '24/outline for UI chrome — navigation, drawers, actions',
          '20/solid for compact indicators — form states, chevrons',
          'Set both width and height explicitly — never rely on CSS',
          '14px in buttons, 16px inline, 20–24px nav, 32px empty states',
          'Always add aria-hidden="true" on the SVG element',
          'Icon-only buttons need aria-label on the button',
          'Icons inherit parent colour — no inline colour declarations',
          'Never use icons inline within prose text in responses',
          'Icons in responses must add information, not decoration',
          'Import from the specific variant path for tree-shaking',
          'Never import from the barrel (@heroicons/react)',
          'Use outline for icons ≥ 20px, solid for icons ≤ 16px',
          'Status rows pair icons with semantic background colour',
        ].map((rule, i) => (
          <RuleCard key={i}>{rule}</RuleCard>
        ))}
      </div>
    </>
  )
}
