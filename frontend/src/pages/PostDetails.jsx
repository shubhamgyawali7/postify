import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as postsApi from "../api/posts.js";
import * as commentsApi from "../api/comments.js";
import { useAuth } from "../context/AuthContext.jsx";
import Comment from "../components/Comment.jsx";
import Loading from "../components/Loading.jsx";
import { HOME_ROUTE, LOGIN_ROUTE } from "../routes/route.js";
import { ChevronRight } from "lucide-react";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  AlertCircle,
} from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postsApi.getPostById(id);
        setPost(res.data.data);
        setLikeCount(res.data.data.likesCount || 0);
        setLiked(res.data.data.likedByMe || false);
      } catch {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post) return;
    const fetchComments = async () => {
      try {
        const res = await commentsApi.getComments(id);
        setComments(res.data.data);
      } catch {
        // silent fail
      }
    };
    fetchComments();
  }, [id, post]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await postsApi.toggleLike(id);
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likesCount);
      toast.success(res.data.data.liked ? "Liked" : "Unliked");
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await commentsApi.addComment(id, commentText.trim());
      setComments([res.data.data, ...comments]);
      setCommentText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.deleteComment(id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-500" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <Link to={HOME_ROUTE} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    );
  }

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
        <Link to={HOME_ROUTE} className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
        <ChevronRight size={14} />
        <span className="text-slate-700 font-medium truncate max-w-[300px]">{post.title}</span>
      </nav>

      <article className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
        )}

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-slate-500 mb-6">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-slate-700 block leading-tight text-sm">{post.author?.name}</span>
              <span className="text-xs text-slate-400">{date}</span>
            </div>
          </div>

          <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">
            {post.content}
          </div>

          <div className="flex items-center gap-3 mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                liked
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart size={15} className={liked ? "fill-indigo-600" : ""} />
              {liked ? "Liked" : "Like"} {likeCount}
            </button>

            <span className="text-sm text-slate-400 flex items-center gap-1.5 ml-auto">
              <MessageCircle size={14} />
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>
      </article>

      <section className="mt-4 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Comments ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleComment} className="mb-5">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none resize-none mb-3 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {commentLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send size={14} />
                )}
                Post
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-500 mb-5 bg-slate-50 rounded-xl px-4 py-3 text-center border border-slate-100">
            <Link to={LOGIN_ROUTE} className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link> to leave a comment
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No comments yet.</p>
        ) : (
          <div>
            {comments.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                currentUserId={user?.id}
                userRole={user?.role}
                onDelete={() => handleDeleteComment(c.id)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default PostDetails;
