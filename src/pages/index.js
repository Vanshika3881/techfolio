import { useRouter } from 'next/router';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

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
        <div className="bg-[#0f172a] bg-opacity-80 p-6 sm:p-10 md:p-20 lg:p-32 rounded-2xl shadow-[0_0_40px_#00e6ff] text-center space-y-6 sm:space-y-10 md:space-y-14 border border-[#00e6ff] max-w-6xl w-full animate-float">
          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
            Welcome to TechFolio
          </h1>

          {/* Subtitle */}
          <p className="text-[#f8fafc] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
            Create and manage your developer portfolio with ease.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mt-8">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center justify-center gap-3 sm:gap-4 bg-gradient-to-r from-[#06bfc9] to-[#00e6ff] text-[#0f172a] px-6 py-3 sm:px-10 sm:py-5 rounded-full shadow-[0_0_20px_#00e6ff] text-lg sm:text-xl md:text-2xl font-semibold transition-transform hover:scale-105 sm:hover:scale-110 hover:shadow-[0_0_30px_#0ff] active:scale-95"
            >
              <FaSignInAlt /> Login
            </button>

            <button
              onClick={() => router.push('/signup')}
              className="flex items-center justify-center gap-3 sm:gap-4 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 sm:px-10 sm:py-5 rounded-full shadow-lg text-lg sm:text-xl md:text-2xl font-semibold transition-transform hover:scale-105 sm:hover:scale-110 active:scale-95"
            >
              <FaUserPlus /> Sign Up
            </button>
          </div>

          {/* Extra Info */}
          <p className="text-[#a0eaff] text-sm sm:text-base md:text-lg mt-6 font-medium">
            <span className="text-[#06bfc9] font-semibold">Login</span> for existing users,{' '}
            <span className="text-green-400 font-semibold">Sign Up</span> for new users.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
