import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const signupUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'portfolios', uid), {
        name,
        bio: '',
        skills: [],
        socials: { linkedin: '', github: '' },
        projects: [],
        profilePicture: '',
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed.');
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
          onSubmit={signupUser}
          className="bg-[#0f172a] bg-opacity-80 p-20 rounded-4xl shadow-[0_0_60px_#00e6ff] border border-[#00e6ff] max-w-4xl w-full text-white space-y-10 animate-float"
        >
          <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Create Your TechFolio 
          </h1>
          <p className="text-center text-gray-300 text-lg">
            Already have an account?{' '}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Log in
            </span>
          </p>

          {error && (
            <p className="text-red-500 text-center bg-red-900/30 p-3 rounded text-lg font-semibold">
              {error}
            </p>
          )}

          <div className="relative">
            <FaUser className="absolute top-4 left-4 text-gray-400 text-2xl" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-6 pl-16 rounded-xl border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400 text-2xl
                         focus:ring-4 focus:ring-green-500 outline-none transition`}
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-4 left-4 text-gray-400 text-2xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-6 pl-16 rounded-xl border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400 text-2xl
                         focus:ring-4 focus:ring-green-500 outline-none transition`}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-4 left-4 text-gray-400 text-2xl" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-6 pl-16 rounded-xl border border-gray-600 bg-[#1e293b] text-white placeholder-gray-400 text-2xl
                         focus:ring-4 focus:ring-green-500 outline-none transition`}
            />
            <div
              className="text-right mt-2 text-sm text-green-400 hover:underline cursor-pointer select-none"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot Password?
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white py-5 rounded-xl text-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
