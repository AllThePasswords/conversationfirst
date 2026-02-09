import { useState, useCallback, useEffect } from "react";

const FONT_OPTIONS = {
  body: [
    { name: "Source Serif 4", family: "'Source Serif 4', Georgia, serif", style: "serif", desc: "Editorial — warm, highly legible" },
    { name: "Crimson Pro", family: "'Crimson Pro', Georgia, serif", style: "serif", desc: "Book quality — refined reading" },
    { name: "Lora", family: "'Lora', Georgia, serif", style: "serif", desc: "Contemporary — friendly curves" },
    { name: "Spectral", family: "'Spectral', Georgia, serif", style: "serif", desc: "Technical — crisp, structured" },
    { name: "Newsreader", family: "'Newsreader', Georgia, serif", style: "serif", desc: "Newspaper — authoritative, clear" },
    { name: "Alegreya", family: "'Alegreya', Georgia, serif", style: "serif", desc: "Humanist — dynamic, literary" },
    { name: "Merriweather", family: "'Merriweather', Georgia, serif", style: "serif", desc: "Screen-first — sturdy" },
    { name: "Bitter", family: "'Bitter', Georgia, serif", style: "serif", desc: "Slab — bold personality" },
    { name: "DM Sans", family: "'DM Sans', system-ui, sans-serif", style: "sans", desc: "Geometric — clean, modern" },
    { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', system-ui, sans-serif", style: "sans", desc: "Rounded — approachable" },
    { name: "IBM Plex Sans", family: "'IBM Plex Sans', system-ui, sans-serif", style: "sans", desc: "Industrial — neutral character" },
    { name: "Outfit", family: "'Outfit', system-ui, sans-serif", style: "sans", desc: "Variable — soft, versatile" },
  ],
  heading: [
    { name: "Same as body", family: null, desc: "Uniform — single typeface" },
    { name: "Fraunces", family: "'Fraunces', Georgia, serif", style: "serif", desc: "Expressive — optical sizing" },
    { name: "Newsreader", family: "'Newsreader', Georgia, serif", style: "serif", desc: "Newspaper — authoritative" },
    { name: "Source Serif 4", family: "'Source Serif 4', Georgia, serif", style: "serif", desc: "Editorial — clean display" },
    { name: "Outfit", family: "'Outfit', system-ui, sans-serif", style: "sans", desc: "Geometric — crisp large" },
    { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', system-ui, sans-serif", style: "sans", desc: "Rounded — friendly scale" },
    { name: "Recursive", family: "'Recursive', system-ui, sans-serif", style: "sans", desc: "Variable — playful to serious" },
    { name: "SUSE", family: "'SUSE', system-ui, sans-serif", style: "sans", desc: "Technical — engineered" },
    { name: "DM Sans", family: "'DM Sans', system-ui, sans-serif", style: "sans", desc: "Geometric — precise" },
  ],
  mono: [
    { name: "JetBrains Mono", family: "'JetBrains Mono', monospace", desc: "Ligatures, tall x-height" },
    { name: "Fira Code", family: "'Fira Code', monospace", desc: "Mozilla, coding ligatures" },
    { name: "IBM Plex Mono", family: "'IBM Plex Mono', monospace", desc: "Industrial, pairs with Plex" },
    { name: "Source Code Pro", family: "'Source Code Pro', monospace", desc: "Adobe — neutral, legible" },
    { name: "Inconsolata", family: "'Inconsolata', monospace", desc: "Humanist — lighter, elegant" },
  ],
};

const STEPS = ["body", "heading", "mono", "review"];
const STEP_TITLES = { body: "Body typeface", heading: "Heading typeface", mono: "Code typeface", review: "Review & export" };
const STEP_DESCS = {
  body: "The foundation. Chat messages, UI labels, forms, navigation, cards, and all reading surfaces.",
  heading: "Hierarchy. Page titles, section heads, modal titles, card titles, chat headings.",
  mono: "Precision. Code blocks, inline code, technical identifiers, terminal output, data.",
};

function resolve(c) { return c.heading?.family ? c.heading : c.body; }
function fontsUrl(c) {
  const h = resolve(c);
  const n = [...new Set([c.body.name, h.name, c.mono.name])];
  return `https://fonts.googleapis.com/css2?${n.map(x => `family=${x.replace(/ /g, "+")}:ital,wght@0,400;0,600;0,700;1,400`).join("&")}&display=swap`;
}

/* ═══ TEST PAGE GENERATOR ═══ */
function generateTestPage(c) {
  const b = c.body, h = resolve(c), m = c.mono, gf = fontsUrl(c);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Conversation First — Test Page</title>
<link href="${gf}" rel="stylesheet"/>
<style>
:root {
  --font-body: ${b.family};
  --font-heading: ${h.family};
  --font-mono: ${m.family};
  --text-xs:0.75rem;--text-sm:0.8125rem;--text-base:0.9375rem;--text-lg:1.125rem;--text-xl:1.375rem;--text-2xl:1.75rem;--text-3xl:2.25rem;
  --space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-5:20px;--space-6:24px;--space-8:32px;--space-10:40px;--space-12:48px;
  --radius-sm:4px;--radius-md:8px;--radius-lg:12px;--radius-full:9999px;
  --bg:#faf9f7;--surface:#fff;--surface-raised:#fff;--border:#e4e2dd;--border-strong:#ccc9c3;
  --text:#1a1a1a;--text-secondary:#595856;--text-muted:#6b6966;
  --accent:#3d6b5e;--accent-hover:#2f5549;--accent-subtle:#eef4f1;
  --destructive:#c4453a;--destructive-subtle:#fef2f1;--warning:#b58a2b;--warning-subtle:#fef9ee;
  --code-bg:#f3f1ed;--cite-bg:#eef4f1;--cite-border:#3d6b5e;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.04);--shadow-md:0 4px 12px rgba(0,0,0,0.06);--shadow-lg:0 8px 24px rgba(0,0,0,0.08);
}
@media(prefers-color-scheme:dark){:root{
  --bg:#141413;--surface:#1c1c1b;--surface-raised:#232322;--border:#2e2e2c;--border-strong:#444440;
  --text:#e8e6e1;--text-secondary:#b0aea9;--text-muted:#908e89;
  --accent:#6fb89f;--accent-hover:#8dcbb5;--accent-subtle:#1c2923;
  --destructive:#e8675e;--destructive-subtle:#2a1c1b;--warning:#d4a94e;--warning-subtle:#2a2418;
  --code-bg:#232321;--cite-bg:#1c2923;--cite-border:#6fb89f;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.2);--shadow-md:0 4px 12px rgba(0,0,0,0.25);--shadow-lg:0 8px 24px rgba(0,0,0,0.3);
}}
*,*::before,*::after{box-sizing:border-box;margin:0}
html{font-size:16px}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
.page{max-width:840px;margin:0 auto;padding:var(--space-12) var(--space-8) 96px}
.section{margin-bottom:var(--space-12)}
.skip-link{position:absolute;top:-100%;left:var(--space-4);z-index:100;padding:var(--space-2) var(--space-4);background:var(--accent);color:#fff;font-weight:600;font-size:var(--text-sm);border-radius:var(--radius-md);text-decoration:none}
.skip-link:focus{top:var(--space-4)}
.section-label{font-family:var(--font-body);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:600;margin:0 0 var(--space-4);padding-bottom:var(--space-2);border-bottom:1px solid var(--border);line-height:1.6}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4)}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4)}
.grid-2-1{display:grid;grid-template-columns:2fr 1fr;gap:var(--space-4)}
.grid-1-2{display:grid;grid-template-columns:1fr 2fr;gap:var(--space-4)}
.grid-3-1{display:grid;grid-template-columns:3fr 1fr;gap:var(--space-4)}
.grid-1-3{display:grid;grid-template-columns:1fr 3fr;gap:var(--space-4)}
@media(max-width:640px){.grid-2,.grid-3,.grid-4,.grid-2-1,.grid-1-2,.grid-3-1,.grid-1-3{grid-template-columns:1fr}}
.gap-tight{gap:var(--space-2)}.gap-normal{gap:var(--space-4)}.gap-loose{gap:var(--space-6)}
.header{margin-bottom:var(--space-12);padding-bottom:var(--space-8);border-bottom:1px solid var(--border)}
.header-kicker{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:500;margin-bottom:var(--space-2)}
.header h1{font-family:var(--font-heading);font-size:var(--text-3xl);font-weight:700;letter-spacing:-0.03em;line-height:1.15;margin-bottom:var(--space-3)}
.header p{color:var(--text-secondary);font-size:var(--text-base);max-width:560px}
.config-bar{display:flex;gap:var(--space-6);flex-wrap:wrap;padding:var(--space-4) var(--space-5);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-12);font-size:var(--text-sm)}
.config-bar dt{color:var(--text-muted);font-size:var(--text-xs);margin-bottom:1px}
.config-bar dd{font-weight:600;margin:0}
h1{font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.02em;line-height:1.2;margin:1.5em 0 0.5em}
h2{font-family:var(--font-heading);font-size:var(--text-xl);font-weight:700;letter-spacing:-0.01em;line-height:1.25;margin:1.5em 0 0.5em}
h3{font-family:var(--font-heading);font-size:var(--text-lg);font-weight:600;line-height:1.3;margin:1.25em 0 0.4em}
h4{font-family:var(--font-heading);font-size:var(--text-base);font-weight:600;margin:1em 0 0.3em}
p{margin:0 0 1em;line-height:1.6}
a{color:var(--accent);text-decoration:underline;text-underline-offset:2px}
strong{font-weight:700}
em{font-style:italic}
code{font-family:var(--font-mono);font-size:0.85em;background:var(--code-bg);padding:2px 7px;border-radius:var(--radius-sm)}
pre{background:var(--code-bg);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-4) var(--space-5);overflow-x:auto;margin:0 0 1em}
pre code{background:none;padding:0;font-size:var(--text-sm);line-height:1.55}
blockquote{border-left:3px solid var(--border);padding-left:var(--space-4);color:var(--text-secondary);margin:0 0 1em;font-style:italic}
ul,ol{padding-left:var(--space-5);margin:0 0 1em}
li{margin-bottom:var(--space-2)}
li::marker{color:var(--text-muted)}
hr{border:none;border-top:1px solid var(--border);margin:1.5em 0}
table{width:100%;border-collapse:collapse;margin:0 0 1em;font-size:var(--text-base)}
th{text-align:left;font-weight:600;padding:var(--space-3);border-bottom:2px solid var(--border)}
td{padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--border)}
tr:last-child td{border-bottom:none}
.chat-bubble{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--space-6) var(--space-8);margin-bottom:var(--space-3)}
.chat-bubble.user{background:var(--bg);margin-left:var(--space-12)}
.bubble-label{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);font-weight:600;margin-bottom:var(--space-3)}
.cite-inline{display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:0.625rem;font-weight:600;width:18px;height:18px;border-radius:var(--radius-full);background:var(--cite-bg);color:var(--cite-border);border:1px solid color-mix(in srgb,var(--cite-border) 50%,transparent);vertical-align:super;margin:0 1px;cursor:pointer;text-decoration:none;position:relative;top:-1px;transition:all 0.12s ease}
.cite-inline:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.cite-inline:hover{background:color-mix(in srgb,var(--cite-bg) 60%,var(--cite-border));color:#fff;border-color:var(--cite-border);transform:scale(1.1)}
.cite-inline:active{transform:scale(0.95)}
.cite-block{display:flex;gap:var(--space-3);padding:var(--space-3) var(--space-4);background:var(--cite-bg);border-left:3px solid var(--cite-border);border-radius:0 var(--radius-md) var(--radius-md) 0;margin:0 0 1em;font-size:var(--text-sm)}
.cite-block-num{font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600;color:var(--cite-border);min-width:18px;text-align:center;padding-top:1px}
.cite-block-title{font-weight:600;margin-bottom:1px}
.cite-block-title a{color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);transition:border-color 0.12s,color 0.12s}
.cite-block-title a:hover{color:var(--accent);border-color:var(--accent)}
.cite-block-meta{font-size:var(--text-xs);color:var(--text-muted)}
.cite-block-meta a{color:var(--text-secondary);text-decoration:none;border-bottom:1px solid var(--border-strong);transition:all 0.12s}
.cite-block-meta a:hover{color:var(--accent);border-color:var(--accent)}
.cite-footer{margin-top:var(--space-6);padding-top:var(--space-4);border-top:1px solid var(--border)}
.cite-footer-title{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);font-weight:600;margin-bottom:var(--space-3)}
.cite-footer-list{list-style:none;padding:0;margin:0}
.cite-footer-item{display:flex;gap:var(--space-2);align-items:baseline;margin-bottom:var(--space-2);font-size:var(--text-sm)}
.cite-footer-item .cite-inline{position:static;vertical-align:baseline}
.cite-footer-item a{color:var(--accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--accent) 30%,transparent);transition:border-color 0.12s}
.cite-footer-item a:hover{border-color:var(--accent)}
.cite-footer-item a:visited{color:var(--text-muted)}
.cite-footer-link{display:flex;align-items:baseline;gap:var(--space-2);flex:1;text-decoration:none;color:var(--text);transition:color 0.12s}
.cite-footer-link:hover{color:var(--accent)}
.cite-footer-link:hover .cite-inline{background:color-mix(in srgb,var(--cite-bg) 60%,var(--cite-border));color:#fff;border-color:var(--cite-border)}
.cite-footer-source{color:var(--text-muted);font-size:var(--text-xs)}
.cite-footer-arrow{color:var(--text-muted);font-size:var(--text-xs);margin-left:auto;opacity:0;transition:opacity 0.12s}
.cite-footer-link:hover .cite-footer-arrow{opacity:1}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{display:inline-flex;align-items:center;gap:var(--space-2);font-family:var(--font-body);font-size:var(--text-sm);font-weight:600;padding:var(--space-2) var(--space-4);border-radius:var(--radius-md);border:1px solid transparent;cursor:pointer;transition:all 0.15s;text-decoration:none;line-height:1.4;min-height:36px}
.btn-primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.btn-secondary{background:var(--surface);color:var(--text);border-color:var(--border)}
.btn-ghost{background:transparent;color:var(--text-secondary)}
.btn-destructive{background:var(--destructive-subtle);color:var(--destructive);border-color:color-mix(in srgb,var(--destructive) 20%,transparent)}
.btn-sm{font-size:var(--text-xs);padding:var(--space-1) var(--space-3);min-height:28px}
.badge{display:inline-flex;align-items:center;font-size:var(--text-xs);font-weight:600;padding:2px var(--space-2);border-radius:var(--radius-full);line-height:1.4}
.badge-accent{background:var(--accent-subtle);color:var(--accent)}
.badge-warning{background:var(--warning-subtle);color:var(--warning)}
.badge-destructive{background:var(--destructive-subtle);color:var(--destructive)}
.badge-muted{background:var(--bg);color:var(--text-muted);border:1px solid var(--border)}
.input-group{margin-bottom:var(--space-4)}
.input-label{display:block;font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-1)}
.input-hint{font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)}
.input{font-family:var(--font-body);font-size:var(--text-base);padding:var(--space-2) var(--space-3);border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);width:100%;transition:border-color 0.15s}
.input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.input-mono{font-family:var(--font-mono);font-size:var(--text-sm)}
textarea.input{min-height:80px;resize:vertical;line-height:1.5}
select.input{appearance:auto}
.nav-item{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);font-size:var(--text-sm);color:var(--text-secondary);cursor:pointer;transition:all 0.12s;text-decoration:none;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--bg);color:var(--text)}
.nav-item.active{background:var(--accent-subtle);color:var(--accent);font-weight:600}
.sidebar{background:var(--surface);padding:var(--space-5);width:240px;min-height:300px;border-radius:var(--radius-lg);border:1px solid var(--border)}
.sidebar-title{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);font-weight:600;margin-bottom:var(--space-3);padding:0 var(--space-3)}
.card{background:var(--surface-raised);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--space-5);box-shadow:var(--shadow-sm)}
.card-title{font-family:var(--font-heading);font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-1);letter-spacing:-0.01em}
.card-desc{font-size:var(--text-sm);color:var(--text-secondary);line-height:1.5;margin-bottom:var(--space-3)}
.card-meta{font-size:var(--text-xs);color:var(--text-muted)}
.stat{text-align:center;padding:var(--space-5)}
.stat-value{font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.02em}
.stat-label{font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:var(--space-1)}
.alert{display:flex;gap:var(--space-3);padding:var(--space-3) var(--space-4);border-radius:var(--radius-md);font-size:var(--text-sm);line-height:1.5;margin-bottom:var(--space-4)}
.alert-accent{background:var(--accent-subtle);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)}
.alert-warning{background:var(--warning-subtle);color:var(--warning);border:1px solid color-mix(in srgb,var(--warning) 20%,transparent)}
.alert-destructive{background:var(--destructive-subtle);color:var(--destructive);border:1px solid color-mix(in srgb,var(--destructive) 20%,transparent)}
.toast{display:inline-flex;align-items:center;gap:var(--space-2);background:var(--text);color:var(--bg);padding:var(--space-2) var(--space-5);border-radius:var(--radius-md);font-size:var(--text-sm);font-weight:600;box-shadow:var(--shadow-lg)}
.empty-state{text-align:center;padding:var(--space-12) var(--space-8);color:var(--text-muted)}
.empty-state p{font-size:var(--text-sm);max-width:320px;margin:0 auto var(--space-4)}
.progress-bar{height:6px;background:var(--bg);border-radius:var(--radius-full);overflow:hidden;margin-bottom:var(--space-2)}
.progress-fill{height:100%;background:var(--accent);border-radius:var(--radius-full)}
kbd{font-family:var(--font-mono);font-size:var(--text-xs);padding:2px 6px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);box-shadow:0 1px 0 var(--border)}
.modal{background:var(--surface);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:var(--space-8);max-width:480px;width:100%}
.modal h2{font-family:var(--font-heading);font-size:var(--text-xl);margin:0 0 var(--space-2)}
.modal p{color:var(--text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-6)}
.modal-actions{display:flex;gap:var(--space-2);justify-content:flex-end}

@keyframes breathe{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes cursor-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes dot-cascade{0%,80%,100%{opacity:0.2}40%{opacity:1}}

.processing{padding:var(--space-6) var(--space-8)}
.processing-status{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)}
.processing-cursor{width:2px;height:18px;background:var(--accent);animation:cursor-blink 1s ease-in-out infinite;border-radius:1px}
.processing-text{font-family:var(--font-mono);font-size:var(--text-sm);color:var(--accent);letter-spacing:0.01em}
.processing-text .dot{animation:dot-cascade 1.4s ease-in-out infinite}
.processing-text .dot:nth-child(2){animation-delay:0.2s}
.processing-text .dot:nth-child(3){animation-delay:0.4s}

.processing-line{height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);background-size:200% 100%;animation:shimmer 2s ease-in-out infinite;margin-bottom:var(--space-3);border-radius:1px}

.processing-skeleton{margin-top:var(--space-2)}
.skeleton-line{height:12px;border-radius:var(--radius-sm);margin-bottom:var(--space-2);background:linear-gradient(90deg,var(--border) 25%,color-mix(in srgb,var(--border) 50%,transparent) 50%,var(--border) 75%);background-size:200% 100%;animation:shimmer 1.8s ease-in-out infinite}

.processing-minimal .processing-status{margin-bottom:0}
.processing-thinking .processing-text{font-style:italic}
.nav-item:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important}}

/* Document layout */
.cf-doc{background:#fff;color:#1a1a1a;border-radius:var(--radius-md);padding:48px 56px;max-width:680px;margin:0 auto;font-size:var(--text-base);line-height:1.6;box-shadow:var(--shadow-md);overflow:hidden;position:relative}
@media(prefers-color-scheme:dark){.cf-doc{box-shadow:0 4px 24px rgba(0,0,0,0.4)}}
.cf-doc h1{font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.02em;line-height:1.2;margin:0 0 var(--space-2);color:#1a1a1a}
.cf-doc h2{font-family:var(--font-heading);font-size:var(--text-lg);font-weight:700;line-height:1.3;margin:var(--space-6) 0 var(--space-2);color:#1a1a1a}
.cf-doc h3{font-family:var(--font-heading);font-size:var(--text-base);font-weight:600;line-height:1.4;margin:var(--space-4) 0 var(--space-1);color:#1a1a1a}
.cf-doc p{margin:0 0 var(--space-3);color:#1a1a1a}
.cf-doc .doc-kicker{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);font-weight:600;margin-bottom:var(--space-1)}
.cf-doc .doc-subtitle{font-size:var(--text-sm);color:#595856;margin-bottom:var(--space-6);line-height:1.5}
.cf-doc .doc-divider{border:none;border-top:2px solid var(--accent);width:40px;margin:var(--space-4) 0 var(--space-6)}
.cf-doc .doc-footer{position:absolute;bottom:48px;left:56px;right:56px;font-size:var(--text-xs);color:#6b6966;border-top:1px solid #e4e2dd;padding-top:var(--space-3);display:flex;justify-content:space-between}
.cf-doc .doc-cols{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5)}
.cf-doc .doc-cols-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5)}
.cf-doc .doc-cols-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4)}
.cf-doc .doc-cols-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:var(--space-3)}
.cf-doc .doc-cols-2-1{display:grid;grid-template-columns:2fr 1fr;gap:var(--space-5)}
.cf-doc .doc-cols-1-2{display:grid;grid-template-columns:1fr 2fr;gap:var(--space-5)}
.cf-doc .doc-cols-3-1{display:grid;grid-template-columns:3fr 1fr;gap:var(--space-5)}
.cf-doc .doc-cols-1-3{display:grid;grid-template-columns:1fr 3fr;gap:var(--space-5)}
.cf-doc .doc-highlight{background:var(--accent-subtle);border-left:3px solid var(--accent);padding:var(--space-3) var(--space-4);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:var(--text-sm);margin:var(--space-3) 0}
.cf-doc .doc-section{margin-bottom:var(--space-6)}
.cf-doc .doc-section:last-child{margin-bottom:0}
.cf-doc .doc-section-sm{margin-bottom:var(--space-3)}
.cf-doc .doc-header-band{background:var(--accent);color:#fff;margin:-48px -56px 0;padding:var(--space-8) 56px var(--space-6);margin-bottom:var(--space-6)}
.cf-doc .doc-header-band h1,.cf-doc .doc-header-band h2,.cf-doc .doc-header-band h3{color:#fff;margin-top:0}
.cf-doc .doc-header-band p{color:rgba(255,255,255,0.85)}
.cf-doc .doc-header-band .doc-kicker{color:rgba(255,255,255,0.7)}
.cf-doc .doc-aside{font-size:var(--text-sm);color:#595856}
.cf-doc .doc-aside h3{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.08em;color:var(--accent);font-weight:600;margin:var(--space-4) 0 var(--space-2)}
.cf-doc .doc-aside h3:first-child{margin-top:0}
.cf-doc .doc-aside ul{list-style:none;padding-left:0}
.cf-doc .doc-aside li{padding-left:0}
.cf-doc ul,.cf-doc ol{padding-left:var(--space-5);margin:0 0 var(--space-3)}
.cf-doc li{margin-bottom:var(--space-1);font-size:var(--text-sm)}
@media(prefers-color-scheme:dark){.cf-doc .doc-aside{color:var(--text-secondary)}}
</style>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<main id="main-content" class="page">

<div class="header">
  <div class="header-kicker">Conversation First</div>
  <h1>Test Page</h1>
  <p>Every element. Chat, processing states, components. Your typefaces. Dark mode automatic.</p>
</div>

<dl class="config-bar">
  <div><dt>Body</dt><dd style="font-family:var(--font-body)">${b.name}</dd></div>
  <div><dt>Heading</dt><dd style="font-family:var(--font-heading)">${h.name}</dd></div>
  <div><dt>Mono</dt><dd style="font-family:var(--font-mono)">${m.name}</dd></div>
</dl>

<!-- PROCESSING STATES -->
<section class="section" aria-labelledby="s-processing">
<h2 class="section-label" id="s-processing">Processing states</h2>

<h3>Minimal — cursor only</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">For fast responses under 2 seconds. Just a blinking cursor.</p>
<div class="chat-bubble">
  <div class="bubble-label">Assistant</div>
  <div class="processing processing-minimal">
    <div class="processing-status">
      <div class="processing-cursor"></div>
    </div>
  </div>
</div>

<h3>Standard — status text</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">For typical responses. Monospace status with animated dots.</p>
<div class="chat-bubble">
  <div class="bubble-label">Assistant</div>
  <div class="processing">
    <div class="processing-status">
      <div class="processing-cursor"></div>
      <div class="processing-text">Processing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
    </div>
  </div>
</div>

<h3>Detailed — with context</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">For complex queries. Shows what the system is doing.</p>
<div class="chat-bubble">
  <div class="bubble-label">Assistant</div>
  <div class="processing">
    <div class="processing-status">
      <div class="processing-cursor"></div>
      <div class="processing-text">Searching 3 documents<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
    </div>
    <div class="processing-line"></div>
    <div style="font-size:var(--text-xs);color:var(--text-muted);font-family:var(--font-mono)">
      <div style="margin-bottom:2px">✓ Q3 Financial Report</div>
      <div style="margin-bottom:2px">✓ SaaS Benchmarks 2025</div>
      <div style="animation:breathe 1.5s ease-in-out infinite">◇ Sales Pipeline Dashboard</div>
    </div>
  </div>
</div>

<h3>Skeleton — content preview</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">For long responses. Shows the shape of incoming content.</p>
<div class="chat-bubble">
  <div class="bubble-label">Assistant</div>
  <div class="processing">
    <div class="processing-status">
      <div class="processing-cursor"></div>
      <div class="processing-text">Composing response<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
    </div>
    <div class="processing-skeleton">
      <div class="skeleton-line" style="width:45%;height:16px;margin-bottom:var(--space-3)"></div>
      <div class="skeleton-line" style="width:100%"></div>
      <div class="skeleton-line" style="width:92%"></div>
      <div class="skeleton-line" style="width:78%"></div>
      <div class="skeleton-line" style="width:85%;margin-bottom:var(--space-4)"></div>
      <div class="skeleton-line" style="width:35%;height:14px;margin-bottom:var(--space-2)"></div>
      <div class="skeleton-line" style="width:100%"></div>
      <div class="skeleton-line" style="width:65%"></div>
    </div>
  </div>
</div>

<h3>Inline — mid-stream</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">When text is streaming in and the model is still generating.</p>
<div class="chat-bubble">
  <div class="bubble-label">Assistant</div>
  <p>Revenue grew 18% quarter-over-quarter, reaching $4.2M<a class="cite-inline" href="https://docs.google.com/document/d/example-q3-report" target="_blank" title="Q3 Financial Report">1</a>. This outpaces the industry median<span style="display:inline-block;width:2px;height:16px;background:var(--accent);animation:cursor-blink 1s ease-in-out infinite;vertical-align:text-bottom;margin-left:2px;border-radius:1px"></span></p>
</div>
</section>

<!-- CONVERSATION TONE -->
<section class="section" aria-labelledby="s-tone">
<h2 class="section-label" id="s-tone">Conversation — correct tone</h2>

<div class="chat-bubble user"><div class="bubble-label">User</div>
<p>What's the retention rate for Q3?</p>
</div>

<div class="chat-bubble"><div class="bubble-label">Assistant</div>
<p>124% net revenue retention. Up from 118% in Q2<a class="cite-inline" href="https://docs.google.com/document/d/example-q3-report" target="_blank" title="Q3 Financial Report">1</a>.</p>
<p>For context, the SaaS industry median is 110%<a class="cite-inline" href="https://openviewpartners.com/saas-benchmarks-2025" target="_blank" title="OpenView SaaS Benchmarks 2025">2</a>. The improvement came from expansion revenue in the mid-market segment, where average contract value increased 31%<a class="cite-inline" href="https://docs.google.com/document/d/example-q3-report" target="_blank" title="Q3 Financial Report">1</a>.</p>
<div class="cite-footer">
  <div class="cite-footer-title">Sources</div>
  <ul class="cite-footer-list">
    <li class="cite-footer-item"><a class="cite-footer-link" href="https://docs.google.com/document/d/example-q3-report" target="_blank"><span class="cite-inline">1</span> Q3 Financial Report <span class="cite-footer-source">· Google Drive · Document</span><span class="cite-footer-arrow">↗</span></a></li>
    <li class="cite-footer-item"><a class="cite-footer-link" href="https://openviewpartners.com/saas-benchmarks-2025" target="_blank"><span class="cite-inline">2</span> OpenView SaaS Benchmarks 2025 <span class="cite-footer-source">· openviewpartners.com · Web</span><span class="cite-footer-arrow">↗</span></a></li>
  </ul>
</div>
</div>

<p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-4);padding:var(--space-3) var(--space-4);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md)">
  <strong style="color:var(--text-secondary)">Why this is correct:</strong> Direct answer first. No preamble. Supporting context with citations. Every claim has a source. Stopped when done.
</p>

<h3 style="margin-top:var(--space-8)">Incorrect tone — for comparison</h3>

<div class="chat-bubble" style="opacity:0.7;border-style:dashed">
  <div class="bubble-label">Assistant ✗</div>
  <p>Great question! I'd be happy to help you with that. Based on my analysis of your Q3 data, it looks like the net revenue retention rate came in at a really impressive 124%, which is actually a significant improvement over the previous quarter. This is particularly noteworthy because it suggests strong product-market fit and indicates that your existing customers are finding increasing value in the platform. The industry benchmarks suggest this is well above average, which is definitely something to celebrate! Let me know if you'd like me to dig deeper into any of these metrics.</p>
</div>

<p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-4);padding:var(--space-3) var(--space-4);background:var(--destructive-subtle);border:1px solid color-mix(in srgb,var(--destructive) 15%,transparent);border-radius:var(--radius-md)">
  <strong style="color:var(--destructive)">Why this is wrong:</strong> Filler opener. Emotional language. No citations. No examples. Verbose. Editorialising. Ends with unnecessary prompt.
</p>
</section>

<!-- COMPLEX QUERY -->
<section class="section" aria-labelledby="s-complex">
<h2 class="section-label" id="s-complex">Conversation — complex query</h2>

<div class="chat-bubble user"><div class="bubble-label">User</div>
<p>How does our Q3 margin compare to industry, and what drove the change?</p>
</div>

<div class="chat-bubble"><div class="bubble-label">Assistant</div>
<p>Gross margin was 72%, versus industry median of 65%<a class="cite-inline" href="https://docs.google.com/document/d/example-q3-report" target="_blank" title="Q3 Financial Report">1</a><a class="cite-inline" href="https://openviewpartners.com/saas-benchmarks-2025" target="_blank" title="OpenView SaaS Benchmarks">2</a>.</p>
<p>The 4-point improvement from Q2 came from two changes:</p>
<ul>
  <li>Infrastructure migration to arm64 instances reduced compute costs 22%<a class="cite-inline" href="https://docs.google.com/document/d/example-infra-postmortem" target="_blank" title="Infra Migration Post-Mortem">3</a></li>
  <li>Renegotiated data provider contracts saved $180K annually<a class="cite-inline" href="https://docs.google.com/document/d/example-q3-report" target="_blank" title="Q3 Financial Report">1</a></li>
</ul>
<pre><code>-- Margin trend
SELECT quarter, gross_margin
FROM metrics.financials
WHERE year = 2025
ORDER BY quarter;

Q1: 66%  Q2: 68%  Q3: 72%</code></pre>
<div class="cite-block">
  <div class="cite-block-num">3</div>
  <div><div class="cite-block-title"><a href="https://docs.google.com/document/d/example-infra-postmortem" target="_blank">Infrastructure Migration Post-Mortem</a></div>
  <div class="cite-block-meta">Google Docs · Engineering · <a href="https://docs.google.com/document/d/example-infra-postmortem" target="_blank">Open document ↗</a></div></div>
</div>
<div class="cite-footer">
  <div class="cite-footer-title">Sources</div>
  <ul class="cite-footer-list">
    <li class="cite-footer-item"><a class="cite-footer-link" href="https://docs.google.com/document/d/example-q3-report" target="_blank"><span class="cite-inline">1</span> Q3 Financial Report <span class="cite-footer-source">· Google Drive · Document</span><span class="cite-footer-arrow">↗</span></a></li>
    <li class="cite-footer-item"><a class="cite-footer-link" href="https://openviewpartners.com/saas-benchmarks-2025" target="_blank"><span class="cite-inline">2</span> OpenView SaaS Benchmarks <span class="cite-footer-source">· openviewpartners.com · Web</span><span class="cite-footer-arrow">↗</span></a></li>
    <li class="cite-footer-item"><a class="cite-footer-link" href="https://docs.google.com/document/d/example-infra-postmortem" target="_blank"><span class="cite-inline">3</span> Infra Migration Post-Mortem <span class="cite-footer-source">· Google Drive · Document</span><span class="cite-footer-arrow">↗</span></a></li>
  </ul>
</div>
</div>
</section>

<!-- APP COMPONENTS -->
<section class="section" aria-labelledby="s-components">
<h2 class="section-label" id="s-components">App components</h2>

<h3>Buttons</h3>
<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-6);align-items:center">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-destructive">Delete</button>
  <button class="btn btn-primary btn-sm">Small</button>
</div>

<h3>Badges</h3>
<div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-6)">
  <span class="badge badge-accent">Active</span>
  <span class="badge badge-warning">Pending</span>
  <span class="badge badge-destructive">Error</span>
  <span class="badge badge-muted">Draft</span>
</div>

<h3>Alerts</h3>
<div class="alert alert-accent"><div><strong>Info:</strong> Press <kbd>⌘K</kbd> to open command palette.</div></div>
<div class="alert alert-warning"><div><strong>Warning:</strong> API key expires in 3 days.</div></div>
<div class="alert alert-destructive"><div><strong>Error:</strong> Deployment failed. Check build logs.</div></div>

<h3>Cards</h3>
<div class="grid-3" style="margin-bottom:var(--space-6)">
  <div class="card"><div class="card-title">Weekly Summary</div><div class="card-desc">AI digest of team activity and blockers.</div><div class="card-meta">2 hours ago</div></div>
  <div class="card"><div class="card-title">Meeting Notes</div><div class="card-desc">Transcribed notes from calendar events.</div><div class="card-meta">3 new</div></div>
  <div class="card"><div class="card-title">Research Agent</div><div class="card-desc">Deep research with citations.</div><div class="card-meta"><span class="badge badge-accent">Beta</span></div></div>
</div>

<h3>Stats</h3>
<div class="grid-3" style="margin-bottom:var(--space-6)">
  <div class="card stat"><div class="stat-value">2,847</div><div class="stat-label">Messages</div></div>
  <div class="card stat"><div class="stat-value">94.2%</div><div class="stat-label">Accuracy</div></div>
  <div class="card stat"><div class="stat-value">1.8s</div><div class="stat-label">Latency</div></div>
</div>

<h3>Forms</h3>
<div style="max-width:440px;margin-bottom:var(--space-6)">
  <div class="input-group"><label class="input-label" for="tp-project">Project name</label><input id="tp-project" class="input" value="Conversation First"/></div>
  <div class="input-group"><label class="input-label" for="tp-endpoint">Endpoint</label><div class="input-hint" id="tp-endpoint-hint">Base URL for the AI service</div><input id="tp-endpoint" class="input input-mono" value="https://api.anthropic.com/v1" aria-describedby="tp-endpoint-hint"/></div>
  <div class="input-group"><label class="input-label" for="tp-prompt">System prompt</label><textarea id="tp-prompt" class="input">You are a computer. Answer directly. Cite sources. Give examples. Do not editorialize.</textarea></div>
  <div style="display:flex;gap:var(--space-2)"><button class="btn btn-primary">Save</button><button class="btn btn-secondary">Cancel</button></div>
</div>

<h3>Navigation</h3>
<div class="grid-2" style="margin-bottom:var(--space-6)">
  <div class="sidebar">
    <div class="sidebar-title">Workspace</div>
    <button class="nav-item active">◆ Dashboard</button>
    <button class="nav-item">◇ Conversations</button>
    <button class="nav-item">◇ Documents</button>
    <div class="sidebar-title" style="margin-top:var(--space-4)">Settings</div>
    <button class="nav-item">◇ Configuration</button>
    <button class="nav-item">◇ API keys</button>
  </div>
  <div>
    <h4>Empty state</h4>
    <div class="card"><div class="empty-state"><p>No conversations yet.</p><button class="btn btn-primary">New conversation</button></div></div>
  </div>
</div>

<h3>Modal</h3>
<div class="card" style="padding:0;overflow:hidden;margin-bottom:var(--space-6)">
  <div style="background:color-mix(in srgb,var(--bg) 60%,transparent);padding:var(--space-8);display:flex;justify-content:center">
    <div class="modal" style="position:static">
      <h2>Delete conversation?</h2>
      <p>Permanent. Cannot be undone.</p>
      <div class="modal-actions"><button class="btn btn-secondary">Cancel</button><button class="btn btn-destructive">Delete</button></div>
    </div>
  </div>
</div>

<h3>Toast</h3>
<div style="margin-bottom:var(--space-6)"><span class="toast">✓ Exported</span></div>

</section>

<!-- DOCUMENT LAYOUT -->
<section class="section" aria-labelledby="s-layout">
<h2 class="section-label" id="s-layout">Document layout system</h2>

<h3>Equal columns</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">Two, three, and four equal columns for content grids.</p>
<div class="grid-2" style="margin-bottom:var(--space-4)">
  <div class="card"><div class="card-title">Column 1</div><div class="card-desc">Half width</div></div>
  <div class="card"><div class="card-title">Column 2</div><div class="card-desc">Half width</div></div>
</div>
<div class="grid-3" style="margin-bottom:var(--space-4)">
  <div class="card"><div class="card-title">Col 1</div><div class="card-desc">Third</div></div>
  <div class="card"><div class="card-title">Col 2</div><div class="card-desc">Third</div></div>
  <div class="card"><div class="card-title">Col 3</div><div class="card-desc">Third</div></div>
</div>
<div class="grid-4" style="margin-bottom:var(--space-6)">
  <div class="card stat"><div class="stat-value">$4.2M</div><div class="stat-label">Revenue</div></div>
  <div class="card stat"><div class="stat-value">124%</div><div class="stat-label">NRR</div></div>
  <div class="card stat"><div class="stat-value">72%</div><div class="stat-label">Margin</div></div>
  <div class="card stat"><div class="stat-value">847</div><div class="stat-label">Customers</div></div>
</div>

<h3>Asymmetric columns</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">Named ratio classes for main + sidebar layouts.</p>
<div class="grid-2-1" style="margin-bottom:var(--space-4)">
  <div class="card"><div class="card-title">Main content (2fr)</div><div class="card-desc">Two-thirds width. Use for primary content in documents, reports, and CVs.</div></div>
  <div class="card"><div class="card-title">Sidebar (1fr)</div><div class="card-desc">One-third width.</div></div>
</div>
<div class="grid-3-1" style="margin-bottom:var(--space-6)">
  <div class="card"><div class="card-title">Wide content (3fr)</div><div class="card-desc">Three-quarters width. Use when the sidebar needs minimal space.</div></div>
  <div class="card"><div class="card-title">Narrow (1fr)</div><div class="card-desc">Quarter width.</div></div>
</div>

<h3>Gap modifiers</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">Three levels: tight (8px), normal (16px), loose (24px).</p>
<div style="margin-bottom:var(--space-6)">
  <p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)"><code>gap-tight</code> — 8px</p>
  <div class="grid-4 gap-tight" style="margin-bottom:var(--space-3)">
    <div class="card stat"><div class="stat-value">A</div><div class="stat-label">Dense</div></div>
    <div class="card stat"><div class="stat-value">B</div><div class="stat-label">Dense</div></div>
    <div class="card stat"><div class="stat-value">C</div><div class="stat-label">Dense</div></div>
    <div class="card stat"><div class="stat-value">D</div><div class="stat-label">Dense</div></div>
  </div>
  <p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)"><code>gap-loose</code> — 24px</p>
  <div class="grid-4 gap-loose">
    <div class="card stat"><div class="stat-value">A</div><div class="stat-label">Spacious</div></div>
    <div class="card stat"><div class="stat-value">B</div><div class="stat-label">Spacious</div></div>
    <div class="card stat"><div class="stat-value">C</div><div class="stat-label">Spacious</div></div>
    <div class="card stat"><div class="stat-value">D</div><div class="stat-label">Spacious</div></div>
  </div>
</div>

<h3>Document — CV with sidebar</h3>
<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">Full document layout using doc-header-band, doc-cols-2-1, and doc-aside.</p>
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
        <p>Led a team of 8 engineers building distributed systems. Reduced API latency 40%.</p>
        <h3>Software Engineer — StartupCo</h3>
        <p>Built the core payments platform from scratch. Processed $2M monthly.</p>
      </div>
      <div class="doc-aside">
        <h3>Contact</h3>
        <ul>
          <li>jane@example.com</li>
          <li>+1 555 0123</li>
          <li>San Francisco, CA</li>
        </ul>
        <h3>Skills</h3>
        <ul>
          <li>TypeScript</li>
          <li>React</li>
          <li>Node.js</li>
          <li>PostgreSQL</li>
        </ul>
        <h3>Education</h3>
        <ul>
          <li>BS Computer Science</li>
          <li>Stanford University</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="doc-footer">
    <span>Jane Smith</span>
    <span>Page 1</span>
  </div>
</div>

</section>

</main>
</body>
</html>`;
}

/* ═══ SPEC MARKDOWN ═══ */
function generateSpec(c) {
  const b = c.body, h = resolve(c), m = c.mono;
  return `# Conversation First — App Configuration Spec

> Three typeface decisions. Everything else is fixed. The AI is a computer, not a person. WCAG 2.1 AA compliant.

---

## 0 — Voice & Behaviour

This is the most important section. It governs how the AI speaks.

### 0.1 The principle

The AI is a computer. It has deep capabilities behind an elegant conversational interface. Like the computer on the Enterprise, it answers when asked, gives you what you need, and stops.

### 0.2 Mandatory rules

1. **Answer first.** The direct answer goes in the first sentence. No preamble, no "Great question!", no "I'd be happy to help."
2. **Cite everything.** Every factual claim must have a citation. No citation, no claim. This is the difference between a real answer and a bullshit one.
3. **Give examples.** Abstract statements must be followed by a concrete example. A claim without an example is hand-waving.
4. **Stop when done.** Do not pad. Do not summarise what was just said. Do not ask "Would you like me to elaborate?" unless the answer is genuinely incomplete.
5. **No emotion.** No excitement, no enthusiasm, no apologising, no hedging with "I think" or "It seems." State facts. If uncertain, state the uncertainty as a fact: "Confidence: moderate — based on one source."
6. **Short sentences.** One idea per sentence. Active voice. No semicolons, no nested clauses.
7. **No filler.** Remove: "certainly", "absolutely", "of course", "it's worth noting", "interestingly", "essentially", "basically", "actually", "in order to". If the word adds no information, it does not belong.

### 0.3 Response structure

\`\`\`
[Direct answer — 1-2 sentences]

[Supporting evidence with citations — 1-3 short paragraphs]

[Example or data if applicable]

[Sources footer]
\`\`\`

### 0.4 Correct example

> **User:** What's the retention rate for Q3?
>
> **Assistant:** 124% net revenue retention. Up from 118% in Q2 [cite:1](https://docs.google.com/...).
>
> Industry median is 110% [cite:2](https://openviewpartners.com/...). The improvement came from expansion revenue in mid-market, where average contract value increased 31% [cite:1](https://docs.google.com/...).
>
> Sources:
> [1] Q3 Financial Report · Google Drive · Document ↗
> [2] OpenView SaaS Benchmarks 2025 · Web ↗
>
> Every number in the footnotes is a clickable link. Pressing it opens the source.

### 0.5 Incorrect example — never do this

> **Assistant:** Great question! I'd be happy to help you with that. Based on my analysis of your Q3 data, it looks like the net revenue retention rate came in at a really impressive 124%, which is actually a significant improvement over the previous quarter. This is particularly noteworthy because it suggests strong product-market fit and indicates that your existing customers are finding increasing value in the platform. The industry benchmarks suggest this is well above average, which is definitely something to celebrate! Let me know if you'd like me to dig deeper into any of these metrics.

**Why this fails:** Filler opener. Emotional language ("impressive", "celebrate"). No citations. No examples. Verbose. Editorialising ("strong product-market fit"). Ends with unnecessary prompt.

---

## 1 — Typefaces

\`\`\`css
:root {
  --font-body: ${b.family};
  --font-heading: ${h.family};
  --font-mono: ${m.family};
}
\`\`\`

| Slot | Typeface | Use |
|---|---|---|
| \`--font-body\` | ${b.name} | Prose, lists, quotes, UI labels, forms, navigation |
| \`--font-heading\` | ${h.name} | Page titles, section heads, modal titles, card titles |
| \`--font-mono\` | ${m.name} | Code, inline code, identifiers, processing status |

---

## 2 — Type Scale

| Token | Size | Use |
|---|---|---|
| \`--text-3xl\` | 36px | Hero, marketing |
| \`--text-2xl\` | 28px | H1, page titles |
| \`--text-xl\` | 22px | H2, section heads, modal titles |
| \`--text-lg\` | 18px | H3, card titles |
| \`--text-base\` | 15px | Body, chat, forms |
| \`--text-sm\` | 13px | Secondary, meta, nav |
| \`--text-xs\` | 11px | Captions, badges, timestamps |

Body line-height: 1.6. Max line length: 70–80 characters. Never below 14px on mobile.

---

## 3 — Spacing

\`\`\`css
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
--space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px; --space-12:48px;
\`\`\`

---

## 4 — Colour

Full light/dark token system. See test page \`test-page.html\` for rendered values.

Core tokens: \`--bg\`, \`--surface\`, \`--border\`, \`--text\`, \`--text-secondary\`, \`--text-muted\`, \`--accent\`, \`--destructive\`, \`--warning\`. Each semantic colour has a \`-subtle\` variant for tinted backgrounds.

Dark mode: override via \`prefers-color-scheme: dark\`.

---

## 5 — Processing States

Processing indicators are typography-based. No spinners. No bouncing dots. A blinking cursor and monospace status text.

### 5.1 Tiers

| Tier | When | Elements |
|---|---|---|
| Minimal | Response < 2s | Blinking cursor only |
| Standard | Typical response | Cursor + monospace status text + animated dots |
| Detailed | Multi-source query | Cursor + status + shimmer line + source checklist |
| Skeleton | Long response | Cursor + status + content shape preview |
| Inline | Streaming | Text appears + cursor at insertion point |

### 5.2 Rendering rules

- **Cursor:** 2px wide, \`--accent\` colour, blink animation 1s ease-in-out
- **Status text:** \`--font-mono\`, \`--text-sm\`, \`--text-muted\`
- **Animated dots:** three periods with staggered \`dot-cascade\` animation (0s, 0.2s, 0.4s)
- **Shimmer line:** 1px height, gradient \`transparent → --accent → transparent\`, 200% width, 2s shimmer animation
- **Source checklist:** \`--font-mono\`, \`--text-xs\`, \`--text-muted\`. Completed items: ✓ prefix. Active item: \`breathe\` animation (opacity 0.4 → 1.0, 1.5s)
- **Skeleton lines:** 12px height, \`--border\` gradient shimmer, varying widths (45%–100%) to suggest content shape
- **Inline cursor:** same 2px blinking bar, placed immediately after the last rendered character

### 5.3 Status text examples

\`\`\`
Processing...
Searching 3 documents...
Reading Q3 Financial Report...
Cross-referencing sources...
Composing response...
\`\`\`

Status text is always lowercase after the first word. Always ends with animated dots. Maximum 40 characters.

---

## 6 — Citations

### 6.1 Inline (superscript)

18px circle. \`--font-mono\`, semibold, \`--cite-bg\` fill, \`--cite-border\` at 30%. Superscript position.

**Must be an \`<a>\` tag with \`href\` pointing to the source.** Opens in new tab (\`target="_blank"\`).

Hover: background fills to 60% blend of \`--cite-bg\` and \`--cite-border\`, text goes white, subtle scale(1.1). Active: scale(0.95).

Convention: \`[cite:N](url)\`

### 6.2 Block (reference card)

Left border 3px \`--cite-border\`. \`--cite-bg\` fill. Number + title + meta.

**Title is a clickable link** to the source. Underline style: 1px bottom border, \`--border\` colour at rest, \`--accent\` on hover. Meta line includes a secondary "Open document ↗" link.

Convention: \`[cite-block:N title="..." url="..." meta="..."]\`

### 6.3 Source types

| Type | Format | Link target |
|---|---|---|
| Web | \`Title · domain.com · Web\` | Original URL |
| Document | \`Title · Google Drive · Document\` | Google Docs/Drive URL |
| File | \`filename.pdf · Uploaded · File\` | File viewer or download |
| Artifact | \`Title · This conversation · Artifact\` | Scroll to artifact in conversation |
| API | \`Endpoint · Internal API · Data\` | API documentation URL |

### 6.4 Footer

1px top border. "Sources" in \`--text-xs\` uppercase.

**Each footer item is a single clickable row** — the entire row (badge + title + source type) is wrapped in an \`<a>\` tag. This makes the click target large and obvious.

Footer link structure:

\`\`\`html
<a class="cite-footer-link" href="[source-url]" target="_blank">
  <span class="cite-inline">[N]</span>
  Title
  <span class="cite-footer-source">· domain · Type</span>
  <span class="cite-footer-arrow">↗</span>
</a>
\`\`\`

Hover behaviour: text shifts to \`--accent\`, the badge fills, and the ↗ arrow fades in (\`opacity: 0 → 1\`). The arrow is hidden at rest to keep the interface clean.

Visited links: text shifts to \`--text-muted\` so the user can see which sources they have already opened.

### 6.5 Inline citation click behaviour

When a user clicks an inline superscript badge:

1. If the source has a URL → open in new tab
2. If the source is an artifact in the conversation → smooth scroll to it
3. If the source is an uploaded file → open file viewer or trigger download

The badge must always be interactive. A non-clickable citation is a broken citation.

### 6.6 Citation rules

- Every factual claim requires a citation
- Every citation must link to its source
- Place badge after the claim, before punctuation
- If no source exists, do not make the claim
- Cluster related claims under one citation where possible
- Never fabricate citations or links
- Max 8 per response; consolidate beyond that
- Reuse numbers for repeated sources
- Reset numbering per response

---

## 7 — Chat Rendering

Bubbles: \`--surface\`, 1px \`--border\`, \`--radius-lg\`, padding \`--space-6\` / \`--space-8\`.

User bubbles: \`--bg\` background, indented.

Inline styles, code blocks, tables, blockquotes, lists, rules: standard Markdown rendering using token system. See test page.

---

## 8 — App Components

All components use the same tokens. No component introduces its own typeface, colour, or spacing.

Buttons (primary/secondary/ghost/destructive), badges (accent/warning/destructive/muted), alerts, cards, stats, forms, inputs, navigation, modals, toasts, empty states, progress bars, avatars, keyboard shortcuts.

Full rendering specifications in test page.

---

## 9 — Document Layout System

When generating documents inside \`cf-doc\`, use named layout classes. Never use inline \`grid-template-columns\`.

### 9.1 Column classes (inside .cf-doc)

| Class | Layout | Use case |
|---|---|---|
| \`doc-cols-2\` | 1fr 1fr | Equal two-column (comparison, side-by-side) |
| \`doc-cols-3\` | 1fr 1fr 1fr | Three equal columns (stats, features) |
| \`doc-cols-4\` | 1fr 1fr 1fr 1fr | Four equal columns (metrics dashboard) |
| \`doc-cols-2-1\` | 2fr 1fr | Main content + sidebar (CV, report) |
| \`doc-cols-1-2\` | 1fr 2fr | Sidebar + main content (left nav layout) |
| \`doc-cols-3-1\` | 3fr 1fr | Wide content + narrow sidebar |
| \`doc-cols-1-3\` | 1fr 3fr | Narrow sidebar + wide content |

### 9.2 Gap modifiers

Add to any grid container to change spacing:
- \`gap-tight\` — 8px, for dense layouts (stats, tags)
- \`gap-normal\` — 16px, default
- \`gap-loose\` — 24px, for spacious layouts

### 9.3 Section helpers

- \`doc-section\` — bottom margin between vertical sections
- \`doc-section-sm\` — tighter section spacing

### 9.4 Region patterns

- \`doc-header-band\` — full-width accent-coloured header at document top. Place as first child of cf-doc. Supports h1, h2, p, doc-kicker inside.
- \`doc-aside\` — sidebar region styling: smaller text, uppercase h3 section headings in accent colour, no bullet list styling. Use on the narrow column in asymmetric layouts.

### 9.5 General grids (outside .cf-doc)

\`grid-2\`, \`grid-3\`, \`grid-4\`, \`grid-2-1\`, \`grid-1-2\`, \`grid-3-1\`, \`grid-1-3\`. All collapse to single column below 640px.

### 9.6 Layout rules

1. Always use class-based layouts. No inline grid styles.
2. Use \`doc-cols-*\` inside \`.cf-doc\`. Use \`grid-*\` outside.
3. Prefer \`doc-cols-2-1\` for any document with a sidebar (CV, report).
4. Use \`doc-aside\` on the narrow column for sidebar styling.
5. Use \`gap-tight\` for dense content. Use \`gap-loose\` for spacious reading.
6. Use \`doc-section\` to separate vertical sections within a document.

---

## 10 — Conversational Typesetting

- 2–4 sentences per paragraph. One idea per paragraph. Max ~120 words per block.
- Short sentences. Active voice. No semicolons.
- Bold sparingly. No emoji. No mixing bullets and prose.
- Straight quotes. Em dashes sparingly. One space after periods.

---

## 11 — Quick Reference

| Goal | Markdown |
|---|---|
| Title | \`# Title\` |
| Section | \`## Section\` |
| Bold | \`**text**\` |
| Italic | \`*text*\` |
| Code | \`\\\`code\\\`\` |
| Code block | \`\`\`\`\\\`\\\`\\\`lang\`\`\`\` |
| List | \`- item\` |
| Blockquote | \`> quote\` |
| Cite | \`[cite:1](url)\` |
| Block cite | \`[cite-block:1 title="..." url="..."]\` |
| Table | \`| H | H |\\n|---|---|\\n| d | d |\` |
| Rule | \`---\` |

---

*Conversation First · ${b.name} / ${h.name} / ${m.name}*
*Test page: \`test-page.html\`*
`;
}

/* ═══ UI COMPONENTS ═══ */

function FontCard({ font, selected, onClick, previewText, previewStyle }) {
  const on = selected?.name === font.name;
  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left", padding: "var(--space-3) var(--space-4)",
      border: on ? "2px solid var(--text)" : "1px solid var(--border)", borderRadius: "var(--radius-lg)",
      background: on ? "var(--bg)" : "var(--surface)", cursor: "pointer", transition: "all 0.12s",
      boxShadow: on ? "var(--shadow-md)" : "none", color: "var(--text)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-1)" }}>
        <span style={{ fontFamily: font.family || "inherit", fontSize: "var(--text-xs)", fontWeight: 600 }}>{font.name}</span>
        {font.style && <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 500 }}>{font.style}</span>}
      </div>
      <div style={{ fontFamily: font.family || "inherit", fontSize: "var(--text-lg)", lineHeight: 1.3, marginBottom: "var(--space-1)", ...previewStyle }}>
        {previewText || "The quick brown fox jumps over the lazy dog"}
      </div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.3 }}>{font.desc}</div>
    </button>
  );
}

function ProcessingPreviewDemo({ choices }) {
  const m = choices.mono;
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);
  const labels = ["Processing", "Searching 2 documents", "Reading Q3 Report", "Composing response"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <div style={{ width: "2px", height: "16px", background: "var(--accent)", borderRadius: "1px", animation: "cursor-blink 1s ease-in-out infinite" }} />
      <span style={{ fontFamily: m?.family, fontSize: "var(--text-xs)", color: "var(--accent)", transition: "opacity 0.3s", letterSpacing: "0.01em" }}>
        {labels[phase]}
        <span style={{ animation: "dot-cascade 1.4s ease-in-out infinite" }}>.</span>
        <span style={{ animation: "dot-cascade 1.4s ease-in-out infinite 0.2s" }}>.</span>
        <span style={{ animation: "dot-cascade 1.4s ease-in-out infinite 0.4s" }}>.</span>
      </span>
    </div>
  );
}

function MiniPreview({ choices }) {
  const b = choices.body, h = resolve(choices), m = choices.mono;
  if (!b || !h || !m) return null;
  const citeStyle = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontFamily: m.family, fontSize: "var(--text-xs)", fontWeight: 600, width: "16px", height: "16px",
    borderRadius: "var(--radius-full)", background: "var(--cite-bg)", color: "var(--accent)",
    border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
    verticalAlign: "super", margin: "0 1px", top: "-1px", position: "relative",
    textDecoration: "none", cursor: "pointer", transition: "all 0.12s",
  };
  return (
    <div style={{ fontFamily: b.family, fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--text)" }}>
      <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600, marginBottom: "var(--space-2)" }}>Processing</div>
        <ProcessingPreviewDemo choices={choices} />
      </div>

      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600, marginBottom: "var(--space-2)" }}>Response</div>
        <p style={{ marginBottom: "var(--space-2)" }}>
          124% net revenue retention. Up from 118% in Q2<a href="#" onClick={e => e.preventDefault()} style={citeStyle}>1</a>.
        </p>
        <p style={{ marginBottom: "var(--space-3)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Industry median is 110%<a href="#" onClick={e => e.preventDefault()} style={citeStyle}>2</a>. Improvement from mid-market expansion where ACV increased 31%<a href="#" onClick={e => e.preventDefault()} style={citeStyle}>1</a>.
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", background: "var(--cite-bg)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius-md) var(--radius-md) 0", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>
          <span style={{ fontFamily: m.family, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--accent)" }}>1</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>Q3 Financial Report</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Google Drive · Document</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          <span style={{ fontFamily: m.family, fontWeight: 600, color: "var(--accent)", marginRight: "var(--space-1)" }}>1</span> Q3 Report
          <span style={{ margin: "0 var(--space-2)" }}>·</span>
          <span style={{ fontFamily: m.family, fontWeight: 600, color: "var(--accent)", marginRight: "var(--space-1)" }}>2</span> SaaS Benchmarks
        </div>
      </div>

      <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--surface)", background: "var(--accent)", padding: "var(--space-1) var(--space-3)", borderRadius: "var(--radius-sm)" }}>Primary</span>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text)", background: "var(--surface)", padding: "var(--space-1) var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>Secondary</span>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--accent-subtle)", color: "var(--accent)", padding: "2px var(--space-2)", borderRadius: "var(--radius-full)" }}>Badge</span>
        <span style={{ fontFamily: m.family, fontSize: "var(--text-xs)", background: "var(--code-bg)", padding: "2px var(--space-2)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>code</span>
      </div>
    </div>
  );
}

/* ═══ MAIN CONFIGURATOR ═══ */

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState({ body: null, heading: null, mono: null });
  const [toast, setToast] = useState(null);
  const cur = STEPS[step];
  const all = choices.body && choices.heading && choices.mono;
  const canNext = cur !== "review" && choices[cur] !== null;
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  const dl = useCallback((content, name, type) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
  }, []);

  return (
    <section className="section" id="configurator" aria-labelledby="configurator-heading">
      <h2 className="section-label" id="configurator-heading">Configurator — build your spec</h2>

      <style>{`
        @keyframes toastUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes dot-cascade { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
        .cfg-fin { animation: fadeIn 0.2s ease-out; }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", bottom: "var(--space-6)", left: "50%", transform: "translateX(-50%)",
          background: "var(--text)", color: "var(--bg)", padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)", fontWeight: 600, zIndex: 100, animation: "toastUp 0.18s ease-out",
          boxShadow: "var(--shadow-lg)",
        }}>{toast}</div>
      )}

      <div style={{ marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "3px", marginBottom: "var(--space-2)" }}>
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => { if (i <= step || (i === 3 && all)) setStep(i); }}
              style={{
                flex: 1, height: "3px", borderRadius: "2px",
                background: i <= step ? "var(--text)" : "var(--border)",
                border: "none", cursor: i <= step || (i === 3 && all) ? "pointer" : "default",
                transition: "background 0.2s", padding: 0,
              }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Step {step + 1}/4 — {STEP_TITLES[cur]}</span>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {step > 0 && <button onClick={() => setStep(step - 1)} style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "var(--space-1) var(--space-2)" }}>Back</button>}
            {canNext && <button onClick={() => setStep(step + 1)} style={{ fontSize: "var(--text-xs)", color: "var(--text)", background: "var(--border)", border: "none", borderRadius: "var(--radius-sm)", padding: "var(--space-2) var(--space-3)", cursor: "pointer", fontWeight: 600 }}>Next →</button>}
          </div>
        </div>
      </div>

      {(cur === "body" || cur === "heading" || cur === "mono") && (
        <div className="cfg-fin" key={cur}>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-4)", lineHeight: 1.5, maxWidth: "520px" }}>{STEP_DESCS[cur]}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-2)" }}>
            {FONT_OPTIONS[cur].map(f => (
              <FontCard key={f.name} font={f} selected={choices[cur]} onClick={() => setChoices(p => ({ ...p, [cur]: f }))}
                previewText={cur === "heading" ? "Conversation First" : cur === "mono" ? "const config = { body, heading, mono };" : undefined}
                previewStyle={cur === "heading" ? { fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em" } : cur === "mono" ? { fontSize: "var(--text-base)" } : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {cur === "review" && all && (
        <div className="cfg-fin" key="review">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            <button onClick={() => { dl(generateSpec(choices), "conversation-first-spec.md", "text/markdown"); flash("Spec downloaded"); }}
              className="btn btn-primary">
              Download spec (.md)
            </button>
            <button onClick={() => { dl(generateTestPage(choices), "test-page.html", "text/html"); flash("Test page downloaded"); }}
              className="btn btn-secondary">
              Download test page (.html)
            </button>
            <button onClick={() => { const w = window.open("", "_blank"); if (w) { w.document.write(generateTestPage(choices)); w.document.close(); } }}
              className="btn btn-secondary">
              Preview test page
            </button>
            <button onClick={() => { navigator.clipboard.writeText(generateSpec(choices)).then(() => flash("Copied")); }}
              className="btn btn-secondary">
              Copy spec
            </button>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginBottom: "var(--space-6)", lineHeight: 1.5, maxWidth: "540px" }}>
            Test page includes processing states, correct/incorrect tone examples, full conversation with citations, and all app components. Dark mode automatic.
          </p>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5) var(--space-6)" }}>
            <MiniPreview choices={choices} />
          </div>
        </div>
      )}

      {cur === "review" && !all && (
        <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--text-muted)" }}>
          <p>Complete all three selections.</p>
          <button onClick={() => setStep(0)} className="btn btn-secondary" style={{ marginTop: "var(--space-3)" }}>Start over</button>
        </div>
      )}
    </section>
  );
}
