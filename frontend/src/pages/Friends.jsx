import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { searchUsers, sendFriendRequest, getPendingRequests, updateFriendRequest, getFriendList } from '../api';

export default function Friends() {
  const { user } = useAuth();
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadFriends(); loadRequests(); }, []);

  const loadFriends = async () => {
    try { const res = await getFriendList(); setFriends(res.data); } catch (e) { console.error(e); }
  };
  const loadRequests = async () => {
    try { const res = await getPendingRequests(); setRequests(res.data); } catch (e) { console.error(e); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setSearching(true);
    setMsg('');
    try { const res = await searchUsers(searchQ); setSearchResults(res.data); }
    catch (e) { console.error(e); }
    finally { setSearching(false); }
  };

  const handleSend = async (receiverId) => {
    try {
      await sendFriendRequest({ receiver_id: receiverId });
      setMsg('Request sent!');
      setSearchResults(searchResults.filter(u => u.id !== receiverId));
    } catch (e) { setMsg(e.response?.data?.detail || 'Failed'); }
  };

  const handleRespond = async (reqId, status) => {
    try {
      await updateFriendRequest(reqId, { status });
      setRequests(requests.filter(r => r.id !== reqId));
      if (status === 'accepted') loadFriends();
    } catch (e) { console.error(e); }
  };

  const tabBtn = (name, label, count) => (
    <button onClick={() => setTab(name)}
      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${
        tab === name ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-gray-500 hover:bg-gray-50 border border-transparent'
      }`}>
      {label} {count > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">{count}</span>}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 anim-fadeInUp">Friends</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 anim-fadeInUp-d1">
        {tabBtn('friends', 'My Friends', friends.length)}
        {tabBtn('requests', 'Requests', requests.length)}
        {tabBtn('search', 'Find People', 0)}
      </div>

      {/* My Friends */}
      {tab === 'friends' && (
        <div className="space-y-3 anim-fadeInUp-d2">
          {friends.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-3xl mb-2">👥</p>
              <p className="text-gray-500 font-medium">No friends yet</p>
              <p className="text-gray-400 text-sm mt-1">Search for people to connect!</p>
            </div>
          ) : friends.map(f => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                {f.username?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{f.username}</p>
                <p className="text-xs text-gray-400">{f.bio || 'No bio'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Requests */}
      {tab === 'requests' && (
        <div className="space-y-3 anim-fadeInUp-d2">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-3xl mb-2">📬</p>
              <p className="text-gray-500 font-medium">No pending requests</p>
            </div>
          ) : requests.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                #{r.sender_id}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">User #{r.sender_id}</p>
                <p className="text-xs text-gray-400">Wants to be your friend</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRespond(r.id, 'accepted')}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all cursor-pointer">
                  Accept
                </button>
                <button onClick={() => handleRespond(r.id, 'rejected')}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {tab === 'search' && (
        <div className="anim-fadeInUp-d2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by username..." className="input-field flex-1" />
            <button type="submit" disabled={searching}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50">
              {searching ? '...' : 'Search'}
            </button>
          </form>
          {msg && <p className="text-sm text-indigo-600 font-medium mb-3">{msg}</p>}
          <div className="space-y-3">
            {searchResults.map(u => (
              <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {u.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{u.username}</p>
                  <p className="text-xs text-gray-400">{u.bio || 'No bio'}</p>
                </div>
                <button onClick={() => handleSend(u.id)}
                  className="px-4 py-1.5 text-sm rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-100 transition-all cursor-pointer">
                  Add +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
