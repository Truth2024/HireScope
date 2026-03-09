// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0, // Удаляет куку сразу
  };

  response.cookies.set('refreshToken', '', cookieOptions);
  // Если используете accessToken в куках, удалите и его
  response.cookies.set('accessToken', '', cookieOptions);

  return response;
}
