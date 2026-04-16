import { useState, useEffect } from 'react';
import GlassSurface from '@/components/GlassSurface';
import { formatTimezoneLabel } from '@/lib/dateUtils';
import { timezoneOnboardingStyles as s } from './TimezoneOnboarding.styles';

// A curated list of common IANA timezones grouped by region.
// Covers the vast majority of users without an overwhelming dropdown.
const TIMEZONE_GROUPS: { label: string; zones: string[] }[] = [
  { label: 'Australia & NZ', zones: [
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Adelaide', 'Australia/Perth', 'Australia/Darwin',
    'Australia/Hobart', 'Pacific/Auckland',
  ]},
  { label: 'Asia', zones: [
    'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong',
    'Asia/Singapore', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Kolkata',
    'Asia/Karachi', 'Asia/Dubai', 'Asia/Riyadh',
  ]},
  { label: 'Europe', zones: [
    'Europe/London', 'Europe/Dublin', 'Europe/Lisbon', 'Europe/Madrid',
    'Europe/Paris', 'Europe/Rome', 'Europe/Berlin', 'Europe/Amsterdam',
    'Europe/Stockholm', 'Europe/Helsinki', 'Europe/Athens',
    'Europe/Moscow',
  ]},
  { label: 'Americas', zones: [
    'America/New_York', 'America/Chicago', 'America/Denver',
    'America/Los_Angeles', 'America/Phoenix', 'America/Anchorage',
    'Pacific/Honolulu', 'America/Toronto', 'America/Vancouver',
    'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Mexico_City',
  ]},
  { label: 'Africa & Middle East', zones: [
    'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos',
    'Africa/Nairobi',
  ]},
  { label: 'UTC', zones: ['UTC'] },
];

interface Props {
  onConfirm: (tz: string) => Promise<void>;
}

export default function TimezoneOnboarding({ onConfirm }: Props) {
  const [detected,  setDetected]  = useState('UTC');
  const [selected,  setSelected]  = useState('UTC');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  // Auto-detect the browser's timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        setDetected(tz);
        setSelected(tz);
      }
    } catch {
      // Fall back to UTC silently
    }
  }, []);

  const handleConfirm = async () => {
    setError('');
    setSaving(true);
    try {
      await onConfirm(selected);
    } catch {
      setError('Failed to save timezone. Please try again.');
      setSaving(false);
    }
  };

  const friendlyLabel = formatTimezoneLabel(selected);

  return (
    <div style={s.overlay}>
      <GlassSurface borderRadius={24} backgroundOpacity={0.1} blur={24} style={s.card}>

        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoMark}>R</div>
          <span style={s.logoLabel}>RecoveryIndex</span>
        </div>

        <p style={s.title}>One quick thing 🌍</p>
        <p style={s.subtitle}>
          We need your timezone so your daily scores and logs always
          reflect your local midnight — not the server's clock.
        </p>

        {/* Detected timezone display */}
        <div style={s.detectedBox}>
          <p style={s.detectedLabel}>Detected timezone</p>
          <p style={s.detectedValue}>{friendlyLabel}</p>
          <p style={s.detectedIana}>{selected}</p>
        </div>

        {/* Manual override dropdown */}
        <div style={s.changeRow}>
          <span style={s.changeLabel}>Not right?</span>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={s.select}
          >
            {TIMEZONE_GROUPS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.zones.map(tz => (
                  <option key={tz} value={tz}>
                    {tz.split('/').pop()?.replace(/_/g, ' ')} — {tz}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          onClick={handleConfirm}
          disabled={saving}
          style={{
            ...s.confirmBtn,
            ...(saving ? s.confirmBtnDisabled : {}),
          }}
        >
          {saving ? (
            <span style={{ width: 16, height: 16, border: '2px solid rgba(15,26,46,0.2)', borderTopColor: '#0f1a2e', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <>✓ Looks right, continue</>
          )}
        </button>

        {error && <p style={s.errorText}>{error}</p>}
      </GlassSurface>
    </div>
  );
}
