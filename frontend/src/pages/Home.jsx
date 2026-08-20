import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import * as postsApi from "../api/posts.js";
import PostCard from "../components/PostCard.jsx";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { POST_CREATE_ROUTE } from "../routes/route.js";
import {
  Plus,
  AlertCircle,
  Search,
  X,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postsApi.getAllPosts();
        setPosts(res.data.data);
      } catch {
        setError("Unable to load posts right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => (b._count?.likes || 0) - (a._count?.likes || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [posts, searchQuery, sortBy]);

  const handlePostDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Stories</h1>
            <p className="text-sm text-slate-500 mt-1">Read the latest articles from our community</p>
          </div>
          {isAuthenticated && (
            <Link
              to={POST_CREATE_ROUTE}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Post
            </Link>
          )}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl clean-input text-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 font-medium focus:outline-none focus:border-indigo-400"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Liked</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Post Count */}
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={15} className="text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700">All Posts</span>
          <span className="text-xs text-slate-400">({filteredPosts.length})</span>
        </div>

        {/* Loading */}
        {loading && <Loading type="grid" />}

        {/* Error */}
        {error && (
          <div className="card rounded-2xl p-10 text-center max-w-md mx-auto">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3 text-red-500">
              <AlertCircle size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 mt-1"
            >
              Reload
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="card rounded-2xl p-10 text-center max-w-md mx-auto my-10">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">No articles found</h3>
            <p className="text-xs text-slate-400 mb-5">
              {searchQuery ? `No results for "${searchQuery}"` : "No posts in this category yet."}
            </p>
            {(searchQuery) && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
