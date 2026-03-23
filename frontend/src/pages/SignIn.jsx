import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.access_token, { username: form.username });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-8 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-16">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white text-base font-extrabold">P</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">POSTHUM</span>
            </Link>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Welcome back,<br />creator.
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Your posts, comments, and community are waiting for you. Pick up right where you left off.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: '💬', text: 'Post text, photos, audio & video' },
              { icon: '💜', text: 'React with emojis to engage' },
              { icon: '🔒', text: 'Secure JWT authentication' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md anim-fadeInUp">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">P</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">POST<span className="text-indigo-500">HUM</span></span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Sign in to your account</h1>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to access your feed.</p>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} required placeholder="Enter your username" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-xs text-gray-400 uppercase tracking-widest font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            New here?{' '}
            <Link to="/signup" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
