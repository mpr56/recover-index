import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getRecordByDate, getRecordsInRange } from '@/lib/store';
import { calculateRecovery, } from '@/lib/algorithm';
import { getDateStr, todayStr } from '@/lib/dateUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const date   = (req.query.date as string) || todayStr();
  const record = getRecordByDate(session.user.id, date);
  if (!record) return res.status(404).json({ error: 'No record for this date' });
  const pastDate = getDateStr(-6);
  const history  = getRecordsInRange(session.user.id, pastDate, date);
  return res.status(200).json(calculateRecovery(record, history));
}
