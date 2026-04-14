import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import GlassSurface from '@/components/GlassSurface';
import ScoreArc      from '@/components/ScoreArc';
import WeekChart     from '@/components/WeekChart';
import ProfileMenu   from '@/components/ProfileMenu';
import SleepSheet    from '@/components/SleepSheet';
import ActivitySheet from '@/components/ActivitySheet';
import HistorySheet  from '@/components/HistorySheet';
import { Chip }      from '@/components/ui';

import {
  STATUS_CONFIG,
  getSubTypeIcon, getSubTypeLabel,
  type RecoveryResult,
  type WeekDay,
  type DayRecord,
  type SleepEntry,
  type Activity,
} from '@/lib/types';
import { todayStr, fmtDate, firstName } from '@/lib/dateUtils';
import { activityWeightedLoad } from '@/lib/algorithm';
import { dashboardStyles as s } from '@/components/Dashboard.styles';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });

// ─── Global styles injected once ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes spin { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  input[type=range] { appearance: none; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12); outline: none; }
  input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #6366f1; cursor: pointer; box-shadow: 0 0 6px rgba(99,102,241,0.5); }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
`;

// ─── Activity icon helper ─────────────────────────────────────────────────────


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [record,    setRecord]    = useState<DayRecord | null>(null);
  const [result,    setResult]    = useState<RecoveryResult | null>(null);
  const [week,      setWeek]      = useState<WeekDay[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [sleepOpen, setSleepOpen] = useState(false);
  const [actOpen,   setActOpen]   = useState(false);
  const [histOpen,  setHistOpen]  = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  // ── Data loading ────────────────────────────────────────────────────────────
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
      if (sr.ok) setResult(await sr.json());
      else       setResult(null);
    } else {
      setResult(null);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === 'authenticated') loadData();
  }, [status, loadData]);

  // ── Save handlers ────────────────────────────────────────────────────────────
  const handleSaveSleep = async (entry: SleepEntry, date: string) => {
    await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...entry }),
    });
    setSleepOpen(false);
    await loadData();
  };

  const handleAddActivity = async (activity: Omit<Activity, 'id'>, date: string) => {
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...activity }),
    });
    setActOpen(false);
    await loadData();
  };

  const handleRemoveActivity = async (activityId: string) => {
    await fetch(`/api/activities/${activityId}?date=${todayStr()}`, { method: 'DELETE' });
    await loadData();
  };

  // ── Loading / auth gates ─────────────────────────────────────────────────────
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080b12' }}>
        <div style={s.spinner} />
      </div>
    );
  }

  const cfg       = result ? STATUS_CONFIG[result.status] : null;
  const silkColor = cfg ? cfg.silkColor : '#0f1a2e';
  const hasSleep  = !!record?.sleep;
  const hasActs   = (record?.activities?.length ?? 0) > 0;
  const hasAny    = hasSleep || hasActs;

  return (
    <>
      <Head>
        <title>RecoveryIndex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <style>{GLOBAL_STYLES}</style>

      {/* Silk background */}
      <div style={s.silkLayer}>
        <Silk speed={3.2} scale={0.95} color={silkColor} noiseIntensity={4.2} rotation={0.6} />
      </div>

      <div style={s.page}>
        <div style={s.inner}>

          {/* Header */}
          <header style={s.header}>
            <div>
              <p style={s.headerGreeting}>Welcome back,</p>
              <p style={s.headerName}>{firstName(session?.user?.name)} 👋</p>
            </div>
            <ProfileMenu name={session?.user?.name} email={session?.user?.email} />
          </header>

          {/* Content */}
          <main style={s.main}>
            {loading ? (
              <div style={s.loader}>
                <div style={s.spinner} />
                <p style={s.loaderText}>Loading your data...</p>
              </div>

            ) : !hasAny ? (
              /* ── Empty state ── */
              <div style={s.emptyState}>
                <GlassSurface width="150px" height="150px" borderRadius={28} backgroundOpacity={0.07} blur={12}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 48 }}>💤</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Nothing logged</span>
                </GlassSurface>
                <p style={s.emptyTitle}>Start logging today</p>
                <p style={s.emptySubtitle}>Add your sleep and activities to calculate your recovery score.</p>
                <div style={s.emptyActions}>
                  <button onClick={() => setSleepOpen(true)} style={s.emptyBtn(true)}>😴 Log Sleep</button>
                  <button onClick={() => setActOpen(true)}   style={s.emptyBtn(false)}>🏋️ Add Activity</button>
                </div>
              </div>

            ) : (
              <>
                {/* ── Score card (when calculated) ── */}
                {result && cfg && (
                  <GlassSurface borderRadius={24} backgroundOpacity={0.08} blur={16} style={s.scoreCard}>
                    <p style={s.scoreDateLabel}>{fmtDate(todayStr())}</p>
                    <ScoreArc score={result.score} status={result.status} />
                    <p style={{ ...s.scoreRecommendation, marginTop: 10 }}>{result.recommendation}</p>

                    <div style={s.chipRow}>
                      {hasSleep && (
                        <Chip onRemove={undefined}>
                          😴 {record?.sleep?.hours}h · {record?.sleep?.quality}
                        </Chip>
                      )}
                    </div>
                  </GlassSurface>
                )}

                {/* ── Sleep card (always shown when logged) ── */}
                {hasSleep && (
                  <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={s.statLabel}>Sleep</p>
                        <p style={s.statValue}>{record?.sleep?.hours}h</p>
                        <p style={s.statSub}>
                          {record?.sleep?.quality}
                          {record?.sleep?.bedtime  && ` · 🛏 ${record.sleep.bedtime}`}
                          {record?.sleep?.wakeTime && ` → ${record.sleep.wakeTime}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span style={{ fontSize: 28 }}>
                          {record?.sleep?.quality === 'great' ? '😊' : record?.sleep?.quality === 'okay' ? '😐' : '😴'}
                        </span>
                        <button onClick={() => setSleepOpen(true)}
                          style={{ fontSize: 11, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Edit
                        </button>
                      </div>
                    </div>
                    {result && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                          Sleep score: <span style={{ color: '#fff', fontWeight: 700 }}>{result.sleepComponent}</span>
                        </p>
                      </div>
                    )}
                  </GlassSurface>
                )}

                {/* ── Activities section ── */}
                <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={{ padding: '16px 18px' }}>
                  <div style={s.activitiesHeader}>
                    <p style={s.sectionLabel}>Activities today</p>
                    <button onClick={() => setActOpen(true)} style={s.addActivityBtn}>+ Add</button>
                  </div>

                  {!hasActs ? (
                    <p style={s.emptyActivities}>No activities logged yet</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {record?.activities.map(act => {
                        const icon = getSubTypeIcon(act.subType);
                        const load = Math.round(activityWeightedLoad(act));
                        const typeLabel = getSubTypeLabel(act.subType);
                        return (
                          <div key={act.id} style={s.activityItem}>
                            <div style={s.activityLeft}>
                              <div style={s.activityIcon}>{icon}</div>
                              <div>
                                <p style={s.activityName}>{typeLabel}</p>
                                <p style={s.activityMeta}>
                                  {act.intensity} · {act.durationMins}min · 🕐 {act.timeOfDay}
                                </p>
                              </div>
                            </div>
                            <div style={s.activityRight}>
                              <span style={s.activityLoad}>{load} pts</span>
                              <button onClick={() => handleRemoveActivity(act.id)} style={s.removeBtn}>×</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {result && hasActs && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Total load today</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>{result.todayLoad} pts</p>
                    </div>
                  )}
                </GlassSurface>

                {/* ── Stats + Tomorrow projection ── */}
                {result && cfg && (
                  <>
                    <div style={s.statsGrid}>
                      <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.statCard}>
                        <p style={s.statLabel}>Fatigue Debt</p>
                        <p style={s.statValue}>{result.fatigueDebt}</p>
                        <p style={s.statSub}>accumulated load</p>
                      </GlassSurface>
                      <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14}
                        style={{ ...s.statCard, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={s.statLabel}>Tomorrow</p>
                        <p style={{ ...s.statValue, color: STATUS_CONFIG[result.tomorrowProjection >= 70 ? 'good' : result.tomorrowProjection >= 50 ? 'moderate' : 'poor'].hex }}>
                          {result.tomorrowProjection}
                        </p>
                        <p style={s.statSub}>projected score</p>
                      </GlassSurface>
                    </div>

                    {/* ── Training advice ── */}
                    <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.adviceCard}>
                      <p style={s.statLabel}>Training Advice</p>
                      <p style={s.adviceText}>{result.trainingAdvice}</p>
                    </GlassSurface>
                  </>
                )}

                {/* ── 7-day trend ── */}
                {week.some(d => d.score != null) && (
                  <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.trendCard}>
                    <div style={s.trendHeader}>
                      <p style={s.statLabel}>7-Day Trend</p>
                      <button onClick={() => setHistOpen(true)} style={s.trendViewAll}>View all →</button>
                    </div>
                    <WeekChart week={week} />
                  </GlassSurface>
                )}

                {hasAny && (
                  <button onClick={() => setSleepOpen(true)} style={s.editLogLink}>
                    Edit sleep
                  </button>
                )}
              </>
            )}
          </main>
        </div>

        {/* Bottom action bar */}
        <div style={s.bottomBar}>
          <button onClick={() => setSleepOpen(true)}
            style={{ ...s.bottomBarBtn(hasSleep), borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            {hasSleep ? '😴 Sleep ✓' : '😴 Log Sleep'}
          </button>
          <button onClick={() => setActOpen(true)}
            style={{ ...s.bottomBarBtn(true), borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            + Activity
          </button>
          <button onClick={() => setHistOpen(true)} style={s.bottomBarBtn(false)}>
            History
          </button>
        </div>
      </div>

      {/* Sheets */}
      <SleepSheet
        open={sleepOpen}
        onClose={() => setSleepOpen(false)}
        onSave={handleSaveSleep}
        existing={record?.sleep ?? null}
      />
      <ActivitySheet
        open={actOpen}
        onClose={() => setActOpen(false)}
        onSave={handleAddActivity}
      />
      <HistorySheet
        open={histOpen}
        onClose={() => setHistOpen(false)}
        week={week}
      />
    </>
  );
}
