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
  PencilSquareIcon,
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

/* ═══ MAIN ═══ */

export default function IconDemo() {
  return (
    <>
      {/* --- Icons in responses --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Icons in responses</h3>

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

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>Your deployment completed successfully.</p>
        <div className="chat-action-confirmed">
          <span className="chat-action-confirmed-icon confirm">
            <CheckCircleIcon width={14} height={14} aria-hidden="true" />
          </span>
          <span className="chat-action-confirmed-label">Deployed to production</span>
          <span className="chat-action-confirmed-time">Just now</span>
        </div>
      </div>

      {/* --- Correct vs Incorrect --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Correct vs. incorrect</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
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
            Icons identify file type at a glance. Consistent 16px sizing.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', flex: 1 }}>
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
            Icons scattered in prose. Purely decorative. Clutters reading flow.
          </p>
        </div>
      </div>

      {/* --- Icon catalogue --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Core icon catalogue</h3>

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

      <h4>Connections &amp; status</h4>
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

      <h4>Solid indicators <code style={{ fontSize: 'var(--text-xs)' }}>20/solid</code></h4>
      <div className="ds-icon-grid" style={{ marginBottom: 'var(--space-10)' }}>
        <IconCell icon={CheckIconSolid} name="CheckIcon" variant="solid" />
        <IconCell icon={CheckCircleSolid} name="CheckCircleIcon" variant="solid" />
        <IconCell icon={ExclamationTriangleSolid} name="ExclamationTriangleIcon" variant="solid" />
        <IconCell icon={ChevronDownSolid} name="ChevronDownIcon" variant="solid" />
        <IconCell icon={PlusIconSolid} name="PlusIcon" variant="solid" />
        <IconCell icon={XMarkSolid} name="XMarkIcon" variant="solid" />
        <IconCell icon={MagnifyingGlassSolid} name="MagnifyingGlassIcon" variant="solid" />
      </div>

      {/* --- Rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Icon rules</h3>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {[
          'Heroicons is the only icon library — no custom SVGs',
          '24/outline for UI chrome · 20/solid for compact indicators',
          'Set both width and height explicitly — never rely on CSS',
          '14px in buttons, 16px inline, 20–24px nav, 32px empty states',
          'Always add aria-hidden="true" on the SVG element',
          'Icon-only buttons need aria-label on the button',
          'Icons inherit parent colour — no inline colour declarations',
          'Never use icons inline within prose text in responses',
          'Icons in responses must add information, not decoration',
          'Import from the specific variant path for tree-shaking',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>✓</span>
            {rule}
          </div>
        ))}
      </div>
    </>
  )
}
