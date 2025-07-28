import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendOTP } from '@/lib/mailer';

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  if (!email) return NextResponse.json({ message: 'Email required' }, { status: 400 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now

  let user = await User.findOne({ email });

  if (!user) {
    // New user - create
    user = await User.create({ email, otp, otpExpiry });
  } else {
    // Existing user - update
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  }

  // Send OTP via email
  try {
    await sendOTP(email, otp);
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP sending error:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}