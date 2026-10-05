import React, { useState, useEffect } from 'react';
import { adminAPI, companiesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  PlusCircle,
  Upload,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  FileCode,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Loader2
} from 'lucide-react';

const statusBadges = {
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
  Interview: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
};

const AdminDashboardPage = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState('');
  const [editingJob, setEditingJob] = useState(null);

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [companies, setCompanies] = useState([]);

  const initialJobForm = {
    title: '',
    company: '',
    companyName: '',
    companyLogo: '',
    category: 'Software Engineering',
    description: '',
    responsibilities: '',
    requirements: '',
    requiredSkills: '',
    experience: 'Fresher (0-2 years)',
    education: "Bachelor's Degree",
    salaryDisplay: '₹6.0 - 12.0 LPA',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    workMode: 'On-site',
    vacancies: 1,
    applicationDeadline: '',
    status: 'active',
    benefits: 'Health Insurance, Flexible Hours'
  };
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [submittingJob, setSubmittingJob] = useState(false);

  const [jsonFile, setJsonFile] = useState(null);
  const [jsonRawText, setJsonRawText] = useState('');
  const [uploadingJson, setUploadingJson] = useState(false);
  const [jsonUploadStats, setJsonUploadStats] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await adminAPI.getAllJobs({ search: jobSearch, limit: 50 });
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      toast.error('Failed to load admin jobs.');
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setAppsLoading(true);
      const res = await adminAPI.getAllApplications({ status: appStatusFilter, limit: 50 });
      setApplications(res.data.data.applications || []);
    } catch (err) {
      toast.error('Failed to load applications.');
    } finally {
      setAppsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await adminAPI.getAllUsers({ limit: 50 });
      setUsers(res.data.data.users || []);
    } catch (err) {
      toast.error('Failed to load user records.');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await companiesAPI.getAll({ limit: 50 });
      setCompanies(res.data.data.companies || []);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, appStatusFilter]);

  const handleCreateJob = async (e) => {
    e.preventDefault();

    if (!jobForm.title || (!jobForm.company && !jobForm.companyName)) {
      toast.error('Please specify Job Title and Company.');
      return;
    }

    try {
      setSubmittingJob(true);
      const payload = {
        title: jobForm.title,
        company: jobForm.company || undefined,
        companyName: jobForm.companyName || undefined,
        companyLogo: jobForm.companyLogo,
        category: jobForm.category,
        description: jobForm.description,
        responsibilities: jobForm.responsibilities,
        requirements: jobForm.requirements,
        requiredSkills: jobForm.requiredSkills,
        experience: jobForm.experience,
        education: jobForm.education,
        salary: { display: jobForm.salaryDisplay },
        location: jobForm.location,
        jobType: jobForm.jobType,
        workMode: jobForm.workMode,
        vacancies: Number(jobForm.vacancies),
        applicationDeadline: jobForm.applicationDeadline || undefined,
        status: jobForm.status,
        benefits: jobForm.benefits
      };

      if (editingJob) {
        await adminAPI.updateJob(editingJob._id, payload);
        toast.success('Job posting updated successfully!');
        setEditingJob(null);
      } else {
        await adminAPI.createJob(payload);
        toast.success('Job published successfully! Now visible on public Jobs page.');
      }

      setJobForm(initialJobForm);
      setActiveTab('jobs');
      fetchJobs();
      fetchStats();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save job posting.';
      toast.error(msg);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await adminAPI.updateJobStatus(jobId, nextStatus);
      toast.success(`Job marked as ${nextStatus}`);
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to permanently delete this job posting and its applications?')) {
      try {
        await adminAPI.deleteJob(jobId);
        toast.success('Job deleted.');
        fetchJobs();
        fetchStats();
      } catch (err) {
        toast.error('Failed to delete job.');
      }
    }
  };

  const handleEditJobClick = (j) => {
    setEditingJob(j);
    setJobForm({
      title: j.title || '',
      company: j.company?._id || j.company || '',
      companyName: j.company?.name || '',
      companyLogo: j.companyLogo || j.company?.logo || '',
      category: j.category || 'Software Engineering',
      description: j.description || '',
      responsibilities: (j.responsibilities || []).join('\n'),
      requirements: (j.requirements || []).join('\n'),
      requiredSkills: (j.requiredSkills || []).join(', '),
      experience: j.experience || '',
      education: j.education || '',
      salaryDisplay: j.salary?.display || '',
      location: j.location || '',
      jobType: j.jobType || 'Full-time',
      workMode: j.workMode || 'On-site',
      vacancies: j.vacancies || 1,
      applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '',
      status: j.status || 'active',
      benefits: (j.benefits || []).join(', ')
    });
    setActiveTab('create-job');
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    if (!newStatus) return;

    // Immediately and automatically update local state for instant UI response
    const prevApps = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      await adminAPI.updateApplicationStatus(appId, { status: newStatus });
      toast.success(`Application status automatically updated to "${newStatus}".`);
      fetchStats();
    } catch (err) {
      setApplications(prevApps);
      toast.error('Failed to update application status.');
    }
  };

  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      await adminAPI.updateUserStatus(userId, { isActive: !currentActive });
      toast.success(`User ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  const handleBulkUploadJson = async (e) => {
    e.preventDefault();
    try {
      setUploadingJson(true);
      setJsonUploadStats(null);

      let payload;
      if (jsonFile) {
        payload = new FormData();
        payload.append('file', jsonFile);
      } else if (jsonRawText.trim()) {
        try {
          payload = JSON.parse(jsonRawText);
        } catch (parseErr) {
          toast.error('Invalid JSON syntax in text area.');
          setUploadingJson(false);
          return;
        }
      } else {
        toast.error('Please upload a .json file or paste a JSON array of jobs.');
        setUploadingJson(false);
        return;
      }

      const res = await adminAPI.bulkUploadJobsJson(payload);
      setJsonUploadStats(res.data.data);
      toast.success(res.data.message || 'Jobs imported successfully into MongoDB!');
      fetchStats();
      setJsonFile(null);
      setJsonRawText('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to bulk-import jobs.';
      toast.error(msg);
    } finally {
      setUploadingJson(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Access
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            JobMate Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Publish jobs, manage enterprise companies, review applicants, and import jobs via JSON.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingJob(null);
              setJobForm(initialJobForm);
              setActiveTab('create-job');
            }}
            className="px-4 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-95 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </button>

          <button
            onClick={() => setActiveTab('json-upload')}
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs uppercase tracking-wider hover:bg-purple-100 transition flex items-center gap-2"
            title="Import jobs directly into MongoDB via JSON file"
          >
            <FileCode className="w-4 h-4" />
            <span>Bulk Upload JSON</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'jobs', label: `Jobs (${stats?.totalJobs || 0})`, icon: Briefcase },
          { id: 'create-job', label: editingJob ? 'Edit Job' : 'Post Job Form', icon: PlusCircle },
          { id: 'json-upload', label: 'Bulk JSON Upload', icon: FileCode },
          { id: 'applications', label: `Applications (${stats?.totalApplications || 0})`, icon: FileText },
          { id: 'users', label: `Users (${stats?.totalUsers || 0})`, icon: Users },
          { id: 'companies', label: `Companies (${stats?.totalCompanies || 0})`, icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Total Candidates</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Freshers & Experienced</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Active Job Posts</span>
                <Briefcase className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
                {stats?.activeJobs || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Out of {stats?.totalJobs || 0} total</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Applications</span>
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-2">
                {stats?.totalApplications || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Submitted by job seekers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Partner Companies</span>
                <Building2 className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {stats?.totalCompanies || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Hiring organizations</p>
            </div>
          </div>

          {stats?.statusBreakdown && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recruitment Funnel Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(stats.statusBreakdown).map(([statusName, count]) => (
                  <div key={statusName} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{statusName}</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Applications
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {(stats?.recentApplications || []).map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{app.fullName}</p>
                      <p className="text-slate-500">{app.job?.title || 'Job role'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recently Posted Jobs
                </h3>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Manage Jobs
                </button>
              </div>
              <div className="space-y-3">
                {(stats?.recentJobs || []).map((j) => (
                  <div key={j._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{j.title}</p>
                      <p className="text-slate-500">{j.company?.name || 'Company'}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        j.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                placeholder="Search job title, category, location..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={fetchJobs}
              className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          {jobsLoading ? (
            <Loading text="Loading job directory..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-700 border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Job Title & Company</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Type & Mode</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Applicants</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((j) => (
                      <tr key={j._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{j.title}</p>
                          <p className="text-slate-500">{j.company?.name || 'Company'}</p>
                        </td>
                        <td className="p-4">{j.category}</td>
                        <td className="p-4">
                          <span>{j.jobType}</span>
                          <span className="block text-[11px] text-slate-400">{j.workMode}</span>
                        </td>
                        <td className="p-4 font-semibold text-emerald-600">{j.salary?.display || 'Negotiable'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleJobStatus(j._id, j.status)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                              j.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                            title="Click to toggle status"
                          >
                            {j.status}
                          </button>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{j.applicationsCount || 0}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditJobClick(j)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(j._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create-job' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingJob ? `Edit Job: ${editingJob.title}` : 'Post a New Job Opportunity'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active jobs immediately appear on the public jobs search board.
              </p>
            </div>
            {editingJob && (
              <button
                onClick={() => {
                  setEditingJob(null);
                  setJobForm(initialJobForm);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Full Stack MERN Developer"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Category *
                </label>
                <select
                  value={jobForm.category}
                  onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Quality Assurance & Testing">Quality Assurance & Testing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Existing Company
                </label>
                <select
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value, companyName: '' })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="">-- Choose Company --</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Or Enter New Company Name
                </label>
                <input
                  type="text"
                  value={jobForm.companyName}
                  onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value, company: '' })}
                  placeholder="e.g. NextGen AI Corp"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Logo URL (optional)
              </label>
              <input
                type="url"
                value={jobForm.companyLogo}
                onChange={(e) => setJobForm({ ...jobForm, companyLogo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Job Description *
              </label>
              <textarea
                rows="4"
                required
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Describe role objectives, team dynamics, day-to-day impact..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:bg-white resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Responsibilities (one per line) *
                </label>
                <textarea
                  rows="3"
                  required
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  placeholder="Design clean React components&#10;Optimize MongoDB queries&#10;Review pull requests"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:bg-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Candidate Requirements (one per line)
                </label>
                <textarea
                  rows="3"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Degree in Computer Science&#10;Proficiency in Git workflows"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:bg-white resize-y"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Required Skills (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB, TailwindCSS"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Experience Level *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  placeholder="e.g. Fresher / 1-3 years"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Education Requirement *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.education}
                  onChange={(e) => setJobForm({ ...jobForm, education: e.target.value })}
                  placeholder="B.Tech / B.E. / BCA / MCA / Any Graduate"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Salary Display
                </label>
                <input
                  type="text"
                  value={jobForm.salaryDisplay}
                  onChange={(e) => setJobForm({ ...jobForm, salaryDisplay: e.target.value })}
                  placeholder="e.g. ₹6.0 - 10.0 LPA or Negotiable"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g. Bangalore, India"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Type *
                </label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Mode *
                </label>
                <select
                  value={jobForm.workMode}
                  onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Vacancies
                </label>
                <input
                  type="number"
                  min="1"
                  value={jobForm.vacancies}
                  onChange={(e) => setJobForm({ ...jobForm, vacancies: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={jobForm.applicationDeadline}
                  onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Status
                </label>
                <select
                  value={jobForm.status}
                  onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Perks & Benefits (comma separated)
              </label>
              <input
                type="text"
                value={jobForm.benefits}
                onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                placeholder="Health Insurance, ESOPs, Free Lunch, Annual Bonus"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submittingJob}
                className="px-8 py-3 rounded-2xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
              >
                {submittingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>{editingJob ? 'Update Job Posting' : 'Publish Job to Public Page'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'json-upload' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Bulk Upload Jobs to MongoDB via JSON File
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Directly import dozens of jobs into the MongoDB database using a JSON file or JSON payload.
            </p>
          </div>

          <form onSubmit={handleBulkUploadJson} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Option 1: Upload a .json File
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/30 rounded-2xl cursor-pointer transition text-center">
                <Upload className="w-8 h-8 text-purple-500 mb-1" />
                <span className="text-xs font-bold text-slate-800">
                  {jsonFile ? jsonFile.name : 'Select or drop sample_jobs_import.json'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Accepts JSON array of jobs matching Job schema
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => setJsonFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Option 2: Paste Raw JSON Array
              </label>
              <textarea
                rows="6"
                value={jsonRawText}
                onChange={(e) => setJsonRawText(e.target.value)}
                placeholder='[ { "title": "Lead Software Engineer", "companyName": "AI Systems", "category": "Software Engineering", ... } ]'
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={uploadingJson}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploadingJson ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing Jobs into MongoDB...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import Jobs into MongoDB</span>
                </>
              )}
            </button>
          </form>

          {jsonUploadStats && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Successfully imported {jsonUploadStats.insertedCount} jobs into MongoDB!
              </p>
              {jsonUploadStats.errors && jsonUploadStats.errors.length > 0 && (
                <div className="text-rose-700 space-y-1 pt-1">
                  <p className="font-semibold">Import Warnings / Errors:</p>
                  <ul className="list-disc list-inside">
                    {jsonUploadStats.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-700">Filter by Status:</span>
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={fetchApplications}
              className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {appsLoading ? (
            <Loading text="Loading applications..." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-700 border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Target Job</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4">Update Status</th>
                      <th className="p-4 text-right">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{app.fullName}</p>
                          <p className="text-slate-500">{app.email}</p>
                          <p className="text-[11px] text-slate-400">{app.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-800">{app.job?.title || 'Job'}</p>
                          <p className="text-indigo-600 text-[11px]">{app.job?.company?.name}</p>
                        </td>
                        <td className="p-4">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              View PDF <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                              statusBadges[app.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition shadow-xs"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4 text-right text-slate-400 text-[11px]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-700 border-b border-slate-200/80">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Candidate Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-slate-500">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 capitalize">{u.candidateType || 'fresher'}</td>
                      <td className="p-4">{u.location || 'India'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </button>
                      </td>
                      <td className="p-4 text-right text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((c) => (
              <div key={c._id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500">{c.industry}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">{c.location}</span>
                  <span className="font-semibold text-emerald-600">{c.activeJobsCount || 0} active jobs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
