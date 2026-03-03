import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const vehicles = db.prepare(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v 
    JOIN customers c ON v.customer_id = c.id
  `).all();
  return NextResponse.json(vehicles);
}

export async function POST(request: Request) {
  const { vin, license_plate, customer_id, userId } = await request.json();
  try {
    const result = db.prepare('INSERT INTO vehicles (vin, license_plate, customer_id) VALUES (?, ?, ?)')
      .run(vin, license_plate, customer_id);
    
    await logAction(userId, 'CREATE_VEHICLE', `Added vehicle VIN: ${vin}`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
