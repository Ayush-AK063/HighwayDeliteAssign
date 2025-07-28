'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setStep(2);
    } else {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo & Heading */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 animate-spin border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <h1 className="font-semibold text-lg">HD</h1>
            </div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-gray-500 text-sm">Please login to continue to your account.</p>
          </div>

          {/* Email & OTP */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 2}
              />
            </div>

            {step === 2 && (
              <div>
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={handleSendOTP}>
                Resend OTP
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="keepLogged" className="accent-blue-600" />
              <label htmlFor="keepLogged" className="text-sm text-gray-600">Keep me logged in</label>
            </div>

            <button
              onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Please wait...' : step === 1 ? 'Send OTP' : 'Sign in'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Need an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">Create one</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/img.png" // <-- put image in /public/login-cover.jpg
          alt="cover"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
    </div>
  );
}
