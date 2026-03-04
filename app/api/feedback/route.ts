import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const feedback = db.prepare(`
      SELECT f.*, c.name as customer_name
      FROM feedback f
      LEFT JOIN customers c ON f.customer_id = c.id
      ORDER BY f.created_at DESC
    `).all();
    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customer_id, rating, comment, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO feedback (customer_id, rating, comment)
      VALUES (?, ?, ?)
    `).run(customer_id, rating, comment);
    
    if (userId) {
      await logAction(userId, 'SUBMIT_FEEDBACK', `Submitted feedback rating: ${rating}`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
