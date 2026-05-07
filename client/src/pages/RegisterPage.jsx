import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, getErrorMessage } from '../api/authApi';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    try {
      setLoading(true);
      const data = await authApi.register(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <form onSubmit={submit} className="glass-card w-full p-6">
        <h1 className="font-heading text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-white/60">Build your AI-powered application workspace.</p>
        {error && <div className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</div>}
        <label className="mt-6 block text-sm font-semibold text-white/80">Name</label>
        <input className="input-field mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label className="mt-4 block text-sm font-semibold text-white/80">Email</label>
        <input className="input-field mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="mt-4 block text-sm font-semibold text-white/80">Password</label>
        <div className="mt-2 flex gap-2">
          <input className="input-field" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="btn-secondary px-4 py-2">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">{loading ? 'Creating...' : 'Register'}</button>
        <p className="mt-5 text-center text-sm text-white/60">
          Already have an account? <Link className="font-semibold text-blue-200" to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
