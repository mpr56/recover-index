import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getDevSession } from '@/lib/devAuth';
import { type DayRecord, type RecoveryResult, type WeekDay, type SleepEntry, type Activity } from '@/lib/types';
import { localDateStr } from '@/lib/dateUtils';

// ── Dev helper: bypass auth in local development ───────────────────────────
function useSafeSession() {
  const { data, status } = useSession();
  if (process.env.NODE_ENV === 'development') {
    return { data: getDevSession(), status: 'authenticated' as const };
  }
  return { data, status };
}

// ── Main hook ──────────────────────────────────────────────────────────────
export function useDashboard() {
  const { data: session, status } = useSafeSession();
  const router = useRouter();

  // ── Timezone / onboarding state ───────────────────────────────────────────
  const [timezone,        setTimezone]        = useState<string>('UTC');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [settingsLoaded,  setSettingsLoaded]  = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [record,  setRecord]  = useState<DayRecord | null>(null);
  const [result,  setResult]  = useState<RecoveryResult | null>(null);
  const [week,    setWeek]    = useState<WeekDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Sheet visibility
  const [sleepOpen, setSleepOpen] = useState(false);
  const [actOpen,   setActOpen]   = useState(false);
  const [histOpen,  setHistOpen]  = useState(false);
  const [howOpen,   setHowOpen]   = useState(false);

  // Activity edit state
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [editDate,     setEditDate]     = useState<string | null>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  // ── Load settings (timezone) first ────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const { settings, needsOnboarding: needs } = await res.json();
    if (settings?.timezone) setTimezone(settings.timezone);
    setNeedsOnboarding(needs);
    setSettingsLoaded(true);
  }, []);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const loadData = useCallback(async (tz: string) => {
    setLoading(true);
    const today = localDateStr(tz);
    const [weekRes, logsRes] = await Promise.all([
      fetch('/api/week'),
      fetch('/api/logs'),
    ]);
    if (weekRes.status === 401) { router.push('/auth/login'); return; }

    const weekData: WeekDay[]   = await weekRes.json();
    const logs:     DayRecord[] = await logsRes.json();
    setWeek(weekData);

    const todayRecord = logs.find(l => l.date === today) ?? null;
    setRecord(todayRecord);

    if (todayRecord && (todayRecord.sleep || todayRecord.activities.length > 0)) {
      const sr = await fetch(`/api/score?date=${today}`);
      setResult(sr.ok ? await sr.json() : null);
    } else {
      setResult(null);
    }
    setLoading(false);
  }, [router]);

  // Load settings when authenticated, then load data once settings are ready
  useEffect(() => {
    if (status === 'authenticated') loadSettings();
  }, [status, loadSettings]);

  useEffect(() => {
    if (settingsLoaded && !needsOnboarding) loadData(timezone);
  }, [settingsLoaded, needsOnboarding, timezone, loadData]);

  // ── Timezone confirm (called from onboarding modal) ────────────────────────
  const handleConfirmTimezone = async (tz: string) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timezone: tz }),
    });
    setTimezone(tz);
    setNeedsOnboarding(false);
    await loadData(tz);
  };

  // ── Save / mutation handlers ──────────────────────────────────────────────
  const handleSaveSleep = async (entry: SleepEntry, date: string) => {
    await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...entry }),
    });
    setSleepOpen(false);
    await loadData(timezone);
  };

  const handleSaveActivity = async (activity: Omit<Activity, 'id'>, date: string) => {
    if (editActivity) {
      await fetch(`/api/activities/${editActivity.id}?date=${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, ...activity }),
      });
      setEditActivity(null);
      setEditDate(null);
    } else {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, ...activity }),
      });
    }
    setActOpen(false);
    await loadData(timezone);
  };

  const handleRemoveActivity = async (activityId: string) => {
    const today = localDateStr(timezone);
    await fetch(`/api/activities/${activityId}?date=${today}`, { method: 'DELETE' });
    await loadData(timezone);
  };

  const handleEditActivity = (act: Activity) => {
    setEditActivity(act);
    setEditDate(localDateStr(timezone));
    setActOpen(true);
  };

  const openActivitySheet  = () => setActOpen(true);
  const closeActivitySheet = () => {
    setActOpen(false);
    setEditActivity(null);
    setEditDate(null);
  };

  // ── Derived booleans ──────────────────────────────────────────────────────
  const hasSleep = !!record?.sleep;
  const hasActs  = (record?.activities?.length ?? 0) > 0;
  const hasAny   = hasSleep || hasActs;

  return {
    session, status,
    timezone, needsOnboarding, handleConfirmTimezone,
    record, result, week, loading,
    hasSleep, hasActs, hasAny,
    sleepOpen, setSleepOpen,
    actOpen, openActivitySheet, closeActivitySheet,
    histOpen, setHistOpen,
    howOpen,  setHowOpen,
    editActivity, editDate,
    handleSaveSleep,
    handleSaveActivity,
    handleRemoveActivity,
    handleEditActivity,
  };
}
