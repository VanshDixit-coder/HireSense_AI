import { useEffect, useMemo, useState } from 'react';
import { jobApi } from '../api/jobApi';
import { getErrorMessage } from '../api/authApi';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillTag from '../components/SkillTag';
import useDebounce from '../hooks/useDebounce';

const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const experienceLevels = ['Entry', 'Mid', 'Senior'];

export default function JobSearchPage() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [types, setTypes] = useState([]);
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedRole = useDebounce(role, 300);

  const params = useMemo(() => ({
    role: debouncedRole,
    location,
    type: types.join(','),
    experience,
    skills: skills.join(','),
    page,
    limit: 10
  }), [debouncedRole, location, types, experience, skills, page]);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await jobApi.list(params);
        setJobs(data.jobs || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load jobs'));
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [params]);

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) {
      setSkills([...skills, value]);
      setSkillInput('');
      setPage(1);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold">Job Search</h1>
          <p className="mt-2 text-white/60">Find roles by title, company, skill, location, and experience level.</p>
        </div>
        <input className="input-field md:max-w-md" placeholder="Search roles, companies, descriptions" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} />
      </div>

      {error && <div className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-100">{error}</div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <aside className="glass-card h-fit p-5">
          <h2 className="font-heading text-xl font-bold">Filters</h2>
          <label className="mt-5 block text-sm font-semibold text-white/80">Location</label>
          <input className="input-field mt-2" value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} />
          <div className="mt-5">
            <p className="text-sm font-semibold text-white/80">Job Type</p>
            <div className="mt-3 space-y-2">
              {jobTypes.map((type) => (
                <label key={type} className="flex items-center gap-3 text-sm text-white/70">
                  <input type="checkbox" checked={types.includes(type)} onChange={(e) => {
                    setPage(1);
                    setTypes(e.target.checked ? [...types, type] : types.filter((item) => item !== type));
                  }} />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-white/80">Experience</p>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-3 text-sm text-white/70">
                <input type="radio" checked={!experience} onChange={() => { setExperience(''); setPage(1); }} />
                Any
              </label>
              {experienceLevels.map((level) => (
                <label key={level} className="flex items-center gap-3 text-sm text-white/70">
                  <input type="radio" checked={experience === level} onChange={() => { setExperience(level); setPage(1); }} />
                  {level}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-white/80">Skills</p>
            <div className="mt-2 flex gap-2">
              <input className="input-field" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              <button type="button" className="btn-secondary px-4 py-2" onClick={addSkill}>Add</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => <SkillTag key={skill} onRemove={() => setSkills(skills.filter((item) => item !== skill))}>{skill}</SkillTag>)}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? <LoadingSpinner label="Searching jobs" /> : (
            <>
              <p className="mb-4 text-sm text-white/50">{pagination.total} roles found</p>
              <div className="grid gap-5 md:grid-cols-2">
                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
              </div>
              {!jobs.length && <div className="glass-card p-8 text-center text-white/60">No jobs match these filters.</div>}
              <div className="mt-8 flex items-center justify-center gap-3">
                <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span className="text-sm text-white/60">Page {pagination.page} of {Math.max(pagination.pages, 1)}</span>
                <button className="btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
