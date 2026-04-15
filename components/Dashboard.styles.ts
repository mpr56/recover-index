import type React from 'react';

export const dashboardStyles = {
  silkLayer: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 0,
  } satisfies React.CSSProperties,

  page: {
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '100vh',
    color: '#fff',
  } satisfies React.CSSProperties,

  inner: {
    maxWidth: 440,
    margin: '0 auto',
    padding: '0 16px',
  } satisfies React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0 16px',
  } satisfies React.CSSProperties,

  headerGreeting: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 1,
  } satisfies React.CSSProperties,

  headerName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  } satisfies React.CSSProperties,

  main: {
    paddingBottom: 96,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  } satisfies React.CSSProperties,

  loader: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
    marginTop: 100,
  } satisfies React.CSSProperties,

  spinner: {
    width: 36, height: 36,
    border: '2px solid rgba(99,102,241,0.2)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  } satisfies React.CSSProperties,

  loaderText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
  } satisfies React.CSSProperties,

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 14,
    marginTop: 48,
    textAlign: 'center' as const,
  } satisfies React.CSSProperties,

  emptyTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
  } satisfies React.CSSProperties,

  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    maxWidth: 260,
  } satisfies React.CSSProperties,

  emptyActions: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  } satisfies React.CSSProperties,

  emptyBtn: (accent: boolean): React.CSSProperties => ({
    padding: '12px 20px',
    borderRadius: 14,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 700,
    background: accent ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.08)',
    color: '#fff',
  }),

  // Score card
  scoreCard: {
    padding: '28px 24px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  } satisfies React.CSSProperties,

  scoreDateLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 12,
  } satisfies React.CSSProperties,

  scoreRecommendation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center' as const,
    maxWidth: 260,
    marginBottom: 8,
  } satisfies React.CSSProperties,

  chipRow: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  } satisfies React.CSSProperties,

  // Stats grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  } satisfies React.CSSProperties,

  statCard: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  statLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 6,
  } satisfies React.CSSProperties,

  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1,
  } satisfies React.CSSProperties,

  statSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  } satisfies React.CSSProperties,

  // Tomorrow projection
  tomorrowCard: {
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,

  tomorrowLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  } satisfies React.CSSProperties,

  tomorrowValue: (hex: string): React.CSSProperties => ({
    fontSize: 28,
    fontWeight: 900,
    color: hex,
  }),

  // Activities section
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } satisfies React.CSSProperties,

  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  } satisfies React.CSSProperties,

  addActivityBtn: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  } satisfies React.CSSProperties,

  activityItem: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  } satisfies React.CSSProperties,

  activityLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } satisfies React.CSSProperties,

  activityIcon: {
    fontSize: 20,
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies React.CSSProperties,

  activityName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  } satisfies React.CSSProperties,

  activityMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 1,
  } satisfies React.CSSProperties,

  activityRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } satisfies React.CSSProperties,

  activityLoad: {
    fontSize: 13,
    fontWeight: 700,
    color: '#818cf8',
  } satisfies React.CSSProperties,

  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontFamily: 'inherit',
    padding: '0 4px',
    lineHeight: 1,
  } satisfies React.CSSProperties,

  emptyActivities: {
    padding: '20px',
    textAlign: 'center' as const,
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
  } satisfies React.CSSProperties,

  // Advice card
  adviceCard: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  adviceText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.5,
  } satisfies React.CSSProperties,

  // Trend card
  trendCard: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  trendHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } satisfies React.CSSProperties,

  trendViewAll: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties,

  // Bottom bar
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0, left: 0, right: 0,
    zIndex: 30,
    display: 'flex',
    transform: 'translateZ(0)',
    willChange: 'transform',
    WebkitBackfaceVisibility: 'hidden' as const,
  } satisfies React.CSSProperties,

  bottomBarBtn: (accent?: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '17px 0',
    background: 'rgba(10,12,20,0.82)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderBottom: 'none',
    color: accent ? '#fff' : 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: accent ? 700 : 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: accent ? '-0.01em' : 'normal',
  }),

  editLogLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    fontFamily: 'inherit',
    textAlign: 'center' as const,
    padding: '4px 0',
  } satisfies React.CSSProperties,
};
