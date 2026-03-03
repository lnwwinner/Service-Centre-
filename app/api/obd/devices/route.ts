import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const devices = db.prepare('SELECT * FROM obd_devices ORDER BY last_seen DESC').all();
  return NextResponse.json(devices);
}

export async function POST(request: Request) {
  const { name, type, connection_string, userId } = await request.json();
  
  try {
    const result = db.prepare(`
      INSERT INTO obd_devices (name, type, connection_string, status, last_seen)
      VALUES (?, ?, ?, 'DISCONNECTED', CURRENT_TIMESTAMP)
    `).run(name, type, connection_string);
    
    await logAction(userId, 'OBD_REGISTER', `Registered OBD device: ${name} (${type})`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { id, status, userId } = await request.json();
  
  db.prepare('UPDATE obd_devices SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, id);
    
  await logAction(userId, 'OBD_STATUS_CHANGE', `OBD Device ${id} status changed to ${status}`);
  return NextResponse.json({ success: true });
}
