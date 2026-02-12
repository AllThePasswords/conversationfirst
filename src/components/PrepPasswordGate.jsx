import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'interview_prep_auth';
const CORRECT_PASSWORD = 'interview26';

export default function PrepPasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setAuthenticated(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !authenticated) {
      inputRef.current?.focus();
    }
  }, [loading, authenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="prep-gate">
        <div className="prep-gate-form prep-fade-in">
          <div className="prep-gate-title">Interview Prep</div>
          <div className="prep-gate-subtitle">This page is password protected.</div>
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(false); }}
              className="input"
              placeholder="Enter password"
              autoComplete="off"
              style={{ marginBottom: 'var(--space-3)' }}
            />
            {error && <div className="prep-gate-error">Incorrect password.</div>}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-3)', justifyContent: 'center' }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return children;
}
