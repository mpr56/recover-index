import fs   from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { DayRecord, Activity, SleepEntry } from './types';

// ─── File helpers ─────────────────────────────────────────────────────────────
function dataFile(userId: string): string {
  const dir = path.join(process.cwd(), 'data', 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, `${userId}.json`);
  if (!fs.existsSync(f)) fs.writeFileSync(f, '[]');
  return f;
}

function read(userId: string): DayRecord[] {
  return JSON.parse(fs.readFileSync(dataFile(userId), 'utf-8'));
}

function write(userId: string, records: DayRecord[]): void {
  fs.writeFileSync(dataFile(userId), JSON.stringify(records, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function getAllRecords(userId: string): DayRecord[] {
  return read(userId);
}

export function getRecordByDate(userId: string, date: string): DayRecord | null {
  return read(userId).find(r => r.date === date) ?? null;
}

export function getRecordsInRange(userId: string, start: string, end: string): DayRecord[] {
  return read(userId).filter(r => r.date >= start && r.date <= end);
}

/** Ensure a record exists for the date and return it */
function ensureRecord(userId: string, date: string): { records: DayRecord[]; record: DayRecord; idx: number } {
  const records = read(userId);
  let idx = records.findIndex(r => r.date === date);
  if (idx === -1) {
    const record: DayRecord = {
      id: uuidv4(), userId, date,
      sleep: null, activities: [], notes: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    records.push(record);
    idx = records.length - 1;
  }
  return { records, record: records[idx], idx };
}

export function upsertSleep(userId: string, date: string, sleep: SleepEntry): DayRecord {
  const { records, record, idx } = ensureRecord(userId, date);
  records[idx] = { ...record, sleep, updatedAt: new Date().toISOString() };
  write(userId, records);
  return records[idx];
}

export function addActivity(userId: string, date: string, activity: Omit<Activity, 'id'>): DayRecord {
  const { records, record, idx } = ensureRecord(userId, date);
  const newActivity: Activity = { ...activity, id: uuidv4() };
  records[idx] = { ...record, activities: [...record.activities, newActivity], updatedAt: new Date().toISOString() };
  write(userId, records);
  return records[idx];
}

export function removeActivity(userId: string, date: string, activityId: string): DayRecord | null {
  const { records, record, idx } = ensureRecord(userId, date);
  records[idx] = { ...record, activities: record.activities.filter(a => a.id !== activityId), updatedAt: new Date().toISOString() };
  write(userId, records);
  return records[idx];
}

export function upsertNotes(userId: string, date: string, notes: string): DayRecord {
  const { records, record, idx } = ensureRecord(userId, date);
  records[idx] = { ...record, notes, updatedAt: new Date().toISOString() };
  write(userId, records);
  return records[idx];
}

export function deleteRecord(userId: string, id: string): boolean {
  const records = read(userId);
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) return false;
  write(userId, filtered);
  return true;
}
