import Head from 'next/head';
import dynamic from 'next/dynamic';

// ── Layout & shell components ──────────────────────────────────────────────
import DashboardHeader   from '@/components/DashboardHeader';
import EmptyState        from '@/components/EmptyState';
import ScoreCard         from '@/components/ScoreCard';
import SleepCard         from '@/components/SleepCard';
import ActivitiesSection from '@/components/ActivitiesSection';
import StatsGrid         from '@/components/StatsGrid';
import TrendSection      from '@/components/TrendSection';
import FooterLinks       from '@/components/FooterLinks';
import BottomBar         from '@/components/BottomBar';
import HowItWorksModal   from '@/components/HowItWorksModal';

// ── Sheet overlays ─────────────────────────────────────────────────────────
import SleepSheet          from '@/components/SleepSheet';
import ActivitySheet       from '@/components/ActivitySheet';
import HistorySheet        from '@/components/HistorySheet';
import TimezoneOnboarding  from '@/components/TimezoneOnboarding';

// ── Shared styles & hook ───────────────────────────────────────────────────
import { shared, GLOBAL_CSS } from '@/components/shared.styles';
import { useDashboard } from '@/hooks/useDashboard';
import { STATUS_CONFIG } from '@/lib/types';
import { TimezoneContext } from '@/lib/timezoneContext';
import { localDateStr, getLast7DaysForTz } from '@/lib/dateUtils';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  const db = useDashboard();

  if (db.status === 'loading' || db.status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080b12' }}>
        <div style={shared.spinner} />
      </div>
    );
  }

  const silkColor = db.result ? STATUS_CONFIG[db.result.status].silkColor : '#0f1a2e';

  const tzContext = {
    timezone:  db.timezone,
    todayStr:  () => localDateStr(db.timezone),
    last7Days: () => getLast7DaysForTz(db.timezone),
  };

  return (
    <TimezoneContext.Provider value={tzContext}>
    <>
      <Head>
        <title>Rejuvenate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <style>{GLOBAL_CSS}</style>

      <div style={shared.silkLayer}>
        <Silk speed={3.2} scale={0.95} color={silkColor} noiseIntensity={1.75} rotation={0.6} />
      </div>

      <div style={shared.page}>
        <div style={shared.inner}>

          <DashboardHeader
            name={db.session?.user?.name}
            email={db.session?.user?.email}
            image={db.session?.user?.image}
          />

          <main style={{ paddingBottom: 96, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* ── Loading ── */}
            {db.loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 100 }}>
                <div style={shared.spinner} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Loading your data...</p>
              </div>
            )}

            {/* ── Empty state ── */}
            {!db.loading && !db.hasAny && (
              <EmptyState
                onLogSleep={() => db.setSleepOpen(true)}
                onAddActivity={() => db.openActivitySheet()}
              />
            )}

            {/* ── Dashboard cards ── */}
            {!db.loading && db.hasAny && (
              <>
                {db.result && (
                  <ScoreCard result={db.result} sleep={db.record?.sleep ?? null} />
                )}

                {db.hasSleep && db.record?.sleep && (
                  <SleepCard
                    sleep={db.record.sleep}
                    result={db.result}
                    onEdit={() => db.setSleepOpen(true)}
                  />
                )}

                <ActivitiesSection
                  activities={db.record?.activities ?? []}
                  result={db.result}
                  onAdd={() => db.openActivitySheet()}
                  onEdit={db.handleEditActivity}
                  onRemove={db.handleRemoveActivity}
                />

                {db.result && (
                  <StatsGrid result={db.result} />
                )}

                {db.week.some(d => d.score != null) && (
                  <TrendSection
                    week={db.week}
                    onViewAll={() => db.setHistOpen(true)}
                  />
                )}

                <FooterLinks
                  onEditSleep={() => db.setSleepOpen(true)}
                  onHowItWorks={() => db.setHowOpen(true)}
                />
              </>
            )}
          </main>
        </div>

        <BottomBar
          hasSleep={db.hasSleep}
          onSleep={() => db.setSleepOpen(true)}
          onActivity={() => db.openActivitySheet()}
          onHistory={() => db.setHistOpen(true)}
        />
      </div>

      {/* ── Overlays & sheets ── */}
      <SleepSheet
        open={db.sleepOpen}
        onClose={() => db.setSleepOpen(false)}
        onSave={db.handleSaveSleep}
        existing={db.record?.sleep ?? null}
        onHowItWorks={() => { db.setSleepOpen(false); db.setHowOpen(true); }}
      />
      <ActivitySheet
        open={db.actOpen}
        onClose={db.closeActivitySheet}
        onSave={db.handleSaveActivity}
        editActivity={db.editActivity}
        editDate={db.editDate}
      />
      <HistorySheet
        open={db.histOpen}
        onClose={() => db.setHistOpen(false)}
        week={db.week}
      />
      <HowItWorksModal
        open={db.howOpen}
        onClose={() => db.setHowOpen(false)}
      />

      {/* ── Timezone onboarding — shown on first login ── */}
      {db.needsOnboarding && (
        <TimezoneOnboarding onConfirm={db.handleConfirmTimezone} />
      )}
    </>
    </TimezoneContext.Provider>
  );
}
