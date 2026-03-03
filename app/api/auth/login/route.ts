import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';
import { logAction } from '@/lib/logger';

initDb();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = ? AND u.password = ?
    `).get(username, password) as any;

    if (user) {
      const response = NextResponse.json({ 
        success: true, 
        user: { id: user.id, username: user.username, role: user.role_name } 
      });
      
      // Set a mock session cookie
      response.cookies.set('user_session', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role_name
      }), {
        httpOnly: false, // Allow client-side access for UI
        secure: true,
        sameSite: 'none',
        path: '/',
        partitioned: true, // Support for third-party context (iframes)
        maxAge: 60 * 60 * 24 // 1 day
      });

      await logAction(user.id, 'LOGIN', `User ${username} logged in successfully`);

      return response;
    }

    return NextResponse.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
