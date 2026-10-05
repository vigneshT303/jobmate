import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Sparkles,
  Bookmark,
  FileText,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Building2,
  Home,
  Mail
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link-pill text-sm xl:text-base font-bold transition-all px-3 xl:px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 ${
      isActive
        ? 'text-purple-950 bg-purple-100 font-extrabold border border-purple-300 shadow-xs'
        : 'text-purple-800 hover:text-purple-950 hover:bg-purple-50 border border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
      isActive
        ? 'text-purple-900 bg-purple-100 font-extrabold border border-purple-300'
        : 'text-purple-700 hover:text-purple-950 hover:bg-purple-50'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="h-1.5 w-full header-glow-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-4 h-20 sm:h-[88px]">
          {/* Brand Logo & Title with Increased Font Size */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0 select-none">
            {/* Animated Brand Emblem Container */}
            <div className="relative">
              {/* Ambient Glowing Aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-fuchsia-500/35 to-indigo-500/40 rounded-2xl blur-md brand-aura-pulse -z-10" />

              {/* Floating Animated Badge */}
              <div className="w-12 h-12 rounded-2xl brand-gradient-flow brand-icon-float flex items-center justify-center text-white shadow-lg shadow-purple-500/35 ring-2 ring-purple-300/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/60">
                <Briefcase className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm" />
              </div>

              {/* Twinkling Accent Sparkle */}
              <div className="absolute -top-1 -right-1 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40 brand-sparkle-twinkle drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              </div>
            </div>

            {/* Brand Typography with Enhanced Font Size */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-[28px] font-black tracking-tight text-purple-950 leading-none">
                  Job<span className="brand-text-shimmer font-black">Mate</span>
                </span>
                <span className="px-2.5 py-0.5 text-xs uppercase font-black tracking-wider rounded-md text-white pro-badge-animated border border-purple-200/50 shadow-xs shadow-purple-500/25 transition-transform duration-200 group-hover:scale-105">
                  PRO
                </span>
              </div>
              <span className="text-xs sm:text-[13px] text-purple-600 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Smart Career Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links Section with Increased Font Size (Home, Jobs, Companies, Resume Analyzer, Applications, Saved) */}
          <nav className="hidden md:flex items-center justify-center gap-1 xl:gap-2.5 flex-1 mx-2 xl:mx-4">
            <NavLink to="/" className={navLinkClass}>
              <Home className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              <Briefcase className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600" />
              <span>Jobs</span>
            </NavLink>
            <NavLink to="/companies" className={navLinkClass}>
              <Building2 className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600" />
              <span>Companies</span>
            </NavLink>
            <NavLink to="/resume-analyzer" className={navLinkClass}>
              <Sparkles className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600 animate-pulse" />
              <span>Resume Analyzer</span>
              <span className="hidden xl:inline-flex text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white leading-none shadow-xs shadow-purple-500/40">
                AI ATS
              </span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/my-applications" className={navLinkClass}>
                  <FileText className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600" />
                  <span>Applications</span>
                </NavLink>
                <NavLink to="/saved-jobs" className={navLinkClass}>
                  <Bookmark className="w-4 h-4 xl:w-5 xl:h-5 text-purple-600" />
                  <span>Saved</span>
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className="text-sm xl:text-base font-bold px-3 xl:px-4 py-2 rounded-xl flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 hover:from-purple-200 hover:to-indigo-200 transition border border-purple-300 shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 xl:w-5 xl:h-5 text-purple-700" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* End of the Header Section: Profile Dropdown */}
          <div className="flex items-center gap-3 ml-auto shrink-0 justify-end">
            {isAuthenticated ? (
              <div className="relative">
                {/* Profile Trigger Button placed firmly at the end of the header */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 sm:gap-3 py-1.5 px-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-200/90 hover:border-purple-300 shadow-xs hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 focus:outline-none cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-purple-500/30 ring-2 ring-purple-200 avatar-float">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs animate-pulse" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-sm sm:text-base text-slate-800 leading-tight truncate max-w-[120px] sm:max-w-[150px] group-hover:text-purple-900 transition-colors">
                      {user?.name}
                    </p>
                    <p className="text-xs sm:text-[13px] text-purple-600 font-semibold capitalize mt-0.5 leading-none">
                      {user?.role === 'admin' ? 'Admin' : (user?.candidateType || 'Candidate')}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180 text-purple-600' : 'group-hover:translate-y-0.5'}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-slate-900 rounded-3xl shadow-2xl shadow-black/80 border-2 border-slate-700/90 p-3 z-50 profile-dropdown-animate text-slate-100 ring-1 ring-white/10">
                    {/* Dark User Header Box with High-Contrast Text */}
                    <div className="px-4 py-3.5 rounded-2xl bg-slate-800/95 border border-slate-700 shadow-md mb-2.5 relative overflow-hidden">
                      {/* Subtle Ambient Light Shimmer */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-xl pointer-events-none" />

                      <div className="flex items-center gap-3.5 mb-2.5 relative z-10">
                        {/* 3D Animated Avatar Container */}
                        <div className="relative w-11 h-11 shrink-0">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/50 ring-2 ring-purple-400 avatar-float">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          {/* Live Online Badge */}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-xs animate-pulse" />
                        </div>

                        {/* User Identity Details */}
                        <div className="overflow-hidden space-y-0.5">
                          <p className="text-base font-extrabold text-white tracking-tight truncate flex items-center gap-1.5">
                            <span className="truncate drop-shadow-sm">{user?.name}</span>
                            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/40 shrink-0" />
                          </p>
                          <p className="text-xs text-purple-300 font-semibold truncate flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">{user?.email}</span>
                          </p>
                        </div>
                      </div>

                      {/* Role Status Pill */}
                      <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-purple-950/90 text-purple-300 border border-purple-500/50 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                          {user?.role === 'admin' ? 'Platform Admin' : `${user?.candidateType || 'Standard'} Candidate`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="group flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-750 rounded-2xl border border-slate-700/80 hover:border-purple-500/70 shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs group-hover:scale-105">
                            <User className="w-4 h-4" />
                          </div>
                          <span>Manage Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      <Link
                        to="/my-applications"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="group flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-750 rounded-2xl border border-slate-700/80 hover:border-sky-500/70 shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs group-hover:scale-105">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span>My Applications</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      <Link
                        to="/saved-jobs"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="group flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-750 rounded-2xl border border-slate-700/80 hover:border-amber-500/70 shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs group-hover:scale-105">
                            <Bookmark className="w-4 h-4" />
                          </div>
                          <span>Saved Jobs</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="group flex items-center justify-between px-3.5 py-2.5 text-sm font-black text-white bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/60 hover:border-purple-400 rounded-2xl transition-all duration-200 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                              <LayoutDashboard className="w-4 h-4" />
                            </div>
                            <span>Admin Dashboard</span>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xs">
                            PRO
                          </span>
                        </Link>
                      )}
                    </div>

                    {/* High-Contrast Sign Out Button with 100% Visible Text */}
                    <div className="pt-2 mt-1.5 border-t border-slate-700/80">
                      <button
                        onClick={handleLogout}
                        className="group w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold border border-red-400/50 shadow-md shadow-red-950/60 hover:shadow-red-600/30 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center transition-all group-hover:scale-110">
                            <LogOut className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-base font-extrabold text-white tracking-wide drop-shadow-sm">
                            Sign Out
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl border border-purple-300 transition shadow-xs cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl shadow-md shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  Register Free
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 flex items-center justify-center text-purple-700 transition shadow-xs focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-purple-700" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-purple-300 bg-[#f8f5ff] px-5 pt-3 pb-6 space-y-2 shadow-2xl rounded-b-3xl animate-in slide-in-from-top duration-200 text-slate-800">
          {isAuthenticated && (
            <div className="p-3.5 mb-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-md flex items-center gap-3.5 relative overflow-hidden text-white">
              <div className="relative w-12 h-12 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-md ring-2 ring-purple-400 avatar-float">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-xs animate-pulse" />
              </div>
              <div className="overflow-hidden space-y-0.5">
                <p className="font-extrabold text-white text-base truncate flex items-center gap-1.5">
                  <span className="truncate">{user?.name}</span>
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/40 shrink-0" />
                </p>
                <p className="text-xs text-purple-300 font-semibold truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-purple-950/90 text-purple-300 border border-purple-500/50 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    {user?.role === 'admin' ? 'Platform Admin' : `${user?.candidateType || 'Standard'} Candidate`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Home className="w-4 h-4 text-purple-600" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Jobs</span>
            </NavLink>
            <NavLink to="/companies" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Companies</span>
            </NavLink>
            <NavLink to="/resume-analyzer" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Resume Analyzer (AI)</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white">
                PRO
              </span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/my-applications" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>My Applications</span>
                </NavLink>
                <NavLink to="/saved-jobs" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  <Bookmark className="w-4 h-4 text-purple-600" />
                  <span>Saved Jobs</span>
                </NavLink>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Profile Settings</span>
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                    <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="pt-4 border-t border-purple-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 font-bold text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl shadow-md shadow-purple-500/25 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
