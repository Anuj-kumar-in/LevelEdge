// Currency Formatter: e.g. 150 -> $150,000
export function formatCurrency(value: number): string {
  if (value === undefined || value === null) return '$0';
  // Note: Data is stored in thousands (e.g. 185 = $185,000)
  const expandedValue = value * 1000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(expandedValue);
}

// Compact Currency Formatter: e.g. 150 -> $150k
export function formatCompactCurrency(value: number): string {
  if (value === undefined || value === null) return '$0k';
  // Note: Data is stored in thousands (e.g. 150 = $150,000 = 150k)
  return `$${Math.round(value)}k`;
}

// Compact Currency Formatter for large scales: e.g. 2400 -> $2.4M
export function formatLargeCurrency(value: number): string {
  if (value === undefined || value === null) return '$0';
  if (value < 1000) return formatCompactCurrency(value);
  return `$${(value / 1000).toFixed(1)}M`;
}

// Date Formatter: e.g. '2026-05-27' -> 'May 27, 2026'
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Relative Time: e.g. '2 hours ago', '3 days ago'
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 30) return `${diffDays} days ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
