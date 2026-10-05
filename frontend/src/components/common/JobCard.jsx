import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { savedJobsAPI } from '../../services/api';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const JobCard = ({ job, isInitiallySaved = false, onUnsave }) => {
  const { isAuthenticated, isAppliedToJobOrCompany } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [saving, setSaving] = useState(false);

  const companyId = job?.company?._id || job?.company;
  const isApplied = isAppliedToJobOrCompany ? isAppliedToJobOrCompany(job?._id, companyId) : false;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to save jobs to your profile.');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await savedJobsAPI.remove(job._id);
        setIsSaved(false);
        toast.info('Job removed from saved jobs');
        if (onUnsave) onUnsave(job._id);
      } else {
        await savedJobsAPI.save(job._id);
        setIsSaved(true);
        toast.success('Job saved to your bookmarks!');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    } finally {
      setSaving(false);
    }
  };

  const companyLogo = job?.company?.logo || job?.companyLogo;
  const companyName = job?.company?.name || 'Top Employer';

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getWorkModeBadgeColor = (mode) => {
    switch (mode) {
      case 'Remote':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hybrid':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
      default:
        return 'bg-violet-50 text-violet-700 border-violet-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-purple-100/90 p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="w-12 h-12 rounded-xl object-cover border border-purple-100 shadow-sm bg-purple-50/50 shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0 ${
                companyLogo ? 'hidden' : 'flex'
              }`}
            >
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={job?.company?._id ? `/companies/${job.company._id}` : '#'}
                  className="text-xs font-semibold text-slate-500 hover:text-purple-600 transition flex items-center gap-1"
                >
                  {companyName}
                </Link>
                {isApplied && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Applied
                  </span>
                )}
              </div>
              <Link to={`/jobs/${job._id}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-purple-50/40 border-purple-100 text-slate-400 hover:text-purple-600 hover:bg-purple-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-600 bg-purple-50/60 px-2.5 py-1 rounded-lg border border-purple-100/60">
            <MapPin className="w-3.5 h-3.5 text-purple-500" />
            {job.location}
          </span>

          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium ${getWorkModeBadgeColor(
              job.workMode
            )}`}
          >
            {job.workMode}
          </span>

          <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.experience}
          </span>

          {job.salary?.display && (
            <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/80">
              {job.salary.display}
            </span>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {(job.requiredSkills || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200/70"
            >
              {skill}
            </span>
          ))}
          {(job.requiredSkills || []).length > 4 && (
            <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
              +{(job.requiredSkills || []).length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Posted {formatDate(job.createdAt)}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-800 transition group-hover:translate-x-0.5"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
