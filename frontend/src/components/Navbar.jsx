import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar({ variant = 'default' }) {
  const { isAuthenticated, isGuest, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTransparent = variant === 'landing';

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const navLink = (to, label) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
          isActive
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-white/70 backdrop-blur-xl border-b border-gray-100'
        : 'bg-white border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated || isGuest ? '/' : '/landing'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300">
            <span className="text-white text-sm font-extrabold tracking-tight">P</span>
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            POST<span className="text-indigo-500">HUM</span>
          </span>
        </Link>

        {/* Center nav links — only for logged-in or guest */}
        {(isAuthenticated || isGuest) && (
          <div className="hidden md:flex items-center gap-1">
            {navLink('/', 'Feed')}
            {isAuthenticated && navLink('/friends', 'Friends')}
            {isAuthenticated && navLink(`/profile/${user?.username}`, 'Profile')}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isGuest && (
            <>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                👁 Guest
              </span>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:shadow-md transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to={`/profile/${user?.username}`} className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.username?.charAt(0)?.toUpperCase()}</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">{user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-200 cursor-pointer font-medium"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && !isGuest && (
            <>
              <Link to="/signin" className="px-4 py-2 text-sm rounded-xl text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign In</Link>
              <Link to="/signup" className="px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all">Enroll Now</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {(isAuthenticated || isGuest) && (
        <div className="md:hidden flex items-center gap-1 px-6 pb-2 overflow-x-auto">
          {navLink('/', 'Feed')}
          {isAuthenticated && navLink('/friends', 'Friends')}
          {isAuthenticated && navLink(`/profile/${user?.username}`, 'Profile')}
        </div>
      )}
    </nav>
  );
}
