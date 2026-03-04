import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  try {
    let query = 'SELECT * FROM vehicles';
    let params: any[] = [];

    if (customerId) {
      query += ' WHERE customer_id = ?';
      params.push(customerId);
    }

    const vehicles = db.prepare(query).all(...params);
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}
