import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Heart, MessageCircle } from "lucide-react";
import { postDetailsPath, postEditPath } from "../routes/route.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import * as postsApi from "../api/posts.js";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.id === post.authorId;
  const isAdmin = user?.role === "ADMIN";
  const canManage = isOwner || isAdmin;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this post?")) return;
    try {
      await postsApi.deletePost(post.id);
      toast.success("Post deleted");
      if (onDelete) onDelete(post.id);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <article
      className="card card-hover rounded-xl overflow-hidden flex flex-col cursor-pointer"
      onClick={() => navigate(postDetailsPath(post.id))}
    >
      {post.image && (
        <div className="overflow-hidden aspect-[16/9] bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h2 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {post.title}
          </h2>
          {canManage && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(postEditPath(post.id)); }}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {post.content}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {post.likesCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {post._count?.comments || 0}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
