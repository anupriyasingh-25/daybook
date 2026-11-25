import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const result = await register(form);
      setSuccess(result.message);
      window.setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout heading="Create your account" subtitle="Start building a more thoughtful day." footer="Already have an account?" footerLink="/login" footerAction="Log in">
      <form className="auth-form register-form" onSubmit={submit}>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">{success}</div>}
        <label htmlFor="register-name">Full name</label>
        <div className="input-with-icon"><UserRound size={18} /><input id="register-name" type="text" autoComplete="name" maxLength="80" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jamie Parker" /></div>
        <label htmlFor="register-email">Email address</label>
        <div className="input-with-icon"><Mail size={18} /><input id="register-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></div>
        <label htmlFor="register-password">Password</label>
        <div className="input-with-icon"><LockKeyhole size={18} /><input id="register-password" type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></div>
        <label htmlFor="register-confirm">Confirm password</label>
        <div className="input-with-icon"><LockKeyhole size={18} /><input id="register-confirm" type="password" autoComplete="new-password" minLength="8" required value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Enter your password again" /></div>
        <button className="button button-primary auth-submit" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'} {!loading && <ArrowRight size={17} />}</button>
      </form>
    </AuthLayout>
  );
}
