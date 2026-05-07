import { Link } from 'react-router-dom';

export default function LandingPage() {
  const features = [
    ['Job Discovery', 'Search curated roles with skill, location, experience, and work-style filters.'],
    ['Resume AI', 'Parse resumes, tailor content to target roles, and generate application-ready documents.'],
    ['Match Score', 'Compare your resume against job requirements with AI-backed fit analysis.']
  ];

  const steps = [
    ['01', 'Upload your resume', 'HireSense extracts skills, experience, education, and projects.'],
    ['02', 'Find target roles', 'Filter jobs and save opportunities that fit your goals.'],
    ['03', 'Apply with precision', 'Generate tailored resumes, cover letters, and skill-gap resources.']
  ];

  return (
    <div>
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-200">AI job search command center</p>
          <h1 className="mt-5 font-heading text-5xl font-bold leading-tight text-white sm:text-6xl">
            Land Your Dream Job with AI-Powered Precision
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            HireSense AI helps candidates discover aligned roles, measure fit, tailor resumes, and close skill gaps without guessing what hiring teams want.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <a href="#how" className="btn-secondary">See How It Works</a>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/50">Target role</p>
                <h2 className="font-heading text-2xl font-semibold">Senior Full Stack Engineer</h2>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200">86%</span>
            </div>
            <div className="mt-5 grid gap-3">
              {['React', 'Node.js', 'MongoDB', 'System Design'].map((skill) => (
                <div key={skill} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <span className="text-sm font-semibold">{skill}</span>
                  <span className="text-sm text-emerald-200">Matched</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-primary/10 p-4 text-sm leading-6 text-blue-100">
              Your resume already maps strongly to this role. Add measurable leadership outcomes and testing keywords to improve ATS alignment.
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/10 bg-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold">Everything wired for the application workflow</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(([title, body]) => (
              <div key={title} className="glass-card p-6">
                <h3 className="font-heading text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, body]) => (
            <div key={number} className="glass-card p-6">
              <span className="text-sm font-bold text-primary">{number}</span>
              <h3 className="mt-4 font-heading text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
