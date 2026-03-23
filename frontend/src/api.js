import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/user/register', data);
export const loginUser = (data) => API.post('/user/login', data);

// Posts
export const createPost = (data) => API.post('/', data);
export const getPosts = () => API.get('/post');

// Comments
export const createComment = (data) => API.post('/comment', data);
export const getComments = (postId) => API.get(`/comment/${postId}/post`);

// Reactions
export const addReaction = (data) => API.post('/reaction', data);
export const getReactions = (postId) => API.get(`/reaction/${postId}/post`);

// Profile
export const getProfile = (username) => API.get(`/profile/${username}`);
export const getUserPosts = (username) => API.get(`/profile/${username}/posts`);
export const updateProfile = (data) => API.put('/profile/', data);
export const searchUsers = (q) => API.get(`/profile/search?q=${q}`);

// Friends
export const sendFriendRequest = (data) => API.post('/friend/request', data);
export const updateFriendRequest = (id, data) => API.put(`/friend/request/${id}`, data);
export const getPendingRequests = () => API.get('/friend/requests');
export const getFriendList = () => API.get('/friend/list');

export default API;
