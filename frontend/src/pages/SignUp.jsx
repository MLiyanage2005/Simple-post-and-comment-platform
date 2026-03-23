import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', age: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (parseInt(form.age) <= 12) { setError('You must be above 12 years old.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      await registerUser({ ...form, age: parseInt(form.age) });
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-8 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-16">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white text-base font-extrabold">P</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">POSTHUM</span>
            </Link>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Start sharing<br />your story today.
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Join a vibrant community of creators sharing ideas through text, photos, audio, and video.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { num: '2.4K+', label: 'Creators' },
              { num: '15K+', label: 'Posts' },
              { num: '48K+', label: 'Reactions' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold">{s.num}</p>
                <p className="text-white/50 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md anim-fadeInUp">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">P</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">POST<span className="text-indigo-500">HUM</span></span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">Join POSTHUM and start sharing with the community.</p>

          {success && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
              <span>✓</span> Account created! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} required minLength={3} maxLength={50} placeholder="Choose a username" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required min={13} placeholder="Must be 13 or above" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" className="input-field" />
            </div>

            <button type="submit" disabled={loading || success} className="btn-primary mt-2">
              {loading ? 'Creating account...' : success ? 'Account Created ✓' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-xs text-gray-400 uppercase tracking-widest font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
