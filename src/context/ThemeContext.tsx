import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── Colour math (shared with Configurator) ── */

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
export function darken(hex: string, amt = 0.18) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
export function tint(hex: string, amt = 0.90) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
export function darkAccent(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(Math.min(255, r + 80), Math.min(255, g + 80), Math.min(255, b + 80));
}
export function darkBg(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(Math.round(r * 0.08), Math.round(g * 0.08), Math.round(b * 0.08));
}

/* ── Types ── */

export type ShapeMode = 'rounded' | 'pill' | 'square' | 'cut';
export type ContainerShapeMode = 'rounded' | 'square' | 'cut';

export interface SavedTheme {
  id: string;
  name: string;
  fonts: {
    body: { name: string; family: string };
    heading: { name: string; family: string | null };
    mono: { name: string; family: string };
  };
  accent: { name: string; hex: string };
  bg: { name: string; hex: string };
  shape: ShapeMode;
  containerShape?: ContainerShapeMode;
  createdAt: number;
}

interface ThemeContextValue {
  activeThemeId: string | null;
  savedThemes: SavedTheme[];
  applyTheme: (theme: SavedTheme | null) => void;
  saveTheme: (theme: SavedTheme) => void;
  deleteTheme: (id: string) => void;
}

const STORAGE_KEY_THEMES = 'cf-saved-themes';
const STORAGE_KEY_ACTIVE = 'cf-active-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ── CSS variables to clear when resetting ── */

const ALL_VARS = [
  '--font-body', '--font-heading', '--font-mono',
  '--bg', '--surface', '--surface-raised',
  '--border', '--border-strong',
  '--text', '--text-secondary', '--text-muted',
  '--accent', '--accent-hover', '--accent-subtle',
  '--destructive', '--destructive-subtle',
  '--warning', '--warning-subtle',
  '--code-bg', '--cite-bg', '--cite-border',
  '--shadow-sm', '--shadow-md', '--shadow-lg',
  '--radius-sm', '--radius-md', '--radius-lg', '--radius-input', '--radius-icon-btn',
];

/* ── Apply a theme to the document ── */

function applyThemeToDOM(theme: SavedTheme | null, isDark: boolean) {
  const el = document.documentElement;

  // Reset everything
  ALL_VARS.forEach(v => el.style.removeProperty(v));
  el.removeAttribute('data-shape');

  if (!theme) return;

  // Fonts
  if (theme.fonts.body?.family) el.style.setProperty('--font-body', theme.fonts.body.family);
  const headingFamily = theme.fonts.heading?.family || theme.fonts.body?.family;
  if (headingFamily) el.style.setProperty('--font-heading', headingFamily);
  if (theme.fonts.mono?.family) el.style.setProperty('--font-mono', theme.fonts.mono.family);

  // Colours
  const ac = theme.accent?.hex;
  const bg = theme.bg?.hex;
  if (ac) {
    if (isDark) {
      const dkAc = darkAccent(ac);
      el.style.setProperty('--accent', dkAc);
      el.style.setProperty('--accent-hover', darkAccent(darken(ac, 0.1)));
      el.style.setProperty('--accent-subtle', rgbToHex(...hexToRgb(dkAc).map(v => Math.round(v * 0.25)) as [number, number, number]));
      el.style.setProperty('--cite-bg', rgbToHex(...hexToRgb(dkAc).map(v => Math.round(v * 0.25)) as [number, number, number]));
      el.style.setProperty('--cite-border', dkAc);
    } else {
      el.style.setProperty('--accent', ac);
      el.style.setProperty('--accent-hover', darken(ac));
      el.style.setProperty('--accent-subtle', tint(ac));
      el.style.setProperty('--cite-bg', tint(ac, 0.92));
      el.style.setProperty('--cite-border', ac);
    }
  }
  if (bg) {
    if (isDark) {
      el.style.setProperty('--bg', darkBg(bg));
    } else {
      el.style.setProperty('--bg', bg);
    }
  }

  // Shape: buttons (--radius-btn-sm, --radius-btn-md) and containers (--radius-lg) can differ
  const btnShape = theme.shape;
  const ctrShape = theme.containerShape ?? theme.shape;
  // Buttons / small elements
  switch (btnShape) {
    case 'pill':
      el.style.setProperty('--radius-btn-sm', '9999px');
      el.style.setProperty('--radius-btn-md', '9999px');
      el.style.setProperty('--radius-input', '30px');
      el.style.setProperty('--radius-icon-btn', '50%');
      // Keep base tokens at defaults (clear any previous override)
      el.style.removeProperty('--radius-sm');
      el.style.removeProperty('--radius-md');
      break;
    case 'square':
      el.style.setProperty('--radius-sm', '0');
      el.style.setProperty('--radius-md', '0');
      el.style.setProperty('--radius-input', '0');
      el.style.setProperty('--radius-icon-btn', '0');
      // btn tokens inherit via var(--radius-sm/md) → 0
      el.style.removeProperty('--radius-btn-sm');
      el.style.removeProperty('--radius-btn-md');
      break;
    case 'cut':
      el.style.setProperty('--radius-sm', '0');
      el.style.setProperty('--radius-md', '0');
      el.style.setProperty('--radius-input', '0');
      el.style.setProperty('--radius-icon-btn', '0');
      el.style.removeProperty('--radius-btn-sm');
      el.style.removeProperty('--radius-btn-md');
      break;
    default:
      // rounded: moderate corners, not pill
      el.style.removeProperty('--radius-sm');
      el.style.removeProperty('--radius-md');
      el.style.removeProperty('--radius-btn-sm');
      el.style.removeProperty('--radius-btn-md');
      el.style.setProperty('--radius-input', '12px');
      el.style.setProperty('--radius-icon-btn', '50%');
      break;
  }
  // Containers
  switch (ctrShape) {
    case 'square':
    case 'cut':
      el.style.setProperty('--radius-lg', '0');
      break;
    case 'rounded':
      // default, no override needed unless btn was pill
      if (btnShape === 'pill') el.style.setProperty('--radius-lg', '12px');
      break;
  }
  // Cut corners need data attribute
  if (btnShape === 'cut' || ctrShape === 'cut') {
    el.setAttribute('data-shape', 'cut');
  } else {
    el.removeAttribute('data-shape');
  }
}

/* ── Provider ── */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_THEMES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const [activeThemeId, setActiveThemeId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || null;
  });

  // Persist themes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEMES, JSON.stringify(savedThemes));
  }, [savedThemes]);

  // Persist active theme ID
  useEffect(() => {
    if (activeThemeId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeThemeId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    }
  }, [activeThemeId]);

  // Apply active theme + respond to OS dark mode changes
  useEffect(() => {
    const theme = activeThemeId ? savedThemes.find(t => t.id === activeThemeId) || null : null;
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    applyThemeToDOM(theme, darkQuery.matches);

    const onChange = (e: MediaQueryListEvent) => applyThemeToDOM(theme, e.matches);
    darkQuery.addEventListener('change', onChange);
    return () => darkQuery.removeEventListener('change', onChange);
  }, [activeThemeId, savedThemes]);

  const applyTheme = useCallback((theme: SavedTheme | null) => {
    setActiveThemeId(theme?.id || null);
  }, []);

  const saveTheme = useCallback((theme: SavedTheme) => {
    setSavedThemes(prev => {
      const existing = prev.findIndex(t => t.id === theme.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = theme;
        return updated;
      }
      return [...prev, theme];
    });
  }, []);

  const deleteTheme = useCallback((id: string) => {
    setSavedThemes(prev => prev.filter(t => t.id !== id));
    setActiveThemeId(prev => prev === id ? null : prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeThemeId, savedThemes, applyTheme, saveTheme, deleteTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
