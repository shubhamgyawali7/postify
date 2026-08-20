import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  Shield,
  LogOut,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  Feather,
} from "lucide-react";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  ADMIN_ROUTE,
} from "../routes/route.js";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    setUserDropdown(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to={HOME_ROUTE} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Blogify</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={LOGIN_ROUTE}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to={REGISTER_ROUTE}
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {user?.role === "ADMIN" && (
                  <Link
                    to={ADMIN_ROUTE}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      isActive(ADMIN_ROUTE)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Shield size={14} />
                    Admin
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || <UserIcon size={13} />}
                    </div>
                    <span className="text-xs font-medium text-slate-600 max-w-[80px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${userDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl p-1.5 shadow-lg z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                          {user?.role}
                        </span>
                      </div>

                      {user?.role === "ADMIN" && (
                        <Link
                          to={ADMIN_ROUTE}
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <LayoutDashboard size={14} className="text-slate-400" />
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to={POST_CREATE_ROUTE}
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Plus size={14} className="text-slate-400" />
                        New Post
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 mt-0.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-slate-200">
            {!isAuthenticated ? (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <Link
                  to={LOGIN_ROUTE}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to={REGISTER_ROUTE}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="px-3 py-2 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>

                {user?.role === "ADMIN" && (
                  <Link
                    to={ADMIN_ROUTE}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Shield size={16} className="text-slate-400" /> Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
