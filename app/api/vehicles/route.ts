import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const vehicles = db.prepare(`
      SELECT v.*, c.name as customer_name 
      FROM vehicles v 
      JOIN customers c ON v.customer_id = c.id 
      ORDER BY v.created_at DESC
    `).all();
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vin, license_plate, model, year, customer_id, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO vehicles (vin, license_plate, model, year, customer_id) 
      VALUES (?, ?, ?, ?, ?)
    `).run(vin, license_plate, model, year, customer_id);
    
    if (userId) {
      await logAction(userId, 'CREATE_VEHICLE', `Registered vehicle: ${license_plate} (${model})`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
