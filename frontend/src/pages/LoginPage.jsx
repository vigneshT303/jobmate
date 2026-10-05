import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Lock, Mail, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);

      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    toast.info(`Filled credentials for ${fillEmail}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/25">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to <span className="gradient-text font-black">JobMate</span>
          </h1>
          <p className="text-xs text-purple-700/80">
            Access your job applications, saved listings, and ATS resume analytics
          </p>
        </div>

        <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-900 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" />
            1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials('vigneshvicky182005@gmail.com', 'Admin@12345')}
              className="py-1.5 px-2 gradient-brand hover:opacity-95 text-white rounded-lg text-[11px] font-bold shadow-sm transition truncate cursor-pointer"
              title="Admin account"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('fresher@jobmate.com', 'User@12345')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-[11px] font-bold shadow-sm transition truncate cursor-pointer"
            >
              🎓 Fresher
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('experienced@jobmate.com', 'User@12345')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-[11px] font-bold shadow-sm transition truncate cursor-pointer"
            >
              💼 Experienced
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-purple-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobmate.com or candidate@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-purple-600 hover:text-purple-800">
                Register Candidate Profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
