import { Link } from 'react-router-dom';
import SkillTag from './SkillTag';
import { truncateText } from '../utils/formatters';

export default function JobCard({ job, compact = false }) {
  return (
    <article className="glass-card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-semibold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-white/60">{job.company} - {job.location}</p>
        </div>
        <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
          {job.type}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-emerald-200">{job.salaryRange}</p>
      {!compact && <p className="mt-3 text-sm leading-6 text-white/65">{truncateText(job.description, 180)}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {(job.requiredSkills || []).slice(0, 3).map((skill) => (
          <SkillTag key={skill} tone="blue">{skill}</SkillTag>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <Link to={`/jobs/${job._id}`} className="btn-primary w-full">View Details</Link>
      </div>
    </article>
  );
}
