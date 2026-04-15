import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDevSession } from '@/lib/devAuth';
import { authOptions } from '../auth/[...nextauth]';
import { upsertSleep } from '@/lib/store';
import { todayStr } from '@/lib/dateUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session =
  getDevSession() ??
  (await getServerSession(req, res, authOptions));
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();
  const { date, hours, quality, bedtime, wakeTime } = req.body;
  if (hours == null || !quality) return res.status(400).json({ error: 'hours and quality required' });
  const record = upsertSleep(session.user.id, date ?? todayStr(), { hours, quality, bedtime, wakeTime });
  return res.status(200).json(record);
}
