import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  const { device_id, vehicle_id, command, response } = await request.json();
  
  // Log to immutable logs
  db.prepare(`
    INSERT INTO obd_logs (device_id, vehicle_id, command, response)
    VALUES (?, ?, ?, ?)
  `).run(device_id, vehicle_id, command, JSON.stringify(response));
  
  // Update device last seen
  db.prepare('UPDATE obd_devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?').run(device_id);
  
  return NextResponse.json({ success: true });
}
