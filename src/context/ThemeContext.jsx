import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import THEME_PRESETS from '../themePresets';

const ThemeContext = createContext(null);

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
];

function applyPreset(preset, isDark) {
  const el = document.documentElement;

  if (!preset || preset.id === 'default') {
    ALL_VARS.forEach(v => el.style.removeProperty(v));
    return;
  }

  const palette = isDark ? preset.dark : preset.light;
  if (palette) {
    Object.entries(palette).forEach(([k, v]) => el.style.setProperty(k, v));
  }

  if (preset.fonts) {
    el.style.setProperty('--font-body', preset.fonts.body);
    el.style.setProperty('--font-heading', preset.fonts.heading);
    el.style.setProperty('--font-mono', preset.fonts.mono);
  }
}

export function ThemeProvider({ children }) {
  const [activePresetId, setActivePresetId] = useState('default');

  useEffect(() => {
    const preset = THEME_PRESETS.find(p => p.id === activePresetId) || THEME_PRESETS[0];
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    applyPreset(preset, darkQuery.matches);

    const onChange = (e) => applyPreset(preset, e.matches);
    darkQuery.addEventListener('change', onChange);

    return () => {
      darkQuery.removeEventListener('change', onChange);
    };
  }, [activePresetId]);

  const resetTheme = useCallback(() => {
    setActivePresetId('default');
  }, []);

  return (
    <ThemeContext.Provider value={{ activePresetId, setActivePresetId, resetTheme, presets: THEME_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
