import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  let user; // Declare user in outer scope
  let token; // Declare token in outer scope
  try{
    await connectDB();
  }
   catch (error) {
    return NextResponse.json({ message: 'Database connection failed', error }, { status: 500 }); 
  }
  try {

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ message: 'Email and OTP required' }, { status: 400 });
  }

  user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Check OTP match and expiry
  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 401 });
  }
} catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  try {
  // OTP is valid — log the user in
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ message: 'JWT secret not set' }, { status: 500 });
  }
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
} catch (error) {
    return NextResponse.json({ message: 'Token generation failed', error }, { status: 500 });
  }

  // Clear OTP after verification
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Set cookie with token
  cookies().set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24,
  path: '/',
});

return NextResponse.json({ message: 'Logged in successfully' });
}
