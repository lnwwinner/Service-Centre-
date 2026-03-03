import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  const customizations = db.prepare('SELECT * FROM customizations WHERE vehicle_id = ?').all(vehicleId);
  return NextResponse.json(customizations);
}

export async function POST(request: Request) {
  const { vehicle_id, feature, value, userId } = await request.json();
  
  const existing = db.prepare('SELECT id FROM customizations WHERE vehicle_id = ? AND feature = ?')
    .get(vehicle_id, feature) as any;
    
  if (existing) {
    db.prepare('UPDATE customizations SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(value, existing.id);
  } else {
    db.prepare('INSERT INTO customizations (vehicle_id, feature, value) VALUES (?, ?, ?)')
      .run(vehicle_id, feature, value);
  }
  
  await logAction(userId, 'CUSTOMIZE_UPDATE', `Updated ${feature} to ${value} for vehicle ${vehicle_id}`);
  
  return NextResponse.json({ success: true });
}
