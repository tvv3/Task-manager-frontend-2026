export function handle419(res, store, field = 'email') {
  if (res.status === 419) {
    store.errors = {
      [field]: [
        isDev
          ? "CSRF token expired (419)"
          : "Session expired. Please refresh."
      ]
    };
    store.user = null;
    return true;
  }
  return false;
}

export function timeAgo(date) {
  // Transformăm "2021.01.09 12:34:56" într-un format valid
 //// const normalized = dateString.replace(/\./g, '-');
 //// const date = new Date(normalized);

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return rtf.format(-count, interval.label);
    }
  }

  return 'just now';
}

// Exemplu:
// console.log(timeAgo('2021.01.09 12:34:56'));
// => "4 years ago", "28 minutes ago", etc
