import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { applicationsAPI, resumeAPI } from '../../services/api';
import Modal from './Modal';
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ApplyJobModal = ({ isOpen, onClose, job, onApplicationSuccess, hasAlreadyApplied = false }) => {
  const { user, isAppliedToJobOrCompany } = useAuth();
  const toast = useToast();

  const companyId = job?.company?._id || job?.company;
  const alreadyApplied = hasAlreadyApplied || (isAppliedToJobOrCompany ? isAppliedToJobOrCompany(job?._id, companyId) : false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    coverLetter: '',
    resumeUrl: '',
    resumeOriginalName: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        education: user.education && user.education.length > 0
          ? `${user.education[0].degree} - ${user.education[0].institution}`
          : '',
        experience: user.candidateType === 'fresher' ? 'Fresher' : (user.experience && user.experience.length > 0 ? `${user.experience[0].title} at ${user.experience[0].company}` : '1-3 years'),
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        coverLetter: '',
        resumeUrl: user.resumeUrl || '',
        resumeOriginalName: user.resumeFileName || (user.resumeUrl ? 'Profile Resume.pdf' : '')
      });
      setResumeFile(null);
    }
  }, [user, isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file must be under 5MB.');
      return;
    }

    try {
      setUploadingResume(true);
      const data = new FormData();
      data.append('resume', file);
      const res = await resumeAPI.upload(data);
      const uploaded = res.data.data;

      setFormData((prev) => ({
        ...prev,
        resumeUrl: uploaded.fileUrl,
        resumeOriginalName: uploaded.fileName
      }));
      setResumeFile(file);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyApplied) {
      toast.info(`You have already applied to ${job?.company?.name || 'this company'}. You cannot apply to the same company again.`);
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in your name, email and phone number.');
      return;
    }

    if (!formData.resumeUrl) {
      toast.error('Please upload your resume to apply for this job.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        jobId: job._id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        resumeUrl: formData.resumeUrl,
        resumeOriginalName: formData.resumeOriginalName,
        coverLetter: formData.coverLetter.trim()
      };

      const res = await applicationsAPI.apply(payload);
      toast.success('You have successfully applied for this job.');
      if (onApplicationSuccess) onApplicationSuccess(res.data.data.application);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job?.title || 'Job'}`}
      maxWidth="max-w-2xl"
    >
      <div className="mb-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-900">{job?.company?.name || 'Company'}</p>
          <p className="text-xs text-indigo-700">{job?.location} • {job?.jobType} • {job?.workMode}</p>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
          {job?.salary?.display || 'Competitive'}
        </span>
      </div>

      {alreadyApplied && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You have already applied to <strong>{job?.company?.name || 'this company'}</strong>. Each candidate can only apply once per company.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="rahul@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Highest Education
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="e.g. B.Tech in CS (2026 Batch)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Experience Level
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="e.g. Fresher / 2 yrs experience"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Relevant Skills
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="e.g. React, Node.js, Git, MongoDB"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Resume (PDF, DOC, DOCX up to 5MB) *
          </label>

          {formData.resumeUrl ? (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-900 truncate">
                  {formData.resumeOriginalName || 'Uploaded Resume.pdf'}
                </span>
              </div>
              <label className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800 ml-4 shrink-0">
                Replace File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 rounded-xl cursor-pointer transition">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Click to upload your resume</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOC, DOCX up to 5MB</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {uploadingResume && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 mt-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading resume...</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Cover Message / Why are you a good fit? (Optional)
          </label>
          <textarea
            rows="3"
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
            placeholder="Briefly describe your interest in this role or notable accomplishments..."
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploadingResume || alreadyApplied}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center gap-2 ${
              alreadyApplied
                ? 'bg-slate-400 cursor-not-allowed opacity-75'
                : 'gradient-brand shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 cursor-pointer'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : alreadyApplied ? (
              <span>Already Applied</span>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
