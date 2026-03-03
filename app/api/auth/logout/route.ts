import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('user_session', '', {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
    partitioned: true,
    expires: new Date(0)
  });
  return response;
}
