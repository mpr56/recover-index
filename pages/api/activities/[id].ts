import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { removeActivity, updateActivity } from '@/lib/store';
import { todayStr } from '@/lib/dateUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { id, date } = req.query as { id: string; date?: string };
  const targetDate = date ?? todayStr();

  if (req.method === 'DELETE') {
    const record = removeActivity(session.user.id, targetDate, id);
    return record ? res.status(200).json(record) : res.status(404).json({ error: 'Not found' });
  }

  if (req.method === 'PUT') {
    const { category, subType, intensity, durationMins, timeOfDay, label } = req.body;
    if (!category || !subType || !intensity || !durationMins || !timeOfDay)
      return res.status(400).json({ error: 'Missing required fields' });
    const record = updateActivity(session.user.id, targetDate, id, {
      category, subType, intensity, durationMins, timeOfDay, label: label || subType,
    });
    return record ? res.status(200).json(record) : res.status(404).json({ error: 'Not found' });
  }

  return res.status(405).end();
}
