import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');

  try {
    const history = db.prepare(`
      SELECT * FROM service_history 
      WHERE vehicle_id = ? 
      ORDER BY date DESC
    `).all(vehicleId);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
