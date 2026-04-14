import { useState, useEffect } from 'react';
import type { SleepEntry, SleepQuality } from '@/lib/types';
import { todayStr } from '@/lib/dateUtils';

interface Props { existing: SleepEntry | null; open: boolean; }

export function useSleepForm({ existing, open }: Props) {
  const [date,     setDate]     = useState(todayStr());
  const [hours,    setHours]    = useState(7.5);
  const [quality,  setQuality]  = useState<SleepQuality>('okay');
  const [bedtime,  setBedtime]  = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    if (existing) {
      setHours(existing.hours);
      setQuality(existing.quality);
      setBedtime(existing.bedtime  ?? '');
      setWakeTime(existing.wakeTime ?? '');
    } else {
      setHours(7.5); setQuality('okay'); setBedtime(''); setWakeTime('');
    }
  }, [existing, open]);

  // Auto-compute hours when both times are set
  useEffect(() => {
    if (!bedtime || !wakeTime) return;
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let sleepMins  = (wh * 60 + wm) - (bh * 60 + bm);
    if (sleepMins < 0) sleepMins += 24 * 60;
    const computed = Math.round((sleepMins / 60) * 2) / 2;
    if (computed > 0 && computed <= 12) setHours(computed);
  }, [bedtime, wakeTime]);

  const buildPayload = (): SleepEntry => ({
    hours, quality,
    bedtime:  bedtime  || undefined,
    wakeTime: wakeTime || undefined,
  });

  return {
    date, setDate,
    hours, setHours,
    quality, setQuality,
    bedtime, setBedtime,
    wakeTime, setWakeTime,
    saving, setSaving,
    buildPayload,
  };
}
