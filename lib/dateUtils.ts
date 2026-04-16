// ─── UTC fallbacks (kept for legacy callers & server-side without tz) ─────────

export const todayStr = (): string => new Date().toISOString().split('T')[0];

export const getDateStr = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getLast7Days = (): string[] =>
  Array.from({ length: 7 }, (_, i) => getDateStr(-(6 - i)));

// ─── Timezone-aware equivalents ────────────────────────────────────────────

/**
 * Returns today's date as YYYY-MM-DD in the given IANA timezone.
 * Uses en-CA locale which always formats as YYYY-MM-DD.
 */
export const localDateStr = (tz: string): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());

/**
 * Returns a date offset by `offsetDays` from today in the given timezone.
 *
 * Strategy: start from right now, then add/subtract whole days as milliseconds.
 * Format the result in the target timezone — never parse a date string as local
 * time, which would inherit the server's timezone instead of the user's.
 */
export const localDateOffset = (tz: string, offsetDays: number): string => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now() + offsetDays * MS_PER_DAY;
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date(now));
};

/**
 * Returns the last 7 days as YYYY-MM-DD strings (oldest first) in the given timezone.
 */
export const getLast7DaysForTz = (tz: string): string[] =>
  Array.from({ length: 7 }, (_, i) => localDateOffset(tz, -(6 - i)));

/**
 * A pretty-printed timezone label for display.
 * e.g. "Australia/Sydney" → "Sydney (AEST, UTC+10)"
 */
export const formatTimezoneLabel = (tz: string): string => {
  try {
    const now = new Date();
    const offsetMin = -now.getTimezoneOffset(); // this is client-only; server will differ
    const parts = new Intl.DateTimeFormat('en-AU', {
      timeZone: tz, timeZoneName: 'short',
    }).formatToParts(now);
    const tzShort = parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    const city = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;
    return `${city} (${tzShort})`;
  } catch {
    return tz;
  }
};

/**
 * Parse a YYYY-MM-DD string as a Date at UTC noon to avoid any day-shift
 * when the string is formatted or compared. Never parse as local time.
 */
const parseDateUTCNoon = (d: string): Date =>
  new Date(`${d}T12:00:00Z`);

export const fmtDate = (d: string): string =>
  parseDateUTCNoon(d).toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'UTC',
  });

export const fmtDateShort = (d: string): string =>
  parseDateUTCNoon(d).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short',
    timeZone: 'UTC',
  });

export const fmtDay = (d: string): string =>
  parseDateUTCNoon(d).toLocaleDateString('en-AU', {
    weekday: 'short',
    timeZone: 'UTC',
  });

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
