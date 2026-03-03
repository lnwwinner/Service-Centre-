import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { vehicle_id, category, userId } = await request.json();
    
    // Mock Diagnostic Logic
    const severity = Math.random() > 0.7 ? 'CRITICAL' : Math.random() > 0.4 ? 'WARNING' : 'INFO';
    const issues = [
      { code: 'P0300', desc: 'Random/Multiple Cylinder Misfire Detected' },
      { code: 'P0171', desc: 'System Too Lean (Bank 1)' },
      { code: 'C1201', desc: 'Engine Control System Malfunction' },
      { code: 'B1421', desc: 'Solar Sensor Circuit (Passenger Side)' }
    ];
    
    const detectedIssues = issues.filter(() => Math.random() > 0.5);
    const recommendation = severity === 'CRITICAL' ? 'Immediate Service Required' : 'Monitor Condition';
    
    const result = db.prepare(`
      INSERT INTO diagnostic_reports (vehicle_id, category, data, severity, recommendation)
      VALUES (?, ?, ?, ?, ?)
    `).run(vehicle_id, category, JSON.stringify(detectedIssues), severity, recommendation);
    
    if (userId) {
      await logAction(userId, 'RUN_DIAGNOSTIC', `Ran ${category} scan on vehicle ${vehicle_id}`);
    }
    
    return NextResponse.json({ 
      id: result.lastInsertRowid,
      severity,
      issues: detectedIssues,
      recommendation
    });
  } catch (error) {
    return NextResponse.json({ error: 'Diagnostic failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicle_id = searchParams.get('vehicle_id');
  
  if (vehicle_id) {
    const reports = db.prepare('SELECT * FROM diagnostic_reports WHERE vehicle_id = ? ORDER BY created_at DESC').all(vehicle_id);
    return NextResponse.json(reports);
  }
  
  return NextResponse.json([]);
}
