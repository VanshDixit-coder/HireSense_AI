import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { aiApi } from '../api/aiApi';
import { getErrorMessage } from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';

function TextModal({ title, text, onClose }) {
  const copy = () => navigator.clipboard?.writeText(text);
  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="glass-card max-h-screen w-full max-w-3xl overflow-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-2xl font-bold">{title}</h3>
          <div className="flex gap-2">
            <button className="btn-secondary px-3 py-2" onClick={copy}>Copy</button>
            <button className="btn-primary px-3 py-2" onClick={download}>Download</button>
            <button className="btn-secondary px-3 py-2" onClick={onClose}>Close</button>
          </div>
        </div>
        <pre className="mt-5 whitespace-pre-wrap rounded-lg bg-black/30 p-4 text-sm leading-6 text-white/80">{text}</pre>
      </div>
    </div>
  );
}

function ScoreRing({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 42 42" className="-rotate-90">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#10B981" strokeWidth="4" pathLength="100" strokeDasharray={`${safeScore} ${100 - safeScore}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-bold">{safeScore}%</div>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [jobData, savedData] = await Promise.all([jobApi.get(id), jobApi.saved()]);
        setJob(jobData.job);
        setSaved((savedData.jobs || []).some((item) => item._id === id));
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load job'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const runAction = async (name, fn) => {
    try {
      setError('');
      setBusyAction(name);
      await fn();
    } catch (err) {
      setError(getErrorMessage(err, 'Action failed'));
    } finally {
      setBusyAction('');
    }
  };

  if (loading) return <LoadingSpinner label="Loading job" />;
  if (!job) return <section className="mx-auto max-w-4xl px-4 py-10 text-white/70">{error || 'Job not found'}</section>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {error && <div className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-100">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold">{job.title}</h1>
              <p className="mt-2 text-white/60">{job.company} - {job.location}</p>
              <p className="mt-3 text-emerald-200">{job.salaryRange}</p>
            </div>
            <button className="btn-secondary" onClick={() => runAction('save', async () => {
              const data = await jobApi.toggleSave(job._id);
              setSaved(data.saved);
            })}>
              {saved ? 'Saved' : 'Save Job'}
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">{job.type}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{job.experienceLevel}</span>
          </div>
          <h2 className="mt-8 font-heading text-2xl font-bold">Description</h2>
          <p className="mt-3 whitespace-pre-wrap leading-8 text-white/70">{job.description}</p>
          <h2 className="mt-8 font-heading text-2xl font-bold">Required Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => <SkillTag key={skill} tone="blue">{skill}</SkillTag>)}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-heading text-2xl font-bold">Match Score</h2>
            <div className="mt-5 flex justify-center">
              {analysis ? <ScoreRing score={analysis.matchScore} /> : <MatchScoreBadge score={0} large />}
            </div>
            {analysis ? (
              <div className="mt-5">
                <p className="text-sm leading-6 text-white/65">{analysis.summary}</p>
                <p className="mt-4 text-sm font-semibold text-emerald-200">Matching</p>
                <div className="mt-2 flex flex-wrap gap-2">{analysis.matchingSkills.map((skill) => <SkillTag key={skill} tone="success">{skill}</SkillTag>)}</div>
                <p className="mt-4 text-sm font-semibold text-red-200">Missing</p>
                <div className="mt-2 flex flex-wrap gap-2">{analysis.missingSkills.map((skill) => <SkillTag key={skill} tone="danger">{skill}</SkillTag>)}</div>
              </div>
            ) : <p className="mt-4 text-sm leading-6 text-white/60">Upload a resume, then run AI analysis for a deep fit assessment.</p>}
          </div>

          <div className="glass-card grid gap-3 p-6">
            <button className="btn-primary" disabled={Boolean(busyAction)} onClick={() => runAction('analyze', async () => {
              const data = await aiApi.matchScore(job._id, true);
              setAnalysis(data);
            })}>{busyAction === 'analyze' ? 'Analyzing...' : 'Analyze My Fit'}</button>
            <button className="btn-secondary" disabled={Boolean(busyAction)} onClick={() => runAction('resume', async () => {
              const data = await aiApi.generateResume(job._id);
              setModal({ title: 'Optimized Resume', text: data.generatedResume });
            })}>{busyAction === 'resume' ? 'Generating...' : 'Generate Resume'}</button>
            <button className="btn-secondary" disabled={Boolean(busyAction)} onClick={() => runAction('cover', async () => {
              const data = await aiApi.generateCoverLetter(job._id);
              setModal({ title: 'Cover Letter', text: data.generatedCoverLetter });
            })}>{busyAction === 'cover' ? 'Generating...' : 'Generate Cover Letter'}</button>
          </div>
        </aside>
      </div>
      {modal && <TextModal title={modal.title} text={modal.text} onClose={() => setModal(null)} />}
    </section>
  );
}
