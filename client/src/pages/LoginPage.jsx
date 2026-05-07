import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi, getErrorMessage } from '../api/authApi';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    try {
      setLoading(true);
      const data = await authApi.login(form);
      login(data.token, data.user);
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to log in'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <form onSubmit={submit} className="glass-card w-full p-6">
        <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-white/60">Log in to continue your job search.</p>
        {error && <div className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</div>}
        <label className="mt-6 block text-sm font-semibold text-white/80">Email</label>
        <input className="input-field mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="mt-4 block text-sm font-semibold text-white/80">Password</label>
        <div className="mt-2 flex gap-2">
          <input className="input-field" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="btn-secondary px-4 py-2">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="mt-5 text-center text-sm text-white/60">
          New to HireSense? <Link className="font-semibold text-blue-200" to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
