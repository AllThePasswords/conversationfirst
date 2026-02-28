import { useTheme } from '../context/ThemeContext';

export default function ThemePresetBar() {
  const { activePresetId, setActivePresetId, presets } = useTheme();
  const active = presets.find(p => p.id === activePresetId);

  return (
    <div className="theme-bar">
      <label className="theme-bar-label" htmlFor="theme-select">Theme</label>
      <select
        id="theme-select"
        className="theme-bar-select"
        value={activePresetId}
        onChange={(e) => setActivePresetId(e.target.value)}
      >
        {presets.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {active && active.id !== 'default' && (
        <span className="theme-bar-desc">{active.description}</span>
      )}
    </div>
  );
}
