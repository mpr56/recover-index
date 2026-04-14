import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function ensure() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
}

export function getAllUsers(): User[] {
  ensure();
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

export function getUserByEmail(email: string): User | null {
  return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserById(id: string): User | null {
  return getAllUsers().find(u => u.id === id) ?? null;
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const users = getAllUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already in use');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user: User = { id: uuidv4(), email, name, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
