import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const userCookie = (request as any).cookies.get('user_session');
  
  if (!userCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const userData = JSON.parse(userCookie.value);
    return NextResponse.json({ authenticated: true, user: userData });
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
