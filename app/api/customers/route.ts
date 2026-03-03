import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const { name, contact, userId } = await request.json();
  const result = db.prepare('INSERT INTO customers (name, contact) VALUES (?, ?)').run(name, contact);
  
  // Log the action (Gate Layer requirement)
  db.prepare('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)').run(
    userId, 
    'CREATE_CUSTOMER', 
    `Created customer: ${name} (ID: ${result.lastInsertRowid})`
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}
