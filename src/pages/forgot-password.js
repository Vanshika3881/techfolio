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
      setMessage('Password reset email sent! Check your inbox.');
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
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, #0f172a, #1e293b, #0f172a, #1e293b)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          padding: '1.5rem',
        }}
      >
        <form
          onSubmit={handleReset}
          className="bg-[#0f172a] bg-opacity-80 p-20 rounded-4xl shadow-[0_0_60px_#00e6ff] border border-[#00e6ff] max-w-4xl w-full text-white space-y-10 animate-float"
        >
          <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            🔒 Reset Password
          </h1>
          <p className="text-center text-gray-300 text-lg mb-6">
            Enter your email and we’ll send you a link to reset your password.
          </p>

          {message && (
            <p className="text-green-600 text-center bg-green-900/30 p-3 rounded text-lg font-semibold">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center bg-red-900/30 p-3 rounded text-lg font-semibold">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-6 rounded-xl border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400 text-2xl focus:ring-4 focus:ring-emerald-500 outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-5 rounded-xl text-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Send Reset Link
          </button>

          <p className="text-center text-gray-400 text-lg">
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
