import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/lib/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  try {
    const user = await createUser(email, name, password);
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e: unknown) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Signup failed' });
  }
}
