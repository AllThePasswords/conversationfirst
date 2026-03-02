import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export default function ThemePresetBar() {
  const { activeThemeId, savedThemes, applyTheme, deleteTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeTheme = activeThemeId
    ? savedThemes.find(t => t.id === activeThemeId)
    : null;

  // Close on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  if (savedThemes.length === 0) return null;

  return (
    <div className="theme-bar" ref={wrapperRef}>
      {/* Pill trigger */}
      <button
        className={`theme-bar-pill ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span className="theme-bar-pill-label">
          {activeTheme ? activeTheme.name : 'Default'}
        </span>
        <ChevronDownIcon
          width={14}
          height={14}
          className={`theme-bar-chevron ${menuOpen ? 'open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="theme-bar-menu" role="listbox">
          <div
            className={`theme-bar-menu-item ${!activeThemeId ? 'selected' : ''}`}
            role="option"
            aria-selected={!activeThemeId}
            onClick={() => { applyTheme(null); setMenuOpen(false); }}
          >
            <span className="theme-bar-menu-item-label">Default</span>
          </div>

          {savedThemes.map(t => (
            <div
              key={t.id}
              className={`theme-bar-menu-item ${activeThemeId === t.id ? 'selected' : ''}`}
              role="option"
              aria-selected={activeThemeId === t.id}
              onClick={() => { applyTheme(t); setMenuOpen(false); }}
            >
              <span className="theme-bar-menu-item-label">{t.name}</span>
              <button
                className="theme-bar-menu-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTheme(t.id);
                }}
                title={`Delete "${t.name}"`}
                aria-label={`Delete theme "${t.name}"`}
                type="button"
              >
                <TrashIcon width={14} height={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
