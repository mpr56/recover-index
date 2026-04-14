// ─── Top-level category ───────────────────────────────────────────────────────
export type ActivityCategory = 'sports' | 'gym' | 'hobby';
export type ActivityIntensity = 'easy' | 'moderate' | 'hard';
export type SleepQuality      = 'poor' | 'okay' | 'great';
export type RecoveryStatus    = 'excellent' | 'good' | 'moderate' | 'poor' | 'rest';

// ─── Sport sub-types ──────────────────────────────────────────────────────────
export type SportSubType =
  | 'football' | 'cricket'  | 'hockey'       | 'tennis'
  | 'volleyball'| 'table_tennis' | 'basketball' | 'baseball'
  | 'rugby'    | 'golf';

// ─── Gym sub-types ────────────────────────────────────────────────────────────
export type GymSubType =
  | 'push' | 'pull' | 'legs' | 'upper' | 'lower'
  | 'arms' | 'full_body' | 'cardio' | 'hiit' | 'powerlifting';

// ─── Hobby sub-types ─────────────────────────────────────────────────────────
export type HobbySubType =
  | 'hiking'    | 'cycling'      | 'swimming'     | 'yoga'
  | 'pilates'   | 'martial_arts' | 'dancing'       | 'rock_climbing'
  | 'rowing'    | 'skateboarding';

export type ActivitySubType = SportSubType | GymSubType | HobbySubType;

// ─── Activity ─────────────────────────────────────────────────────────────────
export interface Activity {
  id:           string;
  category:     ActivityCategory;
  subType:      ActivitySubType;
  intensity:    ActivityIntensity;
  durationMins: number;
  timeOfDay:    string; // "HH:MM" 24-hour
  label:        string;
}

// ─── Sleep ────────────────────────────────────────────────────────────────────
export interface SleepEntry {
  hours:     number;
  quality:   SleepQuality;
  bedtime?:  string;
  wakeTime?: string;
}

// ─── Day record ───────────────────────────────────────────────────────────────
export interface DayRecord {
  id:         string;
  userId:     string;
  date:       string;
  sleep:      SleepEntry | null;
  activities: Activity[];
  notes:      string;
  createdAt:  string;
  updatedAt:  string;
}

// ─── Algorithm outputs ────────────────────────────────────────────────────────
export interface ActivityBreakdown {
  activity:   Activity;
  load:       number;
  timeWeight: number;
}

export interface RecoveryResult {
  score:              number;
  sleepComponent:     number;
  fatigueDebt:        number;
  todayLoad:          number;
  activityBreakdown:  ActivityBreakdown[];
  tomorrowProjection: number;
  status:             RecoveryStatus;
  recommendation:     string;
  trainingAdvice:     string;
}

export interface WeekDay {
  date:   string;
  score:  number | null;
  status: RecoveryStatus | null;
}

// ─── Status config ────────────────────────────────────────────────────────────
export interface StatusConfig {
  label:     string;
  hex:       string;
  silkColor: string;
}

export const STATUS_CONFIG: Record<RecoveryStatus, StatusConfig> = {
  excellent: { label: 'Peak',       hex: '#34d399', silkColor: '#385916' },
  good:      { label: 'Good',       hex: '#4ade80', silkColor: '#245a2f' },
  moderate:  { label: 'Moderate',   hex: '#facc15', silkColor: '#665511' },
  poor:      { label: 'Tired',      hex: '#fb923c', silkColor: '#6d3111' },
  rest:      { label: 'Rest Today', hex: '#f87171', silkColor: '#6e1010' },
};

// ─── Sub-type metadata ────────────────────────────────────────────────────────
export interface SubTypeOption {
  value:       ActivitySubType;
  label:       string;
  icon:        string;
  description: string;
}

export const SPORT_OPTIONS: SubTypeOption[] = [
  { value: 'football',    label: 'Football',     icon: '⚽', description: 'Soccer / football' },
  { value: 'cricket',     label: 'Cricket',      icon: '🏏', description: 'Bat & ball' },
  { value: 'hockey',      label: 'Hockey',       icon: '🏑', description: 'Field or ice' },
  { value: 'tennis',      label: 'Tennis',       icon: '🎾', description: 'Court tennis' },
  { value: 'volleyball',  label: 'Volleyball',   icon: '🏐', description: 'Beach or indoor' },
  { value: 'table_tennis',label: 'Table Tennis', icon: '🏓', description: 'Ping pong' },
  { value: 'basketball',  label: 'Basketball',   icon: '🏀', description: 'Half or full court' },
  { value: 'baseball',    label: 'Baseball',     icon: '⚾', description: 'Bat & ball' },
  { value: 'rugby',       label: 'Rugby',        icon: '🏉', description: 'Union or league' },
  { value: 'golf',        label: 'Golf',         icon: '⛳', description: '9 or 18 holes' },
];

export const GYM_OPTIONS: SubTypeOption[] = [
  { value: 'push',        label: 'Push',         icon: '💪', description: 'Chest / shoulders / triceps' },
  { value: 'pull',        label: 'Pull',         icon: '🔙', description: 'Back / biceps' },
  { value: 'legs',        label: 'Legs',         icon: '🦵', description: 'Quads / hamstrings / glutes' },
  { value: 'upper',       label: 'Upper Body',   icon: '🏋️', description: 'Push + pull combined' },
  { value: 'lower',       label: 'Lower Body',   icon: '⬇️', description: 'Legs + posterior chain' },
  { value: 'arms',        label: 'Arms',         icon: '💪', description: 'Biceps / triceps isolation' },
  { value: 'full_body',   label: 'Full Body',    icon: '🔄', description: 'Everything' },
  { value: 'cardio',      label: 'Cardio',       icon: '🏃', description: 'Running / cycling / machine' },
  { value: 'hiit',        label: 'HIIT',         icon: '⚡', description: 'High-intensity intervals' },
  { value: 'powerlifting',label: 'Powerlifting', icon: '🏆', description: 'Squat / bench / deadlift max' },
];

export const HOBBY_OPTIONS: SubTypeOption[] = [
  { value: 'hiking',        label: 'Hiking',        icon: '🥾', description: 'Trails / bush walks' },
  { value: 'cycling',       label: 'Cycling',       icon: '🚴', description: 'Road or mountain bike' },
  { value: 'swimming',      label: 'Swimming',      icon: '🏊', description: 'Laps or open water' },
  { value: 'yoga',          label: 'Yoga',          icon: '🧘', description: 'Flexibility & mindfulness' },
  { value: 'pilates',       label: 'Pilates',       icon: '🤸', description: 'Core & mobility' },
  { value: 'martial_arts',  label: 'Martial Arts',  icon: '🥋', description: 'BJJ / boxing / MMA' },
  { value: 'dancing',       label: 'Dancing',       icon: '💃', description: 'Any style' },
  { value: 'rock_climbing', label: 'Climbing',      icon: '🧗', description: 'Bouldering or routes' },
  { value: 'rowing',        label: 'Rowing',        icon: '🚣', description: 'Water or erg' },
  { value: 'skateboarding', label: 'Skating',       icon: '🛹', description: 'Skate / longboard' },
];

export const CATEGORY_OPTIONS: { value: ActivityCategory; label: string; icon: string }[] = [
  { value: 'sports', label: 'Sports',  icon: '🏆' },
  { value: 'gym',    label: 'Gym',     icon: '🏋️' },
  { value: 'hobby',  label: 'Hobby',   icon: '🎯' },
];

export const INTENSITIES: { value: ActivityIntensity; label: string; sub: string }[] = [
  { value: 'easy',     label: 'Easy',     sub: 'Light effort'  },
  { value: 'moderate', label: 'Moderate', sub: 'Challenging'   },
  { value: 'hard',     label: 'Hard',     sub: 'Max effort'    },
];

/** Lookup helper */
export function getSubTypeOptions(category: ActivityCategory): SubTypeOption[] {
  if (category === 'sports') return SPORT_OPTIONS;
  if (category === 'gym')    return GYM_OPTIONS;
  return HOBBY_OPTIONS;
}

export function getSubTypeLabel(subType: ActivitySubType): string {
  const all = [...SPORT_OPTIONS, ...GYM_OPTIONS, ...HOBBY_OPTIONS];
  return all.find(o => o.value === subType)?.label ?? subType;
}

export function getSubTypeIcon(subType: ActivitySubType): string {
  const all = [...SPORT_OPTIONS, ...GYM_OPTIONS, ...HOBBY_OPTIONS];
  return all.find(o => o.value === subType)?.icon ?? '🏃';
}
