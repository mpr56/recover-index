import fs   from 'fs';
import path from 'path';

export interface UserSettings {
  timezone: string;   // IANA tz string e.g. "Australia/Sydney"
  createdAt: string;
  updatedAt: string;
}

const FALLBACK_TZ = 'UTC';

function settingsFile(userId: string): string {
  const dir = path.join(process.cwd(), 'data', 'settings');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${userId}.json`);
}

export function getSettings(userId: string): UserSettings | null {
  const f = settingsFile(userId);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, 'utf-8'));
  } catch {
    return null;
  }
}

export function saveSettings(userId: string, patch: Partial<UserSettings>): UserSettings {
  const existing = getSettings(userId);
  const now = new Date().toISOString();
  const next: UserSettings = {
    timezone:  patch.timezone  ?? existing?.timezone  ?? FALLBACK_TZ,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  fs.writeFileSync(settingsFile(userId), JSON.stringify(next, null, 2));
  return next;
}

/** Returns the user's timezone, falling back to UTC if not yet set. */
export function getUserTimezone(userId: string): string {
  return getSettings(userId)?.timezone ?? FALLBACK_TZ;
}
