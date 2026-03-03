import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  const inventory = db.prepare('SELECT * FROM inventory ORDER BY part_name ASC').all();
  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  const { part_name, sku, quantity, threshold, price, category, userId } = await request.json();
  
  try {
    const result = db.prepare(`
      INSERT INTO inventory (part_name, sku, quantity, threshold, price, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(part_name, sku, quantity, threshold, price, category);
    
    await logAction(userId, 'INVENTORY_ADD', `Added part: ${part_name} (SKU: ${sku})`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { id, quantity, userId } = await request.json();
  db.prepare('UPDATE inventory SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(quantity, id);
  
  const part = db.prepare('SELECT part_name FROM inventory WHERE id = ?').get(id) as any;
  await logAction(userId, 'INVENTORY_UPDATE', `Updated quantity for ${part.part_name} to ${quantity}`);
  
  return NextResponse.json({ success: true });
}
