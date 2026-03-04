import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID required' }, { status: 400 });
  }

  const customizations = db.prepare('SELECT * FROM customizations WHERE vehicle_id = ?').all(vehicleId);
  const keys = db.prepare('SELECT * FROM immobilizer_keys WHERE vehicle_id = ?').all(vehicleId);
  
  return NextResponse.json({
    customizations,
    keys
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, vehicle_id, userId } = body;

  try {
    if (action === 'UPDATE_FEATURE') {
      const { feature, value } = body;
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
    } 
    else if (action === 'KEY_REGISTRATION') {
      const { key_id } = body;
      db.prepare('INSERT INTO immobilizer_keys (vehicle_id, key_id, status) VALUES (?, ?, ?)')
        .run(vehicle_id, key_id, 'ACTIVE');
      await logAction(userId, 'KEY_REGISTER', `Registered new key ${key_id} for vehicle ${vehicle_id}`);
    }
    else if (action === 'IMMOBILIZER_RESET') {
      db.prepare('UPDATE immobilizer_keys SET status = ? WHERE vehicle_id = ?')
        .run('REVOKED', vehicle_id);
      await logAction(userId, 'IMMOBILIZER_RESET', `Reset immobilizer for vehicle ${vehicle_id}`);
    }
    else if (action === 'INJECTOR_CODING') {
      const { codes } = body; // Array of codes
      // Store as a customization entry for simplicity, or a dedicated table if needed
      const feature = 'INJECTOR_CODES';
      const value = JSON.stringify(codes);
      
      const existing = db.prepare('SELECT id FROM customizations WHERE vehicle_id = ? AND feature = ?')
        .get(vehicle_id, feature) as any;

      if (existing) {
        db.prepare('UPDATE customizations SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(value, existing.id);
      } else {
        db.prepare('INSERT INTO customizations (vehicle_id, feature, value) VALUES (?, ?, ?)')
          .run(vehicle_id, feature, value);
      }
      await logAction(userId, 'INJECTOR_CODING', `Updated injector codes for vehicle ${vehicle_id}`);
    }
    else if (action === 'SRS_RESET') {
      await logAction(userId, 'SRS_RESET', `Performed SRS Airbag Reset for vehicle ${vehicle_id}`);
      // In a real scenario, this would send a command to the OBD device
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Customization Error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
