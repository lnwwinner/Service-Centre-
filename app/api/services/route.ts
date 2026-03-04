import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const services = db.prepare(`
      SELECT s.*, v.license_plate, v.model, c.name as customer_name
      FROM service_history s
      JOIN vehicles v ON s.vehicle_id = v.id
      JOIN customers c ON v.customer_id = c.id
      ORDER BY s.service_date DESC
    `).all();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vehicle_id, description, mileage, cost, technician_name } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO service_history (vehicle_id, description, mileage, cost, technician_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(vehicle_id, description, mileage, cost, technician_name);
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service record' }, { status: 500 });
  }
}
