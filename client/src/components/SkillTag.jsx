export default function SkillTag({ children, tone = 'default', onRemove }) {
  const tones = {
    default: 'border-white/10 bg-white/10 text-white',
    success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    danger: 'border-red-400/30 bg-red-400/10 text-red-200',
    blue: 'border-blue-400/30 bg-blue-400/10 text-blue-200'
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-white/60 transition hover:text-white" aria-label={`Remove ${children}`}>
          x
        </button>
      )}
    </span>
  );
}
