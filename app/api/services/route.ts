import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const services = db.prepare(`
    SELECT s.*, v.license_plate, v.vin 
    FROM service_history s 
    JOIN vehicles v ON s.vehicle_id = v.id
    ORDER BY s.date DESC
  `).all();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { vehicle_id, details, branch_id, userId } = await request.json();
  const result = db.prepare('INSERT INTO service_history (vehicle_id, details, branch_id) VALUES (?, ?, ?)')
    .run(vehicle_id, details, branch_id);
  
  await logAction(userId, 'CREATE_SERVICE', `Added service record for vehicle ID: ${vehicle_id}`);
  return NextResponse.json({ id: result.lastInsertRowid });
}
