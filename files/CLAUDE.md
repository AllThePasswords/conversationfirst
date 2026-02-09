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

## Components

All components use the token system. None introduces its own typeface, colour, or spacing.

Buttons (primary/secondary/ghost/destructive), badges, alerts, cards, stats, forms, navigation, modals, toasts, empty states, progress bars, keyboard shortcuts.

See `conversation-first.jsx` → download test page for full rendered reference.

---

## Reminders

- Read this file before every task
- When building UI, open the test page in a browser to cross-reference
- When writing chat responses (system prompts, examples, docs), follow the voice rules above
- When in doubt: shorter, not longer. Facts, not feelings. Links, not claims.
