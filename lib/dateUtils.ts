export const todayStr = (): string => new Date().toISOString().split('T')[0];

export const getDateStr = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getLast7Days = (): string[] =>
  Array.from({ length: 7 }, (_, i) => getDateStr(-(6 - i)));

export const fmtDate = (d: string): string =>
  new Date(d + 'T12:00').toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

export const fmtDateShort = (d: string): string =>
  new Date(d + 'T12:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short',
  });

export const fmtDay = (d: string): string =>
  new Date(d + 'T12:00').toLocaleDateString('en-AU', { weekday: 'short' });

export const firstName = (n?: string | null): string =>
  n?.split(' ')[0] ?? 'there';

/** Returns current time as "HH:MM" */
export const nowTimeStr = (): string => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Parse "HH:MM" into decimal hours (e.g. "14:30" → 14.5) */
export const timeToHours = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h + (m ?? 0) / 60;
};
