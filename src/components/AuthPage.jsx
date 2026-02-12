import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const data = await signUp(email, password);
        if (data.user && !data.session) {
          setSignUpSuccess(true);
        } else {
          window.location.hash = '#/chat';
        }
      } else {
        await signIn(email, password);
        window.location.hash = '#/chat';
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, isSignUp, signIn, signUp]);

  const toggleMode = useCallback(() => {
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSignUpSuccess(false);
  }, []);

  if (signUpSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Check your email</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
            A confirmation link has been sent to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-6)' }}
            onClick={() => { setSignUpSuccess(false); setMode('signin'); }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isSignUp ? 'Create account' : 'Sign in'}</h2>

        {error && (
          <div className="alert alert-destructive" role="alert" style={{ marginTop: 'var(--space-4)' }}>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 'var(--space-6)' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
            <label className="input-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {isSignUp && (
            <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="input-label" htmlFor="auth-confirm">Confirm password</label>
              <input
                id="auth-confirm"
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-6)' }}
          >
            {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create account' : 'Sign in')}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="auth-toggle"
            onClick={toggleMode}
            type="button"
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  );
}
