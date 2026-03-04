import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const logs = db.prepare(`
      SELECT l.*, u.username 
      FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.timestamp DESC
      LIMIT 100
    `).all();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, action, details } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await logAction(userId, action, details || '');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }
}
