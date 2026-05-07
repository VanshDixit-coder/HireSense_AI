import { useState } from 'react';
import { authApi, getErrorMessage } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import SkillTag from '../components/SkillTag';
import { formatDate, uniqueList } from '../utils/formatters';

export default function ProfilePage() {
  const { user, login, token, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    profileSummary: user?.profileSummary || '',
    skills: user?.skills || []
  });
  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    setForm({ ...form, skills: uniqueList([...form.skills, value]) });
    setSkillInput('');
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const data = await authApi.updateProfile(form);
      login(token, data.user);
      await refreshUser();
      setMessage('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-bold">Profile</h1>
      <p className="mt-2 text-white/60">Manage the candidate signals used for recommendations and fit analysis.</p>
      <form onSubmit={submit} className="glass-card mt-8 p-6">
        {error && <div className="mb-5 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-100">{error}</div>}
        {message && <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100">{message}</div>}
        <label className="block text-sm font-semibold text-white/80">Name</label>
        <input className="input-field mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label className="mt-5 block text-sm font-semibold text-white/80">Profile Summary</label>
        <textarea className="input-field mt-2 min-h-32" value={form.profileSummary} onChange={(e) => setForm({ ...form, profileSummary: e.target.value })} />
        <div className="mt-5">
          <p className="text-sm font-semibold text-white/80">Skills</p>
          <div className="mt-2 flex gap-2">
            <input className="input-field" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" className="btn-secondary px-4 py-2" onClick={addSkill}>Add</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <SkillTag key={skill} onRemove={() => setForm({ ...form, skills: form.skills.filter((item) => item !== skill) })}>
                {skill}
              </SkillTag>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/50">Account created {formatDate(user?.createdAt)}</p>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </form>
    </section>
  );
}
