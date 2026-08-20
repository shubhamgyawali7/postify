import { Clock, Trash2 } from "lucide-react";

const Comment = ({ comment, currentUserId, userRole, onDelete }) => {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const canDelete = currentUserId === comment.userId || userRole === "ADMIN";
  const authorName = comment.user?.name || comment.author || "Unknown";

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-semibold text-slate-700">{authorName}</span>
        {comment.createdAt && (
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock size={10} />
            {timeAgo(comment.createdAt)}
          </span>
        )}
        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-auto p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete comment"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-600 ml-9.5 leading-relaxed">{comment.text}</p>
    </div>
  );
};

export default Comment;
