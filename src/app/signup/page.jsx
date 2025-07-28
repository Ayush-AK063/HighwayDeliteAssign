'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSendOTP = async () => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, dob }),
    });

    if (res.ok) {
      setStep(2);
    } else {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 md:px-6 md:py-12 bg-white">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Logo for both views */}
          <div className="mb-6 flex items-center justify-center md:justify-start space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full animate-spin" />
            <h1 className="text-lg md:text-xl font-bold text-gray-700">HD</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">Sign up</h2>
          <p className="text-sm md:text-base text-gray-500 mb-6 text-center md:text-left">
            Sign up to enjoy the feature of HD
          </p>

          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendOTP}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm md:text-base"
              >
                Get OTP
              </button>
              <p className="mt-4 text-xs md:text-sm text-center text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter the OTP"
                className="w-full px-4 py-2 mb-4 border rounded-md text-sm md:text-base focus:outline-none focus:ring focus:border-blue-300"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm md:text-base"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Image (Hidden on mobile) */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/img.png"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
