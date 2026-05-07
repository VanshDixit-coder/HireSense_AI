export function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function truncateText(text = '', max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export function uniqueList(items = []) {
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
}
