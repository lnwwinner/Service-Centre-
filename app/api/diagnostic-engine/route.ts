import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

// Mock Diagnostic Engine Logic
function analyzeDTC(dtc: string) {
  const dtcDatabase: Record<string, { desc: string; severity: string; recommendation: string }> = {
    'P0300': { desc: 'Random/Multiple Cylinder Misfire Detected', severity: 'CRITICAL', recommendation: 'Check spark plugs, ignition coils, and fuel injectors.' },
    'P0171': { desc: 'System Too Lean (Bank 1)', severity: 'WARNING', recommendation: 'Inspect MAF sensor, vacuum leaks, and fuel pressure.' },
    'P0420': { desc: 'Catalyst System Efficiency Below Threshold', severity: 'WARNING', recommendation: 'Check O2 sensors and catalytic converter.' },
    'C1201': { desc: 'Engine Control System Malfunction', severity: 'WARNING', recommendation: 'Check engine control module and sensors.' },
    'B1421': { desc: 'Solar Sensor Circuit (Passenger Side)', severity: 'INFO', recommendation: 'Inspect solar sensor and wiring.' },
    // Add more codes as needed
  };

  return dtcDatabase[dtc] || { desc: 'Unknown Error', severity: 'INFO', recommendation: 'Consult service manual.' };
}

export async function POST(request: Request) {
  try {
    const { vehicle_id, dtc_codes, sensor_data, userId } = await request.json();
    
    const issues = dtc_codes.map((code: string) => {
      const analysis = analyzeDTC(code);
      return { code, ...analysis };
    });

    const severity = issues.some((i: any) => i.severity === 'CRITICAL') ? 'CRITICAL' : 
                     issues.some((i: any) => i.severity === 'WARNING') ? 'WARNING' : 'INFO';

    const recommendation = issues.map((i: any) => i.recommendation).join(' ');

    // Save Report
    const result = db.prepare(`
      INSERT INTO diagnostic_reports (vehicle_id, category, data, severity, recommendation)
      VALUES (?, ?, ?, ?, ?)
    `).run(vehicle_id, 'Full Scan', JSON.stringify({ issues, sensor_data }), severity, recommendation);

    // Create Service Recommendation if Critical/Warning
    if (severity !== 'INFO') {
       // Logic to auto-create a recommended service job could go here
    }

    if (userId) {
      await logAction(userId, 'DIAGNOSTIC_ENGINE', `Analyzed ${dtc_codes.length} DTCs for vehicle ${vehicle_id}`);
    }
    
    return NextResponse.json({ 
      id: result.lastInsertRowid,
      severity,
      issues,
      recommendation
    });
  } catch (error) {
    return NextResponse.json({ error: 'Diagnostic Engine Failed' }, { status: 500 });
  }
}
