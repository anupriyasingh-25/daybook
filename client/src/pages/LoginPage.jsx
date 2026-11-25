import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout heading="Welcome back" subtitle="Log in to pick up where you left off." footer="New to Daybook?" footerLink="/register" footerAction="Create an account">
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label htmlFor="login-email">Email address</label>
        <div className="input-with-icon"><Mail size={18} /><input id="login-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></div>
        <label htmlFor="login-password">Password</label>
        <div className="input-with-icon"><LockKeyhole size={18} /><input id="login-password" type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /></div>
        <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'} {!loading && <ArrowRight size={17} />}</button>
      </form>
      <p className="auth-small">Your account is protected with secure, HttpOnly cookie authentication.</p>
    </AuthLayout>
  );
}
