import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    const inventory = db.prepare('SELECT * FROM inventory ORDER BY updated_at DESC').all();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { part_name, sku, quantity, price, category, userId } = await request.json();
    
    const result = db.prepare(`
      INSERT INTO inventory (part_name, sku, quantity, price, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(part_name, sku, quantity, price, category);
    
    if (userId) {
      await logAction(userId, 'ADD_INVENTORY', `Added part: ${part_name} (${sku})`);
    }
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add inventory' }, { status: 500 });
  }
}
