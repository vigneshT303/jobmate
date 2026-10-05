import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeAPI } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferredLocation: '',
    candidateType: 'fresher',
    bio: '',
    skills: '',
    linkedin: '',
    github: '',
    resumeUrl: '',
    resumeFileName: '',
    education: [],
    experience: [],
    projects: [],
    certifications: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        preferredLocation: (user.preferredLocation || []).join(', '),
        candidateType: user.candidateType || 'fresher',
        bio: user.bio || '',
        skills: (user.skills || []).join(', '),
        linkedin: user.linkedin || '',
        github: user.github || '',
        resumeUrl: user.resumeUrl || '',
        resumeFileName: user.resumeFileName || '',
        education: user.education || [],
        experience: user.experience || [],
        projects: user.projects || [],
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5MB.');
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
        resumeFileName: uploaded.fileName
      }));
      toast.success('Resume file uploaded and saved!');
    } catch (err) {
      toast.error('Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        preferredLocation: formData.preferredLocation
          ? formData.preferredLocation.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        candidateType: formData.candidateType,
        bio: formData.bio,
        skills: formData.skills
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        linkedin: formData.linkedin,
        github: formData.github,
        resumeUrl: formData.resumeUrl,
        resumeFileName: formData.resumeFileName,
        education: formData.education,
        experience: formData.experience,
        projects: formData.projects,
        certifications: formData.certifications
      };

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' }
      ]
    }));
  };
  const updateEducationItem = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };
  const removeEducation = (index) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      ]
    }));
  };
  const updateExperienceItem = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };
  const removeExperience = (index) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', link: '', technologies: [] }]
    }));
  };
  const updateProjectItem = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };
  const removeProject = (index) => {
    setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your credentials, tech skills, and resume visible to recruiters.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Candidate Status
              </label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="candidateType"
                    value="fresher"
                    checked={formData.candidateType === 'fresher'}
                    onChange={(e) => setFormData({ ...formData, candidateType: e.target.value })}
                    className="w-4 h-4 text-indigo-600"
                  />
                  Fresher (Entry Level)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="candidateType"
                    value="experienced"
                    checked={formData.candidateType === 'experienced'}
                    onChange={(e) => setFormData({ ...formData, candidateType: e.target.value })}
                    className="w-4 h-4 text-indigo-600"
                  />
                  Experienced Professional
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Locations (comma separated)
              </label>
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                placeholder="e.g. Bangalore, Hyderabad, Remote"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Summary / Bio
            </label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief overview of your experience, technical focus, and career aspirations..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Skills & Master Resume</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React.js, Node.js, Express, MongoDB, TailwindCSS, Docker, Git"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {formData.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Default Resume Document (PDF/DOCX max 5MB)
            </label>

            {formData.resumeUrl ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      {formData.resumeFileName || 'Stored Resume.pdf'}
                    </p>
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      Download / View Resume <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition">
                  Replace Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 rounded-2xl cursor-pointer transition">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Click to upload your resume</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOC, DOCX up to 5MB</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            )}

            {uploadingResume && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 mt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading resume to cloud storage...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FaLinkedin className="w-3.5 h-3.5 text-blue-600" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FaGithub className="w-3.5 h-3.5 text-slate-800" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Education</span>
            </h2>
            <button
              type="button"
              onClick={addEducation}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Degree
            </button>
          </div>

          {formData.education.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree / Certificate</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducationItem(idx, 'degree', e.target.value)}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">College / University</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducationItem(idx, 'institution', e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Years (Start - End)</label>
                  <input
                    type="text"
                    value={edu.endYear}
                    onChange={(e) => updateEducationItem(idx, 'endYear', e.target.value)}
                    placeholder="e.g. 2022 - 2026"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Grade / CGPA</label>
                  <input
                    type="text"
                    value={edu.grade}
                    onChange={(e) => updateEducationItem(idx, 'grade', e.target.value)}
                    placeholder="e.g. 8.5 CGPA"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Work & Internship Experience</span>
            </h2>
            <button
              type="button"
              onClick={addExperience}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>

          {formData.experience.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperienceItem(idx, 'title', e.target.value)}
                    placeholder="e.g. Full Stack Developer Intern"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperienceItem(idx, 'company', e.target.value)}
                    placeholder="e.g. Tech Solutions Pvt Ltd"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperienceItem(idx, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2024 - Present"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperienceItem(idx, 'location', e.target.value)}
                    placeholder="e.g. Bangalore / Remote"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Responsibilities / Highlights</label>
                <textarea
                  rows="2"
                  value={exp.description}
                  onChange={(e) => updateExperienceItem(idx, 'description', e.target.value)}
                  placeholder="Built REST APIs, optimized DB queries..."
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
