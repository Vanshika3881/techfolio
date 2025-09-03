import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { FaUser, FaLock } from 'react-icons/fa';

function getFriendlyErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials provided.';
    default:
      return error.message || 'An unknown error occurred. Please try again.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        body,
        html,
        #__next {
          height: 100%;
          margin: 0;
          font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
            'Helvetica Neue', sans-serif;
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
          onSubmit={loginUser}
          className="bg-[#0f172a] bg-opacity-80 p-6 sm:p-10 md:p-16 lg:p-20 rounded-2xl shadow-[0_0_40px_#00e6ff] border border-[#00e6ff] w-full max-w-md sm:max-w-xl md:max-w-3xl text-white space-y-6 sm:space-y-8 md:space-y-10 animate-float"
        >
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Login to TechFolio
          </h1>

          <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg">
            Access your developer portfolio dashboard
          </p>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center bg-red-900/30 p-3 rounded text-sm sm:text-base md:text-lg font-semibold">
              {error}
            </p>
          )}

          {/* Email */}
          <div className="relative">
            <FaUser className="absolute top-4 left-4 text-gray-400 text-lg sm:text-xl md:text-2xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 sm:p-5 md:p-6 pl-12 sm:pl-14 md:pl-16 border border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500 outline-none text-white placeholder-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl bg-[#1e293b] transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-4 text-gray-400 text-lg sm:text-xl md:text-2xl" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 sm:p-5 md:p-6 pl-12 sm:pl-14 md:pl-16 border border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500 outline-none text-white placeholder-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl bg-[#1e293b] transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-3 sm:py-4 md:py-5 rounded-xl text-lg sm:text-xl md:text-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
            New user?{' '}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => router.push('/signup')}
            >
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
