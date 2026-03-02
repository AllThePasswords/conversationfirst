import { useTheme } from '../context/ThemeContext';

export default function ThemePresetBar() {
  const { activeThemeId, savedThemes, applyTheme, deleteTheme } = useTheme();

  return (
    <div className="theme-bar">
      <select
        id="theme-select"
        className="theme-bar-select"
        value={activeThemeId || 'default'}
        onChange={(e) => {
          const id = e.target.value;
          if (id === 'default') {
            applyTheme(null);
          } else {
            const theme = savedThemes.find(t => t.id === id);
            if (theme) applyTheme(theme);
          }
        }}
      >
        <option value="default">Default</option>
        {savedThemes.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      {activeThemeId && savedThemes.length > 0 && (
        <button
          className="theme-bar-delete"
          onClick={() => {
            if (confirm('Delete this saved theme?')) {
              deleteTheme(activeThemeId);
            }
          }}
          title="Delete theme"
          aria-label="Delete theme"
        >
          &times;
        </button>
      )}
    </div>
  );
}
