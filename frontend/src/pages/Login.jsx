import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ChevronRight } from "lucide-react";
import { HOME_ROUTE, REGISTER_ROUTE } from "../routes/route.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(HOME_ROUTE);
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-56px)] flex-col justify-center bg-[#f8f9fc] px-6 py-12 sm:px-8">
      <div className="relative mx-auto w-full max-w-md">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
          <Link to={HOME_ROUTE} className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium">Sign In</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-500">Continue writing, reading, and sharing ideas.</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 pl-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Forgot?</button>
            </div>
            <div className="relative">
              <LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Sign in
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Not a member?{" "}
          <Link to={REGISTER_ROUTE} className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
