import { useState } from 'react';
import type { ActivityCategory, ActivitySubType, ActivityIntensity, Activity } from '@/lib/types';
import { getSubTypeOptions } from '@/lib/types';
import { activityWeightedLoad, activityBaseLoad, timeOfDayMultiplier } from '@/lib/algorithm';
import { nowTimeStr, todayStr } from '@/lib/dateUtils';

export function useActivityForm(initial: Activity | null = null) {
  const [date,         setDate]         = useState(todayStr());
  const [category,     setCategory]     = useState<ActivityCategory>(initial?.category ?? 'gym');
  const [subType,      setSubType]      = useState<ActivitySubType>(initial?.subType ?? 'push');
  const [intensity,    setIntensity]    = useState<ActivityIntensity>(initial?.intensity ?? 'moderate');
  const [durationMins, setDurationMins] = useState(initial?.durationMins ?? 60);
  const [timeOfDay,    setTimeOfDay]    = useState(initial?.timeOfDay ?? nowTimeStr());
  const [saving,       setSaving]       = useState(false);

  // When category changes, auto-select the first sub-type in that category
  const handleCategoryChange = (cat: ActivityCategory) => {
    setCategory(cat);
    const options = getSubTypeOptions(cat);
    if (options.length > 0) setSubType(options[0].value);
  };

  const reset = () => {
    setDate(todayStr());
    setCategory('gym');
    setSubType('push');
    setIntensity('moderate');
    setDurationMins(60);
    setTimeOfDay(nowTimeStr());
  };

  // Live load preview
  const previewActivity: Activity = {
    id: 'preview', category, subType, intensity,
    durationMins, timeOfDay, label: subType,
  };

  const baseLoad     = Math.round(activityBaseLoad(previewActivity));
  const weightedLoad = Math.round(activityWeightedLoad(previewActivity));
  const timeMult     = Math.round(timeOfDayMultiplier(timeOfDay) * 100) / 100;

  const buildPayload = (): Omit<Activity, 'id'> => ({
    category,
    subType,
    intensity,
    durationMins,
    timeOfDay,
    label: subType,
  });

  return {
    date, setDate,
    category, handleCategoryChange,
    subType, setSubType,
    intensity, setIntensity,
    durationMins, setDurationMins,
    timeOfDay, setTimeOfDay,
    saving, setSaving,
    reset,
    buildPayload,
    preview: { baseLoad, weightedLoad, timeMult },
  };
}
