import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { type, connection_string, name, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO obd_devices (name, type, connection_string, status, last_seen)
      VALUES (?, ?, ?, 'CONNECTED', CURRENT_TIMESTAMP)
    `).run(name, type, connection_string);
    
    if (userId) {
      await logAction(userId, 'REGISTER_DEVICE', `Registered OBD Device: ${name} (${type})`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Device Registration Failed' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const devices = db.prepare('SELECT * FROM obd_devices ORDER BY last_seen DESC').all();
        return NextResponse.json(devices);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
    }
}
