export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-white/70">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
