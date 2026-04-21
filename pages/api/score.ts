import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getDevSession } from '@/lib/devAuth';
import { getRecordByDate, getRecordsInRange } from '@/lib/store';
import { calculateRecovery } from '@/lib/algorithm';
import { localDateStr, localDateOffset } from '@/lib/dateUtils';
import { getUserTimezone } from '@/lib/userSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getDevSession() ?? (await getServerSession(req, res, authOptions));
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const tz     = getUserTimezone(session.user.id);
  const date   = (req.query.date as string) || localDateStr(tz);
  const record = getRecordByDate(session.user.id, date);
  if (!record) return res.status(404).json({ error: 'No record for this date' });

  const pastDate = localDateOffset(tz, -42);
  const history  = getRecordsInRange(session.user.id, pastDate, date);
  return res.status(200).json(calculateRecovery(record, history));
}
