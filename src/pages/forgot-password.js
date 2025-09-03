import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        body, html, #__next {
          height: 100%;
          margin: 0;
          font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            'linear-gradient(135deg, #0f172a, #1e293b, #0f172a, #1e293b)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      >
        <form
          onSubmit={handleReset}
          className="bg-[#0f172a] bg-opacity-80 p-6 sm:p-10 md:p-16 lg:p-20 rounded-2xl shadow-[0_0_40px_#00e6ff] border border-[#00e6ff] w-full max-w-md sm:max-w-xl md:max-w-3xl text-white space-y-6 sm:space-y-8 md:space-y-10 animate-float"
        >
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            🔒 Reset Password
          </h1>

          <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg">
            Enter your email and we’ll send you a link to reset your password.
          </p>

          {/* Messages */}
          {message && (
            <p className="text-green-500 text-center bg-green-900/30 p-3 rounded text-sm sm:text-base md:text-lg font-semibold">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center bg-red-900/30 p-3 rounded text-sm sm:text-base md:text-lg font-semibold">
              {error}
            </p>
          )}

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 sm:p-5 md:p-6 rounded-xl border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl focus:ring-4 focus:ring-emerald-500 outline-none transition"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-3 sm:py-4 md:py-5 rounded-xl text-lg sm:text-xl md:text-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Send Reset Link
          </button>

          {/* Back to login */}
          <p className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
            Remembered your password?{' '}
            <span
              className="text-emerald-400 hover:underline cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
