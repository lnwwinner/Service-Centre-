import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  
  let query = 'SELECT * FROM diagnostic_reports';
  let params: any[] = [];
  
  if (vehicleId) {
    query += ' WHERE vehicle_id = ?';
    params.push(vehicleId);
  }
  
  query += ' ORDER BY created_at DESC';
  const reports = db.prepare(query).all(...params);
  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const { vehicle_id, category, data, severity, recommendation, userId } = await request.json();
  
  const result = db.prepare(`
    INSERT INTO diagnostic_reports (vehicle_id, category, data, severity, recommendation)
    VALUES (?, ?, ?, ?, ?)
  `).run(vehicle_id, category, JSON.stringify(data), severity, recommendation);
  
  await logAction(userId, 'DIAGNOSTIC_SUBMIT', `Submitted ${category} report for vehicle ${vehicle_id}`);
  
  return NextResponse.json({ id: result.lastInsertRowid });
}
