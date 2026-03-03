import db from '@/lib/db';

export async function logAction(userId: number, action: string, details: string, ip: string = '127.0.0.1') {
  try {
    const stmt = db.prepare('INSERT INTO logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)');
    stmt.run(userId, action, details, ip);
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}
