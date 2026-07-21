import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from '../components/shared/Icons';

export function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const auth = useAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === 'sign-up';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (isSignUp && password !== confirm) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    setBusy(true);

    const error = isSignUp
      ? await auth.signUp(email, password, fullName, role)
      : await auth.signIn(email, password);

    if (!error && isSignUp) {
      fetch('/.netlify/functions/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: fullName }),
      }).catch(() => undefined);
    }

    setBusy(false);

    if (error) {
      setMessage(error);
    } else if (!isSignUp) {
      navigate('/app');
    } else {
      setMessage('Check your inbox to confirm your email, then sign in.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={15} />
          </span>
          Trackly
        </Link>

        <div className="auth-copy">
          <span className="eyebrow">PLAN · TRACK · ACHIEVE</span>

          <h1>
            {isSignUp
              ? 'A clearer semester starts here.'
              : 'Welcome back.'}
          </h1>

          <p>
            {isSignUp
              ? 'Create a personal space for your classes, work, and small daily wins.'
              : 'Sign in and pick up exactly where you left off.'}
          </p>
        </div>

        <button
          className="btn btn-google"
          type="button"
          disabled={!auth.configured || busy}
          onClick={() =>
            auth.signInWithGoogle().catch((error) => setMessage(error.message))
          }
        >
          <span className="google-dot">G</span>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span />
          or continue with email
          <span />
        </div>

        <form onSubmit={submit} className="auth-form">
          {isSignUp && (
            <>
              <label htmlFor="full-name">
                Full name

                <input
                  id="full-name"
                  name="fullName"
                  autoComplete="name"
                  className="input"
                  placeholder="How should we call you?"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>

              <label htmlFor="role">
                Role

                <select
                  id="role"
                  name="role"
                  className="input"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option>Student</option>
                  <option>Self-learner</option>
                  <option>Teacher</option>
                  <option>Parent</option>
                </select>
              </label>
            </>
          )}

          <label htmlFor="email">
            Email address

            <input
              id="email"
              name="email"
              autoComplete="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label htmlFor={isSignUp ? 'new-password' : 'password'}>
            Password

            <input
              id={isSignUp ? 'new-password' : 'password'}
              name={isSignUp ? 'newPassword' : 'password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="input"
              type="password"
              placeholder="At least 6 characters"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {isSignUp && (
            <label htmlFor="confirm-password">
              Confirm password

              <input
                id="confirm-password"
                name="confirmPassword"
                autoComplete="new-password"
                className="input"
                type="password"
                placeholder="Repeat your password"
                minLength={6}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                required
              />
            </label>
          )}

          <button
            disabled={!auth.configured || busy}
            className="btn btn-primary auth-submit"
            type="submit"
          >
            {busy
              ? 'Just a moment…'
              : isSignUp
                ? 'Create my workspace'
                : 'Sign in to Trackly'}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        {!auth.configured && (
          <p className="muted tiny">
            Add Supabase environment variables to enable secure authentication.
          </p>
        )}

        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : 'New to Trackly?'}{' '}
          <Link href={isSignUp ? '/sign-in' : '/sign-up'}>
            {isSignUp ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </section>
    </main>
  );
}