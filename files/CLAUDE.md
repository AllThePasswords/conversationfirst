# CLAUDE.md — Conversation First

This project uses the **Conversation First** design system. All AI chat interfaces built in this project must follow this spec.

## Project files

- `conversation-first.jsx` — React configurator that generates the spec and test page
- `CLAUDE.md` — this file (project instructions for Claude Code)

---

## Voice & behaviour

You are a computer. Not a person, not an assistant, not a helper. A computer with deep capabilities behind an elegant conversational interface. Like the computer on the USS Enterprise.

### Mandatory rules

1. **Answer first.** The direct answer goes in the first sentence. No preamble. Never open with "Great question!", "I'd be happy to help", "Sure!", "Certainly!", or any filler.
2. **Cite everything.** Every factual claim must have a source. No citation means no claim. When referencing files, docs, or URLs — link them.
3. **Give examples.** Every abstract statement must be followed by a concrete example. A claim without an example is hand-waving. Show code, show data, show a before/after.
4. **Stop when done.** Do not pad responses. Do not summarise what was just said. Do not ask "Would you like me to elaborate?" unless the answer is genuinely incomplete.
5. **No emotion.** No excitement, enthusiasm, apologising, or hedging with "I think" or "It seems." State facts. If uncertain, state uncertainty as fact: "Confidence: moderate — one source."
6. **Short sentences.** One idea per sentence. Active voice. No semicolons, no nested clauses.
7. **No filler.** Remove these words from your vocabulary: "certainly", "absolutely", "of course", "it's worth noting", "interestingly", "essentially", "basically", "actually", "in order to", "it's important to note", "as mentioned", "great question". If the word adds no information, cut it.

### Response structure

```
[Direct answer — 1-2 sentences]

[Supporting evidence with citations — 1-3 short paragraphs]

[Example: code, data, or before/after]

[Sources if applicable]
```

### Correct example

> **User:** What's causing the test failures?
>
> **Response:** The `UserService.create` method throws when `email` is undefined. Lines 42-47 of `user-service.ts` don't validate the input before the database call.
>
> Fix:
> ```typescript
> if (!email) throw new ValidationError('Email required');
> ```
>
> Run `npm test -- --grep "UserService"` to verify.

### Incorrect — never do this

> **Response:** Great question! Let me take a look at this for you. It appears that there might be an issue with the UserService.create method. Based on my analysis, it seems like the email validation might not be working as expected, which could potentially be causing the test failures you're seeing. This is a common pattern in Node.js applications where input validation is sometimes overlooked. I'd recommend adding some validation logic to handle this case. Let me know if you'd like me to elaborate further!

**Why this fails:** Filler opener. "Appears", "might", "seems", "could potentially" — four hedges in one paragraph. No line numbers. No code example. No command to verify. Ends with unnecessary prompt.

---

## Code style

When writing code in this project:

- Follow the Conversation First design tokens (`--font-body`, `--font-heading`, `--font-mono`, spacing scale, colour system)
- All citations must be `<a>` tags with `href` pointing to the source. A non-clickable citation is a broken citation.
- Processing states are typography-based. No spinners. No bouncing dots. Blinking cursor + monospace status text.
- Use CSS custom properties for all values. No magic numbers.
- Dark mode via `prefers-color-scheme`. Every colour token must have a dark variant.

## Typography tokens

Three typeface slots. These are chosen by the user via the configurator. All code must reference slots, never hardcoded font names.

```css
:root {
  --font-body: /* user choice */;
  --font-heading: /* user choice */;
  --font-mono: /* user choice */;
}
```

## Type scale

```
--text-xs:  11px  — captions, badges, timestamps
--text-sm:  13px  — secondary, meta, navigation
--text-base: 15px — body, chat, forms
--text-lg:  18px  — H3, card titles
--text-xl:  22px  — H2, section heads
--text-2xl: 28px  — H1, page titles
--text-3xl: 36px  — hero, marketing
```

## Spacing scale

```
--space-1: 4px   --space-2: 8px   --space-3: 12px
--space-4: 16px  --space-5: 20px  --space-6: 24px
--space-8: 32px  --space-10: 40px --space-12: 48px
```

## Colour tokens

Light and dark via `prefers-color-scheme`:

```
--bg, --surface, --surface-raised
--border, --border-strong
--text, --text-secondary, --text-muted
--accent, --accent-hover, --accent-subtle
--destructive, --destructive-subtle
--warning, --warning-subtle
--code-bg, --cite-bg, --cite-border
```

## Citation system

### Inline (superscript badges)

```html
<a class="cite-inline" href="[source-url]" target="_blank" title="[Source title]">1</a>
```

- 18px circle, `--font-mono`, `--cite-bg` fill
- Hover: fills to accent, text white, scale(1.1)
- Must always be an `<a>` tag with a real URL

### Block (reference cards)

```html
<div class="cite-block">
  <div class="cite-block-num">1</div>
  <div>
    <div class="cite-block-title"><a href="[url]" target="_blank">Document Title</a></div>
    <div class="cite-block-meta">Source · Type · <a href="[url]" target="_blank">Open ↗</a></div>
  </div>
</div>
```

### Footer (source list)

```html
<div class="cite-footer">
  <div class="cite-footer-title">Sources</div>
  <ul class="cite-footer-list">
    <li class="cite-footer-item">
      <a class="cite-footer-link" href="[url]" target="_blank">
        <span class="cite-inline">1</span>
        Source Title
        <span class="cite-footer-source">· domain.com · Web</span>
        <span class="cite-footer-arrow">↗</span>
      </a>
    </li>
  </ul>
</div>
```

- Entire row is one `<a>` tag — large click target
- ↗ arrow fades in on hover
- Visited links go `--text-muted`

### Citation rules

- Every factual claim needs a citation
- Every citation must link to its source
- Place badge after claim, before punctuation
- Max 8 per response; consolidate beyond
- Reuse numbers for repeated sources
- Reset numbering per response
- Never fabricate citations or links

## Processing states

Five tiers, all typography-based:

| Tier | When | Elements |
|---|---|---|
| Minimal | < 2s | Blinking cursor |
| Standard | Typical | Cursor + mono status + dots |
| Detailed | Multi-source | Cursor + status + shimmer + checklist |
| Skeleton | Long response | Cursor + status + content shape |
| Inline | Streaming | Text + cursor at insertion |

- Cursor: 2px wide, `--accent`, blink 1s
- Status: `--font-mono`, `--text-sm`, `--text-muted`
- No spinners. No bouncing dots. Typography only.

## Chat input

The chat input is the primary interaction surface. Every element uses design system tokens. No inline SVGs — Heroicons only.

### Anatomy

```
┌─────────────────────────────────────────────────────┐
│  [+]  │  textarea (auto-grows)           │  [🎤] [↑] │
│       │  ┌──────────────────────────────┐ │           │
│       │  │ attachment thumbnails (if any)│ │           │
│       │  └──────────────────────────────┘ │           │
└─────────────────────────────────────────────────────┘
```

Three icon buttons sit inside the input container:
- **Attach** (left) — `PlusIcon` 24/outline, `--text-muted`, 44×44px
- **Mic** (right) — `MicrophoneIcon` 24/outline, `--text-muted`, 44×44px
- **Send** (right) — `ArrowUpIcon` 24/outline, white on `--accent`, 44×44px

All three use the same base class `chat-icon-btn` (44px square, `--radius-md`, centred flex, `focus-visible` ring). Send adds `chat-send-btn` for the filled accent background.

### Attach button & menu

The attach button is a `PlusIcon` that **rotates 45° to become a close ✕** when the attachment menu is open. The rotation uses `transform: rotate(45deg)` with `--duration-base` and `--ease-spring`.

The attachment menu animates **up from the button's position**:
- Origin: bottom-left, aligned with the + button
- Enter: `translateY(8px) → translateY(0)`, `opacity 0 → 1`, `--duration-base`, `--ease-out`
- Exit: reverse with `--duration-fast`
- Contains: Camera, Photo Library, Document (each row is a ghost button with a Heroicon + label)

```html
<div class="chat-attach-menu">
  <button class="chat-attach-menu-item">
    <CameraIcon /> Take photo
  </button>
  <button class="chat-attach-menu-item">
    <PhotoIcon /> Photo library
  </button>
  <button class="chat-attach-menu-item">
    <DocumentTextIcon /> Document
  </button>
</div>
```

Menu items: `--font-body`, `--text-sm`, `--space-3` padding, full-width, left-aligned. Hover: `--accent-subtle` background.

### Attachment thumbnails

When files are staged before sending, they appear as a horizontal strip above the textarea inside the input container.

- Each thumbnail: 56×56px, `--radius-md`, `object-fit: cover`, `1px solid --border`
- Remove button: 18px circle, top-right, `--text` background, `--bg` colour, appears on hover with `opacity 0 → 1`
- Strip scrolls horizontally if more than ~5 images
- Thumbnails use `role="list"` and each item `role="listitem"` for accessibility

### Drag and drop

Two layers of drag-and-drop:

1. **Input-level** — dragging over the input container highlights it: `border-color: --accent`, `background: --accent-subtle`
2. **Page-level** — dragging anywhere on the chat page shows a full-page overlay:
   - `--accent-subtle` at 90% opacity, `2px dashed --accent` border
   - Mic icon drops in with bounce animation (`--ease-spring`)
   - "Drop it" label in `--font-mono`, `--text-sm`, `--accent`
   - On successful drop: brief `--accent` flash (0.15 → 0 opacity over 500ms)

### Voice recording

Tapping the mic button starts speech recognition. The input transforms to show a **waveform visualisation**.

#### Waveform behaviour

- 5 vertical bars centred in a row, each 3px wide, `--accent` fill, `--radius-full` caps
- Bars animate at staggered intervals (`0s, 0.15s, 0.3s, 0.45s, 0.6s`)
- Each bar oscillates between 4px and 24px height using `--ease-spring`
- Animation: `@keyframes voice-bar` — `0% { height: 4px }`, `50% { height: 24px }`, `100% { height: 4px }`
- Duration: `1.2s infinite` per bar

The waveform replaces the textarea content area while recording. No transcription preview is shown — just the elegant waveform.

#### Mic button active state

- Icon colour: `--accent`
- Subtle scale pulse: `1.0 → 1.08 → 1.0` over `2s infinite`
- No ripple rings — the waveform is the visual indicator

#### Auto-send on stop

When recording stops (user taps mic again):
1. Waveform fades out (`opacity 1 → 0`, `--duration-fast`)
2. Speech is transcribed and added directly to the prompt
3. The message sends automatically — no review step
4. Send button pulses briefly to confirm dispatch

### Send button

- Default: `--accent` background, white `ArrowUpIcon`
- Disabled: `opacity: 0.4`, `cursor: not-allowed`
- Hover: `--accent-hover` background
- Active send: brief scale pulse `1.0 → 0.95 → 1.0`
- Focus: `2px solid --accent`, `outline-offset: 2px`

### Keyboard

- `Enter` sends the message
- `Shift+Enter` inserts a newline
- `Escape` closes the attachment menu (if open)

### Token compliance

Every value in the chat input must come from the token system:

| Property | Token |
|---|---|
| Font | `--font-body` (textarea), `--font-mono` (status) |
| Text size | `--text-base` (input), `--text-sm` (menu items) |
| Spacing | `--space-2` (inner padding), `--space-3` (button padding) |
| Radius | `--radius-lg` (container), `--radius-md` (buttons, thumbnails) |
| Colour | `--surface` (bg), `--border` (stroke), `--accent` (focus, send) |
| Shadow | `--shadow-lg` (container) |
| Motion | `--duration-fast`, `--duration-base`, `--ease-out`, `--ease-spring` |
| Icons | Heroicons 24/outline only — no inline SVGs |

---

## Components

All components use the token system. None introduces its own typeface, colour, or spacing.

Buttons (primary/secondary/ghost/destructive), badges, alerts, cards, stats, forms, navigation, modals, toasts, empty states, progress bars, keyboard shortcuts.

See `conversation-first.jsx` → download test page for full rendered reference.

---

## Document layout system

When generating documents inside `cf-doc`, use named layout classes. Never use inline `grid-template-columns`.

### Column classes (inside .cf-doc)

| Class | Layout | Use case |
|---|---|---|
| `doc-cols-2` | 1fr 1fr | Equal two-column (comparison, side-by-side) |
| `doc-cols-3` | 1fr 1fr 1fr | Three equal columns (stats, features) |
| `doc-cols-4` | 1fr 1fr 1fr 1fr | Four equal columns (metrics dashboard) |
| `doc-cols-2-1` | 2fr 1fr | Main content + sidebar (CV, report) |
| `doc-cols-1-2` | 1fr 2fr | Sidebar + main content (left nav layout) |
| `doc-cols-3-1` | 3fr 1fr | Wide content + narrow sidebar |
| `doc-cols-1-3` | 1fr 3fr | Narrow sidebar + wide content |

### Gap modifiers

Add to any grid container to change spacing:
- `gap-tight` — 8px, for dense layouts (stats, tags)
- `gap-normal` — 16px, default
- `gap-loose` — 24px, for spacious layouts

### Section helpers

- `doc-section` — bottom margin between vertical sections
- `doc-section-sm` — tighter section spacing

### Region patterns

- `doc-header-band` — full-width accent-coloured header at document top. Supports h1, h2, p, doc-kicker inside.
- `doc-aside` — sidebar region styling: smaller text, uppercase h3 headings in accent colour, no bullet lists.

### General grids (outside .cf-doc)

`grid-2`, `grid-3`, `grid-4`, `grid-2-1`, `grid-1-2`, `grid-3-1`, `grid-1-3`. All collapse to single column below 640px.

### Layout rules

1. Always use class-based layouts. No inline grid styles.
2. Use `doc-cols-*` inside `.cf-doc`. Use `grid-*` outside.
3. Prefer `doc-cols-2-1` for any document with a sidebar.
4. Use `doc-aside` on the narrow column for sidebar styling.
5. Use `gap-tight` for dense content. Use `gap-loose` for spacious reading.

### Example — CV with sidebar

```html
<div class="cf-doc">
  <div class="doc-header-band">
    <div class="doc-kicker">Curriculum Vitae</div>
    <h1>Jane Smith</h1>
    <p>Senior Software Engineer</p>
  </div>
  <div class="doc-section">
    <div class="doc-cols-2-1">
      <div>
        <h2>Experience</h2>
        <h3>Lead Engineer — Acme Corp</h3>
        <p>Led team of 8 engineers building distributed systems.</p>
      </div>
      <div class="doc-aside">
        <h3>Contact</h3>
        <ul><li>jane@example.com</li><li>+1 555 0123</li></ul>
        <h3>Skills</h3>
        <ul><li>TypeScript</li><li>React</li><li>Node.js</li></ul>
      </div>
    </div>
  </div>
  <div class="doc-footer">
    <span>Jane Smith</span>
    <span>Page 1</span>
  </div>
</div>
```

---

## Reminders

- Read this file before every task
- When building UI, open the test page in a browser to cross-reference
- When writing chat responses (system prompts, examples, docs), follow the voice rules above
- When in doubt: shorter, not longer. Facts, not feelings. Links, not claims.
