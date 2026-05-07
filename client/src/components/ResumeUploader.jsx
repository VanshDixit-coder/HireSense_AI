import { useRef, useState } from 'react';

export default function ResumeUploader({ onUpload, progress = 0, uploading = false, parsing = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const isBusy = uploading || parsing;

  const validateAndUpload = (file) => {
    setError('');
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(file.type)) {
      setError('Upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be 5MB or smaller.');
      return;
    }
    onUpload(file);
  };

  return (
    <div>
      <button
        type="button"
        disabled={isBusy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (isBusy) return;
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (isBusy) return;
          validateAndUpload(event.dataTransfer.files?.[0]);
        }}
        className={`glass-card flex w-full flex-col items-center justify-center border-dashed p-10 text-center transition ${dragging ? 'border-primary bg-blue-400/10' : ''} ${isBusy ? 'cursor-wait opacity-80' : ''}`}
      >
        {parsing ? (
          <>
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
            <span className="mt-5 font-heading text-2xl font-semibold">Parsing resume</span>
            <span className="mt-2 text-sm text-white/60">Extracting skills, experience, education, and projects.</span>
          </>
        ) : (
          <>
            <span className="font-heading text-2xl font-semibold">{uploading ? 'Uploading resume' : 'Upload Resume'}</span>
            <span className="mt-2 text-sm text-white/60">PDF or DOCX, up to 5MB</span>
            <span className="mt-5 btn-primary">{uploading ? 'Uploading...' : 'Choose File'}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(event) => validateAndUpload(event.target.files?.[0])}
      />
      {isBusy && (
        <div className="mt-4 glass-card p-4">
          {uploading && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Uploading file</span>
                <span className="text-white/60">{progress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
          {parsing && (
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-emerald-300" />
              <span>Parsing resume with AI. This can take a few moments.</span>
            </div>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
    </div>
  );
}
