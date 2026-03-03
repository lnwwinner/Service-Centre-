import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const queue = db.prepare(`
      SELECT q.*, v.license_plate, v.model, a.service_type
      FROM job_queue q
      JOIN vehicles v ON q.vehicle_id = v.id
      LEFT JOIN appointments a ON q.appointment_id = a.id
      ORDER BY q.status = 'WAITING' DESC, q.start_time ASC
    `).all();
    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vehicle_id, appointment_id, bay_id, technician_name, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO job_queue (vehicle_id, appointment_id, status, bay_id, technician_name, start_time)
      VALUES (?, ?, 'WAITING', ?, ?, CURRENT_TIMESTAMP)
    `).run(vehicle_id, appointment_id, bay_id, technician_name);
    
    if (userId) {
      await logAction(userId, 'ADD_TO_QUEUE', `Added vehicle ${vehicle_id} to Bay ${bay_id}`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to queue' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, userId } = await request.json();
    
    db.prepare('UPDATE job_queue SET status = ? WHERE id = ?').run(status, id);
    
    if (userId) {
      await logAction(userId, 'UPDATE_QUEUE_STATUS', `Updated job ${id} status to ${status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update queue' }, { status: 500 });
  }
}
