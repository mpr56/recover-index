import { useState, useEffect, useRef } from 'react';
import type { SleepEntry, SleepQuality } from '@/lib/types';

interface Props {
  existing:  SleepEntry | null;
  open:      boolean;
  todayStr:  () => string;
}

function computeHours(bedtime: string, wakeTime: string): number | null {
  if (!bedtime || !wakeTime) return null;
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  const h = Math.round((mins / 60) * 2) / 2;
  return h > 0 && h <= 12 ? h : null;
}

export function useSleepForm({ existing, open, todayStr }: Props) {
  const [date,     setDate]     = useState(() => todayStr());
  const [hours,    setHours]    = useState(7.5);
  const [quality,  setQuality]  = useState<SleepQuality>('okay');
  const [bedtime,  setBedtimeRaw]  = useState('');
  const [wakeTime, setWakeTimeRaw] = useState('');
  const [saving,   setSaving]   = useState(false);

  // Track whether the slider was moved manually after times were set
  const manualOverride = useRef(false);

  // Reset whenever sheet opens or existing changes
  useEffect(() => {
    manualOverride.current = false;
    // Always recompute today at open time — todayStr() uses the live timezone
    if (existing) {
      setDate(todayStr());
      setHours(existing.hours);
      setQuality(existing.quality);
      setBedtimeRaw(existing.bedtime  ?? '');
      setWakeTimeRaw(existing.wakeTime ?? '');
    } else {
      setDate(todayStr());
      setHours(7.5); setQuality('okay');
      setBedtimeRaw(''); setWakeTimeRaw('');
    }
  }, [existing, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrap setters so changing times always recomputes hours immediately
  const setBedtime = (v: string) => {
    manualOverride.current = false;
    setBedtimeRaw(v);
    // Compute against current wakeTime
    setWakeTimeRaw(prev => {
      const computed = computeHours(v, prev);
      if (computed !== null) setHours(computed);
      return prev;
    });
  };

  const setWakeTime = (v: string) => {
    manualOverride.current = false;
    setWakeTimeRaw(v);
    // Compute against current bedtime
    setBedtimeRaw(prev => {
      const computed = computeHours(prev, v);
      if (computed !== null) setHours(computed);
      return prev;
    });
  };

  const setHoursManual = (v: number) => {
    manualOverride.current = true;
    setHours(v);
  };

  const buildPayload = (): SleepEntry => ({
    hours, quality,
    bedtime:  bedtime  || undefined,
    wakeTime: wakeTime || undefined,
  });

  return {
    date, setDate,
    hours, setHours: setHoursManual,
    quality, setQuality,
    bedtime, setBedtime,
    wakeTime, setWakeTime,
    saving, setSaving,
    buildPayload,
  };
}