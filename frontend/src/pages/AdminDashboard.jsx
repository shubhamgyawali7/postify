import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as postsApi from "../api/posts.js";
import * as authApi from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { postDetailsPath, postEditPath, HOME_ROUTE } from "../routes/route.js";
import { Users, FileText, Edit2, Trash2, Crown, ShieldCheck, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          postsApi.getAllPosts(),
          authApi.getUsers(),
        ]);
        setPosts(postsRes.data.data);
        setUsers(usersRes.data.data);
      } catch {
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeletePost = async () => {
    if (!deleteId) return;
    try {
      await postsApi.deletePost(deleteId);
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
          <Link to={HOME_ROUTE} className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium">Admin Dashboard</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-12">
            Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-indigo-600" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Users</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-indigo-600" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Posts</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <FileText size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-800">Manage Posts</h2>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No posts yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      to={postDetailsPath(post.id)}
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      by {post.author?.name || "Unknown"} &bull;{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={postEditPath(post.id)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 size={12} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(post.id)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <Users size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-800">All Users</h2>
          </div>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No users</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.role === "ADMIN" && <Crown size={11} />}
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <ConfirmDialog
          open={deleteId !== null}
          title="Delete Post"
          message="Are you sure? This cannot be undone."
          onConfirm={handleDeletePost}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </main>
  );
};

export default AdminDashboard;
