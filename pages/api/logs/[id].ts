import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { deleteRecord } from '@/lib/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'DELETE') return res.status(405).end();
  const ok = deleteRecord(session.user.id, req.query.id as string);
  return ok ? res.status(204).end() : res.status(404).json({ error: 'Not found' });
}
