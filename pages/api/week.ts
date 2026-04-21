import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDevSession } from '@/lib/devAuth';
import { authOptions } from './auth/[...nextauth]';
import { getRecordsInRange, getRecordByDate } from '@/lib/store';
import { calculateRecovery } from '@/lib/algorithm';
import { getLast7DaysForTz, localDateOffset } from '@/lib/dateUtils';
import { getUserTimezone } from '@/lib/userSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getDevSession() ?? (await getServerSession(req, res, authOptions));
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const tz   = getUserTimezone(session.user.id);
  const days = getLast7DaysForTz(tz);

  // Pull 42 days before the earliest displayed day so each score has enough
  // history to seed its Banister CTL (τ = 42d) correctly.
  const historyStart = localDateOffset(tz, -(6 + 42));
  const allRecs = getRecordsInRange(session.user.id, historyStart, days[days.length - 1]);

  const week = days.map(date => {
    const rec = getRecordByDate(session.user.id, date);
    if (!rec || (!rec.sleep && rec.activities.length === 0)) return { date, score: null, status: null };
    const history = allRecs.filter(r => r.date < date);
    const result  = calculateRecovery(rec, history);
    return { date, score: result.score, status: result.status };
  });

  return res.status(200).json(week);
}
