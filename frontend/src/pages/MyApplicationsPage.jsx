import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../services/api';
import Loading from '../components/common/Loading';
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Briefcase
} from 'lucide-react';

const statusBadges = {
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
  Interview: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const res = await applicationsAPI.getMy();
        const apps = res.data.data.applications || [];
        setApplications(apps);
        setSelectedApp((prev) => {
          if (!prev) return apps[0] || null;
          return apps.find((a) => a._id === prev._id) || prev;
        });
      } catch (err) {
        if (!isBackground) console.error('[MyApplications] Failed to fetch', err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };

    fetchApplications();

    // Auto-poll every 5 seconds so candidate sees real-time status changes automatically
    const interval = setInterval(() => {
      fetchApplications(true);
    }, 5000);

    const onFocus = () => fetchApplications(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (loading) {
    return <Loading fullScreen text="Loading your job applications..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the live review progress of all software engineering roles you have applied for.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500">
            Browse our curated job listings and submit applications using your profile resume.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Explore Active Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {applications.map((app) => {
              const job = app.job || {};
              const company = job.company || {};
              const isSelected = selectedApp?._id === app._id;

              return (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-white rounded-2xl border p-5 transition cursor-pointer shadow-sm ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-100'
                      : 'border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name || 'Company'}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold text-slate-500">{company.name || 'Company'}</p>
                        <h3 className="text-base font-bold text-slate-900">{job.title || 'Untitled Role'}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {job.location} • {job.jobType} • {job.workMode}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          statusBadges[app.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-24 self-start space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Application Details & Progress
            </h3>

            {selectedApp ? (
              <div className="space-y-5 text-xs text-slate-600">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Role Applied For</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedApp.job?.title}
                  </p>
                  <p className="text-indigo-600 font-semibold mt-0.5">
                    {selectedApp.job?.company?.name}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Applicant:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-800">{selectedApp.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium text-slate-800">{selectedApp.phone}</span>
                  </div>
                  {selectedApp.resumeUrl && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Resume:</span>
                      <a
                        href={selectedApp.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        View File <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Status History
                  </p>
                  <div className="relative pl-5 border-l-2 border-indigo-200 space-y-4">
                    {(selectedApp.statusHistory || []).map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                        <p className="font-bold text-slate-900">{step.status}</p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(step.changedAt).toLocaleString()}
                        </p>
                        {step.comment && (
                          <p className="mt-1 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {step.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApp.job?._id && (
                  <Link
                    to={`/jobs/${selectedApp.job._id}`}
                    className="block text-center w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    View Original Job Posting
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Select an application from the list to view its complete review timeline and attached details.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
