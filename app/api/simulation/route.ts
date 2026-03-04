import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { action, sessionId, config, errorType } = await request.json();

    if (action === 'START_SESSION') {
      const result = db.prepare(`
        INSERT INTO simulation_sessions (name, status, config)
        VALUES (?, ?, ?)
      `).run(`Session-${Date.now()}`, 'RUNNING', JSON.stringify(config || {}));
      
      // Log the action
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('SIMULATION_START', 1, `Started simulation session ${result.lastInsertRowid}`, 'SYSTEM');

      return NextResponse.json({ id: result.lastInsertRowid, status: 'RUNNING' });
    }

    if (action === 'STOP_SESSION') {
      db.prepare(`
        UPDATE simulation_sessions SET status = 'STOPPED' WHERE id = ?
      `).run(sessionId);
      
      // Log the action
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('SIMULATION_STOP', 1, `Stopped simulation session ${sessionId}`, 'SYSTEM');

      return NextResponse.json({ status: 'STOPPED' });
    }

    if (action === 'INJECT_ERROR') {
      // Log the error injection
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('SIMULATION_ERROR_INJECTION', 1, `Injected error ${errorType} into session ${sessionId}`, 'SYSTEM');

      return NextResponse.json({ success: true, message: `Error ${errorType} injected into session ${sessionId}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = db.prepare('SELECT * FROM simulation_sessions ORDER BY created_at DESC LIMIT 10').all();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
