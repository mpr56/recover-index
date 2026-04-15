import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getDevSession } from '@/lib/devAuth';
import { type DayRecord, type RecoveryResult, type WeekDay, type SleepEntry, type Activity } from '@/lib/types';
import { todayStr } from '@/lib/dateUtils';

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

  // ── Data fetching ─────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [weekRes, logsRes] = await Promise.all([
      fetch('/api/week'),
      fetch('/api/logs'),
    ]);
    if (weekRes.status === 401) { router.push('/auth/login'); return; }

    const weekData: WeekDay[]   = await weekRes.json();
    const logs:     DayRecord[] = await logsRes.json();
    setWeek(weekData);

    const today = logs.find(l => l.date === todayStr()) ?? null;
    setRecord(today);

    if (today && (today.sleep || today.activities.length > 0)) {
      const sr = await fetch(`/api/score?date=${todayStr()}`);
      setResult(sr.ok ? await sr.json() : null);
    } else {
      setResult(null);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === 'authenticated') loadData();
  }, [status, loadData]);

  // ── Save / mutation handlers ──────────────────────────────────────────────
  const handleSaveSleep = async (entry: SleepEntry, date: string) => {
    await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...entry }),
    });
    setSleepOpen(false);
    await loadData();
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
    await loadData();
  };

  const handleRemoveActivity = async (activityId: string) => {
    await fetch(`/api/activities/${activityId}?date=${todayStr()}`, { method: 'DELETE' });
    await loadData();
  };

  const handleEditActivity = (act: Activity) => {
    setEditActivity(act);
    setEditDate(todayStr());
    setActOpen(true);
  };

  const openActivitySheet = () => setActOpen(true);

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
    // Session
    session, status,
    // Data
    record, result, week, loading,
    // Derived
    hasSleep, hasActs, hasAny,
    // Sheet open state + setters
    sleepOpen, setSleepOpen,
    actOpen,
    openActivitySheet,
    closeActivitySheet,
    histOpen,  setHistOpen,
    howOpen,   setHowOpen,
    // Edit activity
    editActivity, editDate,
    // Handlers
    handleSaveSleep,
    handleSaveActivity,
    handleRemoveActivity,
    handleEditActivity,
  };
}
