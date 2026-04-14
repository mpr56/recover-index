import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getRecordsInRange, getRecordByDate } from '@/lib/store';
import { calculateRecovery } from '@/lib/algorithm';
import { getLast7Days } from '@/lib/dateUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const days    = getLast7Days();
  const allRecs = getRecordsInRange(session.user.id, days[0], days[days.length - 1]);
  const week = days.map(date => {
    const rec = getRecordByDate(session.user.id, date);
    if (!rec || (!rec.sleep && rec.activities.length === 0)) return { date, score: null, status: null };
    const history = allRecs.filter(r => r.date < date);
    const result  = calculateRecovery(rec, history);
    return { date, score: result.score, status: result.status };
  });
  return res.status(200).json(week);
}
