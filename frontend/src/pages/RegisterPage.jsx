import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, User, Mail, Lock, Phone, MapPin, ArrowRight, Loader2, GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    candidateType: 'fresher',
    phone: '',
    location: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please enter name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        candidateType: formData.candidateType,
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : []
      };

      await register(payload);
      toast.success('Registration successful! Welcome to JobMate.');
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/25">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your <span className="gradient-text font-black">JobMate</span> Account
          </h1>
          <p className="text-xs text-purple-700/80">
            Join thousands of tech freshers & experienced engineers getting hired
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-purple-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I am applying as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, candidateType: 'fresher' })}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                    formData.candidateType === 'fresher'
                      ? 'bg-purple-100/70 border-purple-400 text-purple-800 shadow-sm'
                      : 'bg-purple-50/30 border-purple-100 text-slate-600 hover:bg-purple-50'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span>College Fresher (0-1 yrs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, candidateType: 'experienced' })}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                    formData.candidateType === 'experienced'
                      ? 'bg-purple-100/70 border-purple-400 text-purple-800 shadow-sm'
                      : 'bg-purple-50/30 border-purple-100 text-slate-600 hover:bg-purple-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span>Experienced Professional</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vignesh Vicky"
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Chennai, India"
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Top Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, Node.js, MongoDB, JavaScript"
                className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
