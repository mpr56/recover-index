import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDevSession } from '@/lib/devAuth';
import { authOptions } from '../auth/[...nextauth]';
import { addActivity } from '@/lib/store';
import { localDateStr } from '@/lib/dateUtils';
import { getUserTimezone } from '@/lib/userSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getDevSession() ?? (await getServerSession(req, res, authOptions));
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();

  const tz = getUserTimezone(session.user.id);
  const { date, category, subType, intensity, durationMins, timeOfDay, label } = req.body;
  if (!category || !subType || !intensity || !durationMins || !timeOfDay)
    return res.status(400).json({ error: 'category, subType, intensity, durationMins, timeOfDay required' });

  const record = addActivity(session.user.id, date ?? localDateStr(tz), {
    category, subType, intensity, durationMins, timeOfDay, label: label || subType,
  });
  return res.status(201).json(record);
}
