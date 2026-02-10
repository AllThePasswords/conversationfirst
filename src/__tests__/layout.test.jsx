import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Read CSS files as strings for assertion
const chatCss = fs.readFileSync(path.resolve('src/chat.css'), 'utf-8');
const appCss = fs.readFileSync(path.resolve('src/App.css'), 'utf-8');

// ── Commit: Add document layout system: named column classes, gap modifiers, region patterns ──
describe('Document layout system (CSS)', () => {
  describe('named column classes', () => {
    it('defines .doc-cols-2 as 1fr 1fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-2');
      expect(appCss).toMatch(/\.doc-cols-2\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr/);
    });

    it('defines .doc-cols-3 as 1fr 1fr 1fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-3');
      expect(appCss).toMatch(/\.doc-cols-3\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr\s+1fr/);
    });

    it('defines .doc-cols-4 as 4-column grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-4');
      expect(appCss).toMatch(/\.doc-cols-4\s*\{[^}]*grid-template-columns:\s*1fr\s+1fr\s+1fr\s+1fr/);
    });

    it('defines .doc-cols-2-1 as 2fr 1fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-2-1');
      expect(appCss).toMatch(/\.doc-cols-2-1\s*\{[^}]*grid-template-columns:\s*2fr\s+1fr/);
    });

    it('defines .doc-cols-1-2 as 1fr 2fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-1-2');
      expect(appCss).toMatch(/\.doc-cols-1-2\s*\{[^}]*grid-template-columns:\s*1fr\s+2fr/);
    });

    it('defines .doc-cols-3-1 as 3fr 1fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-3-1');
      expect(appCss).toMatch(/\.doc-cols-3-1\s*\{[^}]*grid-template-columns:\s*3fr\s+1fr/);
    });

    it('defines .doc-cols-1-3 as 1fr 3fr grid', () => {
      expect(appCss).toContain('.cf-doc .doc-cols-1-3');
      expect(appCss).toMatch(/\.doc-cols-1-3\s*\{[^}]*grid-template-columns:\s*1fr\s+3fr/);
    });
  });

  describe('gap modifiers (App.css)', () => {
    it('defines .gap-tight with space-2', () => {
      expect(appCss).toMatch(/\.gap-tight\s*\{[^}]*gap:\s*var\(--space-2\)/);
    });

    it('defines .gap-normal with space-4', () => {
      expect(appCss).toMatch(/\.gap-normal\s*\{[^}]*gap:\s*var\(--space-4\)/);
    });

    it('defines .gap-loose with space-6', () => {
      expect(appCss).toMatch(/\.gap-loose\s*\{[^}]*gap:\s*var\(--space-6\)/);
    });
  });

  describe('section helpers', () => {
    it('defines .doc-section with margin-bottom', () => {
      expect(appCss).toMatch(/\.doc-section\s*\{[^}]*margin-bottom/);
    });

    it('resets last-child .doc-section margin', () => {
      expect(appCss).toMatch(/\.doc-section:last-child\s*\{[^}]*margin-bottom:\s*0/);
    });

    it('defines .doc-section-sm with smaller margin', () => {
      expect(appCss).toContain('.doc-section-sm');
    });
  });

  describe('document header band', () => {
    it('defines .doc-header-band with accent background', () => {
      expect(appCss).toMatch(/\.doc-header-band\s*\{[^}]*background:\s*var\(--accent\)/);
    });

    it('sets white text for header band headings', () => {
      expect(appCss).toMatch(/\.doc-header-band[\s\S]*?color:\s*#fff/);
    });
  });

  describe('grid classes in App.css', () => {
    it('defines grid-2 through grid-4', () => {
      expect(appCss).toContain('.grid-2');
      expect(appCss).toContain('.grid-3');
      expect(appCss).toContain('.grid-4');
    });

    it('defines asymmetric grids', () => {
      expect(appCss).toContain('.grid-2-1');
      expect(appCss).toContain('.grid-1-2');
      expect(appCss).toContain('.grid-3-1');
      expect(appCss).toContain('.grid-1-3');
    });

    it('collapses grids to single column on mobile', () => {
      expect(appCss).toMatch(/@media\s*\(\s*max-width:\s*640px\s*\)\s*\{[^}]*grid-template-columns:\s*1fr/);
    });
  });
});

// ── Commit: Remove gradient pseudo-element from chat input bar ──
describe('Chat input bar CSS', () => {
  // Extract the .chat-input-bar rule block for targeted assertions
  const inputBarBlock = chatCss.substring(
    chatCss.indexOf('.chat-input-bar'),
    chatCss.indexOf('.chat-input-inner')
  );

  it('no ::before or ::after pseudo-element on .chat-input-bar', () => {
    expect(inputBarBlock).not.toMatch(/::before|::after/);
  });

  it('no linear-gradient anywhere in the input bar section', () => {
    expect(inputBarBlock).not.toMatch(/linear-gradient/);
  });

  it('.chat-input-bar does not set position: relative (no longer needs stacking context)', () => {
    const barRule = chatCss.match(/\.chat-input-bar\s*\{[^}]*\}/);
    expect(barRule[0]).not.toMatch(/position\s*:\s*relative/);
  });

  it('.chat-input-bar uses var(--bg) background (solid, no gradient)', () => {
    const barRule = chatCss.match(/\.chat-input-bar\s*\{[^}]*\}/);
    expect(barRule[0]).toMatch(/background\s*:\s*var\(--bg\)/);
    expect(barRule[0]).not.toMatch(/linear-gradient/);
  });

  it('.chat-input-inner does not set z-index (no longer needs to stack above gradient)', () => {
    const innerRule = chatCss.match(/\.chat-input-inner\s*\{[^}]*\}/);
    expect(innerRule[0]).not.toMatch(/z-index/);
  });

  it('.chat-input-inner does not set position: relative (no longer needs stacking context)', () => {
    const innerRule = chatCss.match(/\.chat-input-inner\s*\{[^}]*\}/);
    expect(innerRule[0]).not.toMatch(/position\s*:\s*relative/);
  });

  it('chat-input-bar uses flex-shrink: 0', () => {
    expect(chatCss).toMatch(/\.chat-input-bar\s*\{[^}]*flex-shrink:\s*0/);
  });
});

// ── Commit: Fix chat input: z-index over gradient overlay, floating input aligns with sidebar ──
describe('Floating input CSS', () => {
  it('chat-input-floating is position fixed at bottom', () => {
    expect(chatCss).toMatch(/\.chat-input-floating\s*\{[^}]*position:\s*fixed/);
    expect(chatCss).toMatch(/\.chat-input-floating\s*\{[^}]*bottom:\s*0/);
  });

  it('floating input has z-index for stacking over content', () => {
    expect(chatCss).toMatch(/\.chat-input-floating\s*\{[^}]*z-index:\s*40/);
  });

  it('floating input has gradient fade background for smooth scroll overlap', () => {
    // Match the main .chat-input-floating rule (not .sidebar-open variant)
    const floatingRule = chatCss.match(/^\.chat-input-floating\s*\{[^}]*\}/m);
    expect(floatingRule).not.toBeNull();
    expect(floatingRule[0]).toMatch(/background:\s*linear-gradient/);
  });

  it('floating input shifts left when sidebar is open on desktop', () => {
    expect(chatCss).toMatch(/\.sidebar-open\s+\.chat-input-floating\s*\{[^}]*left:\s*280px/);
  });
});

// ── Commit: Fix home page sidebar: push layout + visible menu button ──
describe('Sidebar push layout CSS', () => {
  it('sidebar-open pushes content right with margin-left 280px on desktop', () => {
    // Check desktop media query
    expect(chatCss).toMatch(/\.chat-page\.sidebar-open[\s\S]*?margin-left:\s*280px/);
    expect(chatCss).toMatch(/\.home-page\.sidebar-open[\s\S]*?margin-left:\s*280px/);
  });

  it('hides sidebar overlay on desktop', () => {
    expect(chatCss).toMatch(/@media\s*\(\s*min-width:\s*641px\s*\)[\s\S]*?\.chat-sidebar-overlay\s*\{[^}]*display:\s*none/);
  });

  it('sidebar has fixed position and 280px width', () => {
    expect(chatCss).toMatch(/\.chat-sidebar\s*\{[^}]*position:\s*fixed/);
    expect(chatCss).toMatch(/\.chat-sidebar\s*\{[^}]*width:\s*280px/);
  });

  it('sidebar slides in with transform', () => {
    expect(chatCss).toMatch(/\.chat-sidebar\s*\{[^}]*transform:\s*translateX\(-100%\)/);
    expect(chatCss).toMatch(/\.chat-sidebar\.open\s*\{[^}]*transform:\s*translateX\(0\)/);
  });
});

// ── Commit: Fix chat header: menu left, hide border until scroll, no empty title ──
describe('Chat header CSS', () => {
  it('header border is transparent by default', () => {
    expect(chatCss).toMatch(/\.chat-header\s*\{[^}]*border-bottom:\s*1px\s+solid\s+transparent/);
  });

  it('header shows border when scrolled', () => {
    expect(chatCss).toMatch(/\.chat-header\.scrolled\s*\{[^}]*border-bottom-color:\s*var\(--border\)/);
  });

  it('header title uses truncation on mobile', () => {
    expect(chatCss).toMatch(/\.chat-header-title\s*\{[^}]*text-overflow:\s*ellipsis/);
  });
});

// ── Commit: Fix header title truncation and input bar background ──
describe('Responsive styles', () => {
  it('sidebar goes full width on mobile', () => {
    expect(chatCss).toMatch(/@media\s*\(\s*max-width:\s*640px\s*\)[\s\S]*?\.chat-sidebar\s*\{[^}]*width:\s*100%/);
  });

  it('user bubble max-width is 90% on mobile', () => {
    expect(chatCss).toMatch(/@media\s*\(\s*max-width:\s*640px\s*\)[\s\S]*?max-width:\s*90%/);
  });
});

// ── Commit: Replace speech bubble with hamburger menu icon on home page ──
describe('Menu button CSS', () => {
  it('defines .chat-menu-btn with 36x36 dimensions', () => {
    expect(chatCss).toMatch(/\.chat-menu-btn\s*\{[^}]*width:\s*36px/);
    expect(chatCss).toMatch(/\.chat-menu-btn\s*\{[^}]*height:\s*36px/);
  });

  it('menu button has hover state', () => {
    expect(chatCss).toContain('.chat-menu-btn:hover');
  });

  it('menu button has focus-visible outline', () => {
    expect(chatCss).toContain('.chat-menu-btn:focus-visible');
  });
});

// Home header positioning
describe('Home header CSS', () => {
  it('home-header has sticky positioning', () => {
    expect(chatCss).toMatch(/\.home-header\s*\{[^}]*position:\s*sticky/);
  });

  it('home-header has transparent background', () => {
    expect(chatCss).toMatch(/\.home-header\s*\{[^}]*background:\s*transparent/);
  });

  it('home-header has no border-bottom', () => {
    expect(chatCss).toMatch(/\.home-header\s*\{[^}]*border-bottom:\s*none/);
  });
});
