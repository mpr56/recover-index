import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { removeActivity } from '@/lib/store';
import { todayStr } from '@/lib/dateUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'DELETE') return res.status(405).end();
  const { id, date } = req.query as { id: string; date?: string };
  const record = removeActivity(session.user.id, date ?? todayStr(), id);
  return record ? res.status(200).json(record) : res.status(404).json({ error: 'Not found' });
}
