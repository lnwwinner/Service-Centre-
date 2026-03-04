import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { vehicle_id, category, userId } = await request.json();
    
    // Mock Diagnostic Logic
    const severity = Math.random() > 0.7 ? 'CRITICAL' : Math.random() > 0.4 ? 'WARNING' : 'INFO';
    
    let issues: { code: string; desc: string }[] = [];

    switch (category) {
      case 'Engine':
        issues = [
          { code: 'P0300', desc: 'Random/Multiple Cylinder Misfire Detected' },
          { code: 'P0171', desc: 'System Too Lean (Bank 1)' },
          { code: 'P0113', desc: 'Intake Air Temperature Sensor 1 Circuit High' }
        ];
        break;
      case 'Electrical':
        issues = [
          { code: 'B1421', desc: 'Solar Sensor Circuit (Passenger Side)' },
          { code: 'C1201', desc: 'Engine Control System Malfunction' },
          { code: 'U0100', desc: 'Lost Communication With ECM/PCM "A"' }
        ];
        break;
      case 'Brake':
        issues = [
          { code: 'C0200', desc: 'Right Front Wheel Speed Sensor Signal Malfunction' },
          { code: 'C1241', desc: 'Low Battery Positive Voltage' },
          { code: 'C1223', desc: 'ABS Control System Malfunction' }
        ];
        break;
      case 'Suspension':
        issues = [
          { code: 'C1712', desc: 'Left Rear Height Control Sensor Circuit' },
          { code: 'C1735', desc: 'Exhaust Solenoid Valve Circuit' }
        ];
        break;
      case 'Exhaust':
        issues = [
          { code: 'P0420', desc: 'Catalyst System Efficiency Below Threshold (Bank 1)' },
          { code: 'P0401', desc: 'Exhaust Gas Recirculation Flow Insufficient' }
        ];
        break;
      case 'Safety':
        issues = [
          { code: 'B0001', desc: 'Driver Frontal Stage 1 Deployment Control' },
          { code: 'B1000', desc: 'Center Airbag Sensor Assembly' }
        ];
        break;
      default:
        issues = [{ code: 'UNKNOWN', desc: 'Unknown System Error' }];
    }
    
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
