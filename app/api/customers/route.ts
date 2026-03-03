import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, contact, userId } = await request.json();
    
    const result = db.prepare('INSERT INTO customers (name, contact) VALUES (?, ?)').run(name, contact);
    
    if (userId) {
      await logAction(userId, 'CREATE_CUSTOMER', `Created customer: ${name}`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid, name, contact });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
