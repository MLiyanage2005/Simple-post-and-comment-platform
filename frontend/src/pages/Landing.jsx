import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Landing() {
  const { enterGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuest = () => {
    enterGuest();
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60 anim-pulse-slow"></div>
        <div className="absolute bottom-20 left-[10%] w-56 h-56 bg-violet-100 rounded-full blur-3xl opacity-50 anim-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left — Hero */}
        <div>
          <div className="anim-fadeInUp inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Now in Beta</span>
          </div>

          <h1 className="anim-fadeInUp-d1 text-5xl sm:text-6xl lg:text-[3.75rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Share Ideas,<br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Spark Conversations
            </span>
          </h1>

          <p className="anim-fadeInUp-d2 text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
            POSTHUM is a modern, community-driven platform where you share your thoughts through text, photos, audio, and video — and connect through meaningful comments and reactions.
          </p>

          <div className="anim-fadeInUp-d3 flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                Enroll Now — it&apos;s free
              </Link>
              <Link
                to="/signin"
                className="px-7 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
            <button
              onClick={handleGuest}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold text-sm hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <span className="text-lg">👁</span> Continue as Guest →
            </button>
          </div>

          {/* Social proof */}
          <div className="anim-fadeInUp-d4 flex items-center gap-4 mt-10 pt-8 border-t border-gray-100">
            <div className="flex -space-x-2.5">
              {['bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-pink-400', 'bg-amber-400'].map((bg, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${bg} border-[2.5px] border-white flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">2,400+ creators</p>
              <p className="text-xs text-gray-400">already sharing on POSTHUM</p>
            </div>
          </div>
        </div>

        {/* Right — Preview Card */}
        <div className="anim-slideRight hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-violet-100 to-purple-200 rounded-3xl blur-2xl opacity-40 scale-105"></div>
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">POSTHUM Feed</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-300"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                  <div className="w-3 h-3 rounded-full bg-green-300"></div>
                </div>
              </div>
              <div className="anim-float bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">A</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Alex Chen</p>
                    <p className="text-xs text-gray-400">2 min ago · 💬</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Just shipped a new feature! 🚀</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full font-medium">👍 12</span>
                  <span className="px-2.5 py-1 text-xs bg-pink-50 text-pink-600 rounded-full font-medium">❤️ 8</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold">M</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Maya Rivera</p>
                    <p className="text-xs text-gray-400">15 min ago · 🖼️</p>
                  </div>
                </div>
                <div className="w-full h-20 bg-gradient-to-r from-violet-100 via-pink-50 to-amber-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
