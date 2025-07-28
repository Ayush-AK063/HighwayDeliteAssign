import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  await connectDB();

  const token = req.cookies?.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) throw new Error('User not found');

    // Return both name and email for dashboard
    return NextResponse.json({ user: { name: user.name, email: user.email }, notes: user.notes || [] });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
