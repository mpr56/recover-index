import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getDevSession } from '@/lib/devAuth';
import { getSettings, saveSettings } from '@/lib/userSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getDevSession() ?? (await getServerSession(req, res, authOptions));
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const settings = getSettings(session.user.id);
    // Return settings or signal that onboarding is needed
    return res.status(200).json({
      settings,
      needsOnboarding: settings === null,
    });
  }

  if (req.method === 'POST') {
    const { timezone } = req.body;
    if (!timezone || typeof timezone !== 'string') {
      return res.status(400).json({ error: 'timezone is required' });
    }
    // Validate it's a real IANA timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch {
      return res.status(400).json({ error: `Invalid timezone: ${timezone}` });
    }
    const saved = saveSettings(session.user.id, { timezone });
    return res.status(200).json(saved);
  }

  return res.status(405).end();
}
