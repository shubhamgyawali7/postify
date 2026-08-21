import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as postsApi from "../api/posts.js";
import { HOME_ROUTE, postDetailsPath } from "../routes/route.js";
import { ArrowRight, ImagePlus, X, FileText, PenLine, ChevronRight } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!image) {
      setError("Image is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);

      const res = await postsApi.createPost(formData);
      toast.success("Post published");
      navigate(postDetailsPath(res.data.data.id));
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to create post";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
          <Link to={HOME_ROUTE} className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium">New Post</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create a post</h1>
          <p className="mt-1 text-sm text-slate-500">Share your ideas with the community.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText size={14} className="text-slate-400" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Give your post a title"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                <PenLine size={14} className="text-slate-400" />
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                placeholder="Write your post here..."
                className={inputClass + " resize-y"}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                <ImagePlus size={14} className="text-slate-400" />
                Featured Image
                <span className="text-xs font-normal text-slate-400 normal-case">(required)</span>
              </label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-52 object-cover rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-white/90 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                  <ImagePlus size={20} className="text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Click to upload</span>
                  <span className="text-xs text-slate-400 mt-0.5">PNG, JPG, GIF up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} required className="hidden" />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(HOME_ROUTE)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Publish
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
