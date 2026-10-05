import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { jobsAPI, savedJobsAPI, applicationsAPI } from '../services/api';
import ApplyJobModal from '../components/common/ApplyJobModal';
import Loading from '../components/common/Loading';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Users,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Check,
  Zap,
  Globe
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, markApplied, isAppliedToJobOrCompany } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationInfo, setApplicationInfo] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await jobsAPI.getById(id);
        const jobData = res.data.data.job;
        setJob(jobData);

        const companyId = jobData?.company?._id || jobData?.company;

        if (isAuthenticated && isAppliedToJobOrCompany && isAppliedToJobOrCompany(jobData?._id, companyId)) {
          setHasApplied(true);
        }

        if (isAuthenticated) {
          const [saveRes, appRes] = await Promise.all([
            savedJobsAPI.checkIsSaved(id).catch(() => null),
            applicationsAPI.checkStatus(id).catch(() => null)
          ]);

          if (saveRes?.data?.data) {
            setIsSaved(saveRes.data.data.isSaved);
          }

          if (appRes?.data?.data) {
            setHasApplied(appRes.data.data.hasApplied);
            setApplicationInfo(appRes.data.data);
            if (appRes.data.data.hasApplied && markApplied) {
              markApplied({ jobId: jobData?._id, companyId });
            }
          }
        }
      } catch (err) {
        toast.error('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isAuthenticated]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save this job.');
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await savedJobsAPI.remove(id);
        setIsSaved(false);
        toast.info('Job removed from saved bookmarks');
      } else {
        await savedJobsAPI.save(id);
        setIsSaved(true);
        toast.success('Job saved to your bookmarks!');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.info('Please log in or register to apply for this job.');
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` }, message: 'Please log in to apply for this job.' } });
      return;
    }
    if (hasApplied) {
      toast.info(`You have already applied to ${applicationInfo?.companyName || job?.company?.name || 'this company'}. You cannot apply to the same company again.`);
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading job information..." />;
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Job Posting Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The job post you are looking for may have been removed or closed.</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const company = job.company || {};
  const companyLogo = company.logo || job.companyLogo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all jobs
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={company.name || 'Company'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={company._id ? `/companies/${company._id}` : '#'}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  {company.name || 'Hiring Enterprise'}
                </Link>
                {job.featured && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-800">
                  {job.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location} ({job.workMode})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {job.jobType}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              {hasApplied && (
                <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    You have applied to {job.company?.name || 'this company'} • Status: <span className="font-bold underline">{applicationInfo?.status || 'Applied'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-semibold ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 transition"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleApplyClick}
              disabled={hasApplied}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 ${
                hasApplied
                  ? 'bg-emerald-600 text-white cursor-not-allowed opacity-95 shadow-emerald-500/20'
                  : 'gradient-brand text-white shadow-indigo-500/25 hover:opacity-95 cursor-pointer'
              }`}
              title={hasApplied ? 'You have already applied to this company' : 'Apply for this job'}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </>
              ) : (
                <span>Apply Now</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="p-2 border-r border-slate-100 last:border-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Salary</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">{job.salary?.display || 'Negotiable'}</p>
            </div>
            <div className="p-2 border-r border-slate-100 last:border-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Experience</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{job.experience}</p>
            </div>
            <div className="p-2 border-r border-slate-100 last:border-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Education</p>
              <p className="text-sm font-bold text-slate-800 mt-1 truncate" title={job.education}>{job.education}</p>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Vacancies</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{job.vacancies || 1} Openings</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Job Description
              </h2>
              <div className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2">Key Responsibilities</h3>
                <ul className="mt-3 space-y-2.5">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2">Candidate Requirements</h3>
                <ul className="mt-3 space-y-2.5">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900 pb-2">Required Skills & Tools</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(job.requiredSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About Company</h3>

            <div className="flex items-center gap-3">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-slate-900">{company.name}</h4>
                <p className="text-xs text-slate-500">{company.industry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {company.description || 'Verified enterprise hiring on JobMate.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Headquarters:</span>
                <span className="font-medium text-slate-800">{company.location || 'India'}</span>
              </div>
              {company.employeeCount && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Company Size:</span>
                  <span className="font-medium text-slate-800">{company.employeeCount}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Visit <Globe className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {company._id && (
              <Link
                to={`/companies/${company._id}`}
                className="block text-center w-full py-2.5 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition"
              >
                View Company & All Jobs
              </Link>
            )}
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        hasAlreadyApplied={hasApplied}
        onApplicationSuccess={(application) => {
          setHasApplied(true);
          const compId = job?.company?._id || job?.company;
          setApplicationInfo({
            hasApplied: true,
            isSameJob: true,
            isSameCompany: true,
            status: application?.status || 'Applied',
            appliedAt: application?.createdAt || new Date(),
            companyName: job?.company?.name || ''
          });
          if (markApplied) {
            markApplied({ jobId: job?._id, companyId: compId });
          }
        }}
      />
    </div>
  );
};

export default JobDetailsPage;
