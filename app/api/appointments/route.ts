import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');
  
  let query = 'SELECT a.*, v.license_plate, c.name as customer_name FROM appointments a JOIN vehicles v ON a.vehicle_id = v.id JOIN customers c ON a.customer_id = c.id';
  let params: any[] = [];
  
  if (customerId) {
    query += ' WHERE a.customer_id = ?';
    params.push(customerId);
  }
  
  query += ' ORDER BY a.appointment_date DESC, a.time_slot ASC';
  const appointments = db.prepare(query).all(...params);
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const { customer_id, vehicle_id, appointment_date, time_slot, service_type, notes, userId } = await request.json();
  
  try {
    const result = db.prepare(`
      INSERT INTO appointments (customer_id, vehicle_id, appointment_date, time_slot, service_type, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(customer_id, vehicle_id, appointment_date, time_slot, service_type, notes);
    
    await logAction(userId, 'APPOINTMENT_CREATE', `Created appointment for customer ${customer_id} on ${appointment_date}`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { id, status, userId } = await request.json();
  db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id);
  await logAction(userId, 'APPOINTMENT_UPDATE', `Updated appointment ${id} status to ${status}`);
  return NextResponse.json({ success: true });
}
