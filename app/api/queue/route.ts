import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const queue = db.prepare(`
    SELECT q.*, v.license_plate, v.vin, a.service_type 
    FROM job_queue q 
    JOIN vehicles v ON q.vehicle_id = v.id 
    LEFT JOIN appointments a ON q.appointment_id = a.id
    WHERE q.status != 'READY'
    ORDER BY q.start_time ASC
  `).all();
  return NextResponse.json(queue);
}

export async function POST(request: Request) {
  const { vehicle_id, appointment_id, bay_id, technician_name, userId } = await request.json();
  
  const result = db.prepare(`
    INSERT INTO job_queue (vehicle_id, appointment_id, bay_id, technician_name, start_time)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(vehicle_id, appointment_id, bay_id, technician_name);
  
  if (appointment_id) {
    db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run('IN_PROGRESS', appointment_id);
  }
  
  await logAction(userId, 'QUEUE_START', `Started job for vehicle ${vehicle_id} in bay ${bay_id}`);
  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PATCH(request: Request) {
  const { id, status, userId } = await request.json();
  
  const updateQuery = status === 'READY' 
    ? 'UPDATE job_queue SET status = ?, end_time = CURRENT_TIMESTAMP WHERE id = ?'
    : 'UPDATE job_queue SET status = ? WHERE id = ?';
    
  db.prepare(updateQuery).run(status, id);
  
  await logAction(userId, 'QUEUE_UPDATE', `Updated job ${id} status to ${status}`);
  return NextResponse.json({ success: true });
}
