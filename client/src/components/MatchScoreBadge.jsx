export default function MatchScoreBadge({ score = 0, large = false }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const color = safeScore >= 75 ? 'text-emerald-200 bg-emerald-400/10 border-emerald-400/30' : safeScore >= 45 ? 'text-blue-200 bg-blue-400/10 border-blue-400/30' : 'text-red-200 bg-red-400/10 border-red-400/30';
  return (
    <span className={`inline-flex items-center rounded-full border font-bold ${color} ${large ? 'px-5 py-2 text-lg' : 'px-3 py-1 text-xs'}`}>
      {safeScore}%
    </span>
  );
}
