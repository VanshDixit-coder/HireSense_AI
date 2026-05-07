import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiApi } from '../api/aiApi';
import { jobApi } from '../api/jobApi';
import { getErrorMessage } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import JobCard from '../components/JobCard';
import MatchScoreBadge from '../components/MatchScoreBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, uniqueList } from '../utils/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [resources, setResources] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const [deletingApplicationId, setDeletingApplicationId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [recData, appData, savedData] = await Promise.all([
          aiApi.recommendations(),
          aiApi.applications(),
          jobApi.saved()
        ]);
        setRecommendations(recData.recommendations || []);
        setApplications(appData.applications || []);
        setSavedJobs(savedData.jobs || []);

        const missing = uniqueList((appData.applications || []).flatMap((item) => item.missingSkills || [])).slice(0, 5);
        if (missing.length) {
          try {
            const gapData = await aiApi.skillGap({ missingSkills: missing });
            setResources(gapData.resources || []);
          } catch (err) {
            setResources(missing.map((skill) => ({ skill, recommendedCourse: 'Search focused beginner-to-practical tutorials', platform: 'freeCodeCamp', estimatedTime: '2-4 weeks' })));
          }
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load dashboard'));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const averageScore = useMemo(() => {
    if (!applications.length) return 0;
    return Math.round(applications.reduce((sum, item) => sum + (item.matchScore || 0), 0) / applications.length);
  }, [applications]);

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Remove this application from your dashboard?')) return;

    try {
      setError('');
      setDeletingApplicationId(applicationId);
      await aiApi.deleteApplication(applicationId);
      setApplications((items) => items.filter((item) => item._id !== applicationId));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete application'));
    } finally {
      setDeletingApplicationId('');
    }
  };

  if (loading) return <LoadingSpinner label="Loading dashboard" />;

  return (
		<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="glass-card p-6">
				<p className="text-sm font-semibold text-emerald-200">
					Welcome back, {user?.name}
				</p>
				<h1 className="mt-2 font-heading text-4xl font-bold">
					Your application cockpit
				</h1>
				<p className="mt-3 max-w-3xl text-white/65">
					Track opportunities, generate tailored materials, and keep your skill
					gaps visible.
				</p>
			</div>

			{error && (
				<div className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-100">
					{error}
				</div>
			)}

			<div className="mt-6 grid gap-4 md:grid-cols-3">
				<div className="glass-card p-5">
					<p className="text-sm text-white/55">Total Applications</p>
					<p className="mt-2 font-heading text-4xl font-bold">
						{applications.length}
					</p>
				</div>
				<div className="glass-card p-5">
					<p className="text-sm text-white/55">Average Match Score</p>
					<p className="mt-2 font-heading text-4xl font-bold">
						{averageScore}%
					</p>
				</div>
				<div className="glass-card p-5">
					<p className="text-sm text-white/55">Saved Jobs</p>
					<p className="mt-2 font-heading text-4xl font-bold">
						{savedJobs.length}
					</p>
				</div>
			</div>

			<div className="mt-10">
				<div className="flex items-center justify-between gap-4">
					<h2 className="font-heading text-2xl font-bold">Recommended Jobs</h2>
					<Link to="/jobs" className="text-sm font-semibold text-blue-200">
						Browse all
					</Link>
				</div>
				<div className="mt-4 flex gap-4 overflow-x-auto pb-3">
					{recommendations.length ? (
						recommendations.map(({ job, overlap }) => (
							<div key={job._id} className="w-80 shrink-0">
								<JobCard
									job={{
										...job,
										salaryRange: `${job.salaryRange} - ${overlap}% fit`,
									}}
									compact
								/>
							</div>
						))
					) : (
						<div className="glass-card w-full p-6 text-white/65">
							Add skills or upload a resume to unlock recommendations.
						</div>
					)}
				</div>
			</div>

			<div className="mt-10 grid gap-6 lg:grid-cols-3">
				<div className="glass-card overflow-hidden lg:col-span-2">
					<div className="border-b border-white/10 p-5">
						<h2 className="font-heading text-2xl font-bold">
							Recent Applications
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="text-white/50">
								<tr>
									<th className="px-5 py-3">Role</th>
									<th className="px-5 py-3">Match</th>
									<th className="px-5 py-3">Date</th>
									<th className="px-5 py-3">Actions</th>
								</tr>
							</thead>
							<tbody>
								{applications.map((item) => (
									<tr key={item._id} className="border-t border-white/10">
										<td className="px-5 py-4">
											<p className="font-semibold">{item.jobId?.title}</p>
											<p className="text-white/50">{item.jobId?.company}</p>
										</td>
										<td className="px-5 py-4">
											<MatchScoreBadge score={item.matchScore} />
										</td>
										<td className="px-5 py-4 text-white/60">
											{formatDate(item.appliedAt)}
										</td>
										<td className="px-5 py-4">
											<div className="flex flex-wrap gap-2">
												{item.generatedResume && (
													<button
														className="btn-secondary px-3 py-2"
														onClick={() =>
															setModal({
																title: "Generated Resume",
																text: item.generatedResume,
															})
														}>
														Resume
													</button>
												)}
												{item.generatedCoverLetter && (
													<button
														className="btn-secondary px-3 py-2"
														onClick={() =>
															setModal({
																title: "Cover Letter",
																text: item.generatedCoverLetter,
															})
														}>
														Cover
													</button>
												)}
												<button
													className="btn-secondary px-3 py-2 border border-red-400/30 bg-red-400/10 hover:border-red-300 hover:bg-red-400/20"
													onClick={() => deleteApplication(item._id)}
													disabled={deletingApplicationId === item._id}
													title="Delete application"
													aria-label={`Delete application for ${item.jobId?.title || "this job"}`}>
													{deletingApplicationId === item._id
														? "..."
														: "Delete"}
												</button>
											</div>
										</td>
									</tr>
								))}
								{!applications.length && (
									<tr>
										<td
											colSpan="4"
											className="px-5 py-8 text-center text-white/55">
											Analyze a job fit to start tracking applications.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				<aside className="glass-card p-5">
					<h2 className="font-heading text-2xl font-bold">Skill Gap Summary</h2>
					<div className="mt-4 space-y-3">
						{resources.length ? (
							resources.map((item) => (
								<div
									key={item.skill}
									className="rounded-lg border border-white/10 bg-white/5 p-3">
									<p className="font-semibold text-white">{item.skill}</p>
									<p className="mt-1 text-sm text-white/60">
										{item.recommendedCourse}
									</p>
									<p className="mt-1 text-xs text-emerald-200">
										{item.platform} - {item.estimatedTime}
									</p>
								</div>
							))
						) : (
							<p className="text-sm leading-6 text-white/60">
								Run a fit analysis to generate learning priorities.
							</p>
						)}
					</div>
				</aside>
			</div>

			{modal && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
					<div className="glass-card max-h-screen w-full max-w-3xl overflow-auto p-6">
						<div className="flex items-center justify-between">
							<h3 className="font-heading text-2xl font-bold">{modal.title}</h3>
							<button
								className="btn-secondary px-3 py-2"
								onClick={() => setModal(null)}>
								Close
							</button>
						</div>
						<pre className="mt-5 whitespace-pre-wrap rounded-lg bg-black/30 p-4 text-sm leading-6 text-white/80">
							{modal.text}
						</pre>
					</div>
				</div>
			)}
		</section>
	);
}
