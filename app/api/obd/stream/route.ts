import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');

  if (!deviceId) {
    return new Response('Missing deviceId', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Simulate real-time OBD data
      const interval = setInterval(() => {
        const data = {
          timestamp: new Date().toISOString(),
          deviceId,
          metrics: {
            rpm: Math.floor(Math.random() * (3000 - 800) + 800),
            speed: Math.floor(Math.random() * 120),
            temp: Math.floor(Math.random() * (105 - 85) + 85),
            load: Math.floor(Math.random() * 100),
            voltage: (Math.random() * (14.5 - 12.5) + 12.5).toFixed(1),
            throttle: Math.floor(Math.random() * 100),
          }
        };
        sendEvent(data);
      }, 1000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
