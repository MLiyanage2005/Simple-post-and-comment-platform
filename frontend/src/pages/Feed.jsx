import { useState, useEffect } from 'react';
import { getPosts, createPost } from '../api';
import { useAuth } from '../AuthContext';
import PostCard from '../components/PostCard';

export default function Feed() {
  const { isAuthenticated, isGuest } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ body: '', media_type: 'msg', media_url: '' });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data.reverse());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPost.body && !newPost.media_url) { setError('Add a message or media URL.'); return; }
    setPosting(true);
    try {
      const res = await createPost(newPost);
      setPosts([res.data, ...posts]);
      setNewPost({ body: '', media_type: 'msg', media_url: '' });
    } catch (err) { setError(err.response?.data?.detail || 'Failed to create post.'); }
    finally { setPosting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Guest banner */}
      {isGuest && (
        <div className="anim-fadeInUp mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <span className="text-2xl">👁</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">You&apos;re browsing as a guest</p>
            <p className="text-xs text-amber-600">Sign up to create posts, comment, and react.</p>
          </div>
        </div>
      )}

      {/* Create Post — only for authenticated */}
      {isAuthenticated && !isGuest && (
        <div className="anim-fadeInUp bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create a Post</h2>
          {error && <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

          <form onSubmit={handlePost} className="space-y-3">
            <textarea value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              placeholder="What's on your mind?" rows={3} className="input-field resize-none" />

            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs text-gray-500 mb-1 font-medium">Media Type</label>
                <select value={newPost.media_type} onChange={(e) => setNewPost({ ...newPost, media_type: e.target.value })} className="input-field cursor-pointer">
                  <option value="msg">💬 Message</option>
                  <option value="photo">🖼️ Photo</option>
                  <option value="audio">🎵 Audio</option>
                  <option value="video">🎬 Video</option>
                </select>
              </div>
              {newPost.media_type !== 'msg' && (
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Media URL</label>
                  <input type="url" value={newPost.media_url} onChange={(e) => setNewPost({ ...newPost, media_url: e.target.value })}
                    placeholder="https://example.com/media.jpg" className="input-field" />
                </div>
              )}
            </div>
            <button type="submit" disabled={posting} className="btn-primary !w-auto px-8">
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-[2.5px] border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4 text-sm">Loading feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
