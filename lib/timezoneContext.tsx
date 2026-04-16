import { createContext, useContext } from 'react';
import { localDateStr, getLast7DaysForTz } from '@/lib/dateUtils';

interface TimezoneContextValue {
  timezone:    string;
  /** Today's date as YYYY-MM-DD in the user's timezone */
  todayStr:    () => string;
  /** Last 7 days (oldest first) in the user's timezone */
  last7Days:   () => string[];
}

export const TimezoneContext = createContext<TimezoneContextValue>({
  timezone:  'UTC',
  todayStr:  () => localDateStr('UTC'),
  last7Days: () => getLast7DaysForTz('UTC'),
});

/** Hook — call inside any component to get timezone-aware date helpers */
export function useTimezone(): TimezoneContextValue {
  return useContext(TimezoneContext);
}
