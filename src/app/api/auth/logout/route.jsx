import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.headers.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire immediately
      path: '/',
    })
  );

  return response;
}
