import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getProfile, getUserPosts, updateProfile } from '../api';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated, isGuest } = useAuth();
  const isOwner = isAuthenticated && currentUser?.username === username;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', avatar_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [username]);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, postsRes] = await Promise.all([getProfile(username), getUserPosts(username)]);
      setProfile(pRes.data);
      setPosts(postsRes.data.reverse());
      setEditForm({ bio: pRes.data.bio || '', avatar_url: pRes.data.avatar_url || '' });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(editForm);
      setProfile(res.data);
      setEditing(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-[2.5px] border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20">
      <p className="text-gray-500">User not found.</p>
    </div>
  );

  const initials = profile.username?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="anim-fadeInUp bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 relative">
          <div className="absolute -bottom-10 left-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 border-4 border-white flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-extrabold">{initials}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{profile.username}</h1>
              <p className="text-sm text-gray-400">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-2">{profile.bio || 'No bio yet'}</p>
            </div>
            {isOwner && !editing && (
              <button onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all cursor-pointer">
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-lg font-extrabold text-gray-900">{posts.length}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">{profile.age}</p>
              <p className="text-xs text-gray-400">Age</p>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-gray-100 space-y-3 anim-fadeInUp">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..." maxLength={300} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar URL</label>
                <input type="url" value={editForm.avatar_url} onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg" className="input-field" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary !w-auto px-6">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <h2 className="text-lg font-bold text-gray-900 mb-4 anim-fadeInUp-d1">Posts by {profile.username}</h2>
      <div className="space-y-5 anim-fadeInUp-d2">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-3xl mb-2">📝</p>
            <p className="text-gray-500 font-medium">No posts yet</p>
          </div>
        ) : posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
