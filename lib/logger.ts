import db from '@/lib/db';

export async function logAction(userId: number, action: string, details: string) {
  try {
    db.prepare('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)')
      .run(userId, action, details);
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}
