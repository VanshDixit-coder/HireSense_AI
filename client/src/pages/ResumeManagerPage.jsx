import { useEffect, useState } from 'react';
import { resumeApi } from '../api/resumeApi';
import { getErrorMessage } from '../api/authApi';
import ResumeUploader from '../components/ResumeUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillTag from '../components/SkillTag';
import { formatDate } from '../utils/formatters';

export default function ResumeManagerPage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function loadResume() {
    try {
      setLoading(true);
      const data = await resumeApi.latest();
      setResume(data.resume);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load resume'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResume();
  }, []);

  const upload = async (file) => {
    try {
      setError('');
      setUploading(true);
      setParsing(false);
      setProgress(0);
      const data = await resumeApi.upload(file, (event) => {
        const percent = event.total ? Math.round((event.loaded * 100) / event.total) : 50;
        setProgress(percent);
        if (percent >= 100) {
          setUploading(false);
          setParsing(true);
        }
      });
      setResume(data.resume);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to upload resume'));
    } finally {
      setUploading(false);
      setParsing(false);
      setProgress(0);
    }
  };

  const remove = async () => {
    if (!resume || !window.confirm('Delete this resume?')) return;
    try {
      await resumeApi.remove(resume._id);
      setResume(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete resume'));
    }
  };

  if (loading) return <LoadingSpinner label="Loading resume" />;

  const data = resume?.parsedData;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold">Resume Manager</h1>
          <p className="mt-2 text-white/60">Upload, parse, and review your latest resume profile.</p>
        </div>
        {resume && <button className="btn-secondary" onClick={remove}>Delete Resume</button>}
      </div>
      {error && <div className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-100">{error}</div>}
      <div className="mt-8">
        <ResumeUploader onUpload={upload} uploading={uploading} parsing={parsing} progress={progress} />
      </div>

      {resume ? (
        <div className="mt-8 space-y-6">
          <div className="glass-card p-5">
            <p className="text-sm text-white/50">{resume.originalFileName} - uploaded {formatDate(resume.uploadedAt)}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Parsed Resume Data</h2>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading text-xl font-bold">Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">{(data.skills || []).map((skill) => <SkillTag key={skill} tone="blue">{skill}</SkillTag>)}</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-5">
              <h3 className="font-heading text-xl font-bold">Education</h3>
              <div className="mt-4 space-y-4">
                {(data.education || []).map((item, index) => (
                  <div key={`${item.degree}-${index}`} className="border-l-2 border-primary pl-4">
                    <p className="font-semibold">{item.degree}</p>
                    <p className="text-sm text-white/60">{item.institution} - {item.year}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="font-heading text-xl font-bold">Experience</h3>
              <div className="mt-4 space-y-4">
                {(data.experience || []).map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/60">{item.company} - {item.duration}</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-heading text-xl font-bold">Projects</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(data.projects || []).map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{(item.technologies || []).map((tech) => <SkillTag key={tech}>{tech}</SkillTag>)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card mt-8 p-8 text-center text-white/60">No resume uploaded yet.</div>
      )}
    </section>
  );
}
