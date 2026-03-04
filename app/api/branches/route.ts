import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const branches = db.prepare('SELECT * FROM branches').all();
    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, branchId, data } = await request.json();

    if (action === 'SYNC_DATA') {
      // In a real scenario, this would involve complex reconciliation
      // For this demo, we update the last_sync timestamp
      db.prepare('UPDATE branches SET last_sync = CURRENT_TIMESTAMP WHERE id = ?').run(branchId);
      
      // Log the sync to the immutable audit trail
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('BRANCH_SYNC', 1, `Synced data for branch ${branchId}`, 'SYSTEM');

      return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
    }

    if (action === 'REGISTER_BRANCH') {
      const { name, location } = data;
      const result = db.prepare(`
        INSERT INTO branches (name, location, status, last_sync)
        VALUES (?, ?, ?, ?)
      `).run(name, location, 'ACTIVE', null);
      
      return NextResponse.json({ id: result.lastInsertRowid });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Branch operation failed' }, { status: 500 });
  }
}
