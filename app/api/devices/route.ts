import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const devices = db.prepare('SELECT * FROM devices').all();
  return NextResponse.json(devices);
}

export async function POST(request: Request) {
  const { serial_number, model, userId } = await request.json();
  try {
    const result = db.prepare('INSERT INTO devices (serial_number, model, status) VALUES (?, ?, ?)')
      .run(serial_number, model, 'ACTIVE');
    
    await logAction(userId, 'DEVICE_REGISTER', `Registered device: ${serial_number}`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { id, userId } = await request.json();
  db.prepare('DELETE FROM devices WHERE id = ?').run(id);
  await logAction(userId, 'DEVICE_RESET', `Reset/Removed device ID: ${id}`);
  return NextResponse.json({ success: true });
}
