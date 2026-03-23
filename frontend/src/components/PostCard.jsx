import { useState } from 'react';
import { getComments, createComment, getReactions, addReaction } from '../api';
import { useAuth } from '../AuthContext';

const REACTIONS = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'haha', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😡' },
];

export default function PostCard({ post }) {
  const { isAuthenticated, isGuest } = useAuth();
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const [cRes, rRes] = await Promise.all([getComments(post.id), getReactions(post.id)]);
        setComments(cRes.data);
        setReactions(rRes.data);
      } catch (err) { console.error(err); }
      finally { setLoadingComments(false); }
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await createComment({ body: commentText, post_id: post.id });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const handleReaction = async (type) => {
    try {
      const res = await addReaction({ post_id: post.id, reaction_type: type });
      setReactions([...reactions, res.data]);
    } catch (err) { console.error(err); }
    setShowReactions(false);
  };

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
    return acc;
  }, {});

  const mediaIcons = { msg: '💬', photo: '🖼️', video: '🎬', audio: '🎵' };

  const renderMedia = () => {
    if (post.media_type === 'photo' && post.media_url)
      return <img src={post.media_url} alt="Post" className="w-full rounded-xl mt-3 max-h-80 object-cover" />;
    if (post.media_type === 'video' && post.media_url)
      return <video controls className="w-full rounded-xl mt-3 max-h-80"><source src={post.media_url} /></video>;
    if (post.media_type === 'audio' && post.media_url)
      return <audio controls className="w-full mt-3"><source src={post.media_url} /></audio>;
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md group">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            U{post.user_id}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">User #{post.user_id}</p>
            <p className="text-xs text-gray-400">{mediaIcons[post.media_type] || '💬'} {post.media_type}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-3">
        {post.body && <p className="text-gray-700 leading-relaxed text-[0.94rem]">{post.body}</p>}
        {renderMedia()}
      </div>

      {/* Reaction badges */}
      {Object.keys(reactionCounts).length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {Object.entries(reactionCounts).map(([type, count]) => {
            const r = REACTIONS.find((r) => r.type === type);
            return (
              <span key={type} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 text-gray-600 font-medium">
                {r?.emoji || type} {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
        {isAuthenticated && !isGuest && (
          <div className="relative">
            <button onClick={() => setShowReactions(!showReactions)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer font-medium">
              React 😊
            </button>
            {showReactions && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl p-2 flex gap-1 shadow-xl z-20">
                {REACTIONS.map((r) => (
                  <button key={r.type} onClick={() => handleReaction(r.type)}
                    className="text-xl hover:scale-125 transition-transform cursor-pointer p-1.5 rounded-lg hover:bg-gray-50" title={r.type}>
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={loadComments}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer font-medium">
          {showComments ? 'Hide' : 'Comments'} 💬
        </button>
        {isGuest && (
          <span className="text-xs text-amber-500 ml-auto font-medium">Sign up to interact</span>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-5 pb-5 space-y-2.5 border-t border-gray-50 pt-3">
          {loadingComments ? <p className="text-sm text-gray-400">Loading...</p> : (
            <>
              {comments.length === 0 && <p className="text-sm text-gray-400 italic">No comments yet.</p>}
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-indigo-500 font-semibold mb-0.5">User #{c.user_id}</p>
                  <p className="text-sm text-gray-700">{c.body}</p>
                </div>
              ))}
              {isAuthenticated && !isGuest && (
                <form onSubmit={handleComment} className="flex gap-2 mt-1">
                  <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..." className="input-field !py-2 text-sm flex-1" />
                  <button type="submit"
                    className="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:shadow-md transition-all cursor-pointer">
                    Send
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
