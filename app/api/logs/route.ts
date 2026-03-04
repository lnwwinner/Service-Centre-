import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
