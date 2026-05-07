import { useRef, useState } from 'react';

export default function ResumeUploader({ onUpload, progress = 0, uploading = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

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
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          validateAndUpload(event.dataTransfer.files?.[0]);
        }}
        className={`glass-card flex w-full flex-col items-center justify-center border-dashed p-10 text-center transition ${dragging ? 'border-primary bg-blue-400/10' : ''}`}
      >
        <span className="font-heading text-2xl font-semibold">Upload Resume</span>
        <span className="mt-2 text-sm text-white/60">PDF or DOCX, up to 5MB</span>
        <span className="mt-5 btn-primary">Choose File</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(event) => validateAndUpload(event.target.files?.[0])}
      />
      {uploading && (
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
    </div>
  );
}
