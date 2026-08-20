import api from "./axios.js";

export const getComments = (postId) => api.get(`/api/posts/${postId}/comments`);

export const addComment = (postId, text) =>
  api.post(`/api/posts/${postId}/comments`, { text });

export const deleteComment = (postId, commentId) =>
  api.delete(`/api/posts/${postId}/comments/${commentId}`);
