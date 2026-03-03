import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const appointments = db.prepare(`
      SELECT a.*, c.name as customer_name, v.license_plate, v.model
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN vehicles v ON a.vehicle_id = v.id
      ORDER BY a.appointment_date ASC
    `).all();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customer_id, vehicle_id, date, time, service_type, notes, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO appointments (customer_id, vehicle_id, appointment_date, time_slot, service_type, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
    `).run(customer_id, vehicle_id, date, time, service_type, notes);
    
    if (userId) {
      await logAction(userId, 'CREATE_APPOINTMENT', `Created appointment for vehicle ID: ${vehicle_id}`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
