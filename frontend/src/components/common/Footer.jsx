import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ArrowRight,
  TrendingUp,
  Mail,
  MapPin
} from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaXTwitter, FaDiscord } from 'react-icons/fa6';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="relative mt-auto bg-slate-950 text-slate-300 border-t border-slate-800/80 overflow-hidden font-sans">
      {/* Radiant Top Glow Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 relative z-10">
        
        {/* Footer Navigation Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none select-none">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-md brand-aura-pulse -z-10" />
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 brand-icon-float group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Job<span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Mate</span>
                <span className="px-2 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-md text-white pro-badge-animated border border-indigo-400/40 shadow-xs">
                  PRO
                </span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The intelligent career matching platform designed to elevate your professional trajectory with AI-driven ATS insights, curated company discovery, and verified job postings.
            </p>

            {/* Platform Stats Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                12,000+ Verified Jobs
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                850+ Companies
              </span>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Connect With Us</p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-200"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all duration-200"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition-all duration-200"
                >
                  <FaXTwitter className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-700 hover:border-indigo-600 transition-all duration-200"
                >
                  <FaDiscord className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Candidates */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              For Candidates
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Browse Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Explore Companies</span>
                </Link>
              </li>
              <li>
                <Link to="/resume-analyzer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>AI Resume Analyzer</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white leading-none">
                    AI
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Saved Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/my-applications" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Application Status</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Career Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Roles & Sectors */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Popular Fields
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?category=Software+Engineering" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Software Engineering</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Data+Science+%26+AI" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Data Science & AI</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Product+Management" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Product Management</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Design+%26+Creative" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>UI/UX & Design</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=remote" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Remote-First Roles</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs?experienceLevel=Entry-Level" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  <span>Early Career & Interns</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Support & Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Global Remote & Tech Hubs</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:support@jobmatepro.com" className="hover:text-white transition-colors">
                  support@jobmatepro.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Operational Status & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {CURRENT_YEAR} JobMate PRO. All rights reserved.</span>
          </div>

          {/* Live Status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-medium">All Systems Operational</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
