import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { logAction } from '@/lib/logger';

export async function GET() {
  try {
    // Mock system stats
    const stats = {
      cpu: Math.floor(Math.random() * 30) + 10,
      memory: Math.floor(Math.random() * 20) + 40,
      dbStatus: 'CONNECTED',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    // Log monitoring check (optional, maybe only on errors)
    if (stats.cpu > 80) {
      await logAction(1, 'SYSTEM_ALERT', `High CPU usage detected: ${stats.cpu}%`);
    }

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Monitoring failed' }, { status: 500 });
  }
}
