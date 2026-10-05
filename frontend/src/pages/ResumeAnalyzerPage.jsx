import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeAPI } from '../services/api';
import Loading from '../components/common/Loading';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  TrendingUp,
  Brain,
  History,
  Target,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const ResumeAnalyzerPage = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [resumesHistory, setResumesHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeAPI.getMyResumes();
      setResumesHistory(res.data.data.resumes || []);
      if (res.data.data.resumes && res.data.data.resumes.length > 0 && !analysisResult) {
        setAnalysisResult(res.data.data.resumes[0].analysisResult);
      }
    } catch (err) {
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please sign in to analyze your resume with Gemini AI.');
      return;
    }

    if (activeTab === 'upload' && !file && !user?.resumeUrl) {
      toast.error('Please select a resume file (PDF, DOC, DOCX) to analyze.');
      return;
    }

    if (activeTab === 'text' && pastedText.trim().length < 40) {
      toast.error('Please paste sufficient resume text content (at least 40 characters).');
      return;
    }

    try {
      setAnalyzing(true);
      let payload;

      if (activeTab === 'upload' && file) {
        payload = new FormData();
        payload.append('resume', file);
      } else if (activeTab === 'text') {
        payload = { resumeText: pastedText };
      } else {
        payload = {};
      }

      const res = await resumeAPI.analyze(payload);
      setAnalysisResult(res.data.data.analysisResult);
      toast.success('Resume analysis completed successfully!');
      loadHistory();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to analyze resume.';
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Google Gemini AI ATS Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Supercharge Your Resume For Top Tech Recruiters
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Get real-time ATS scoring, detected technical proficiencies, missing keywords, and recruiter-grade bullet point recommendations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center border-b border-slate-100 pb-4 gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File (PDF/DOCX)
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Resume Text
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <History className="w-4 h-4" />
              Previous Scans ({resumesHistory.length})
            </button>
          )}
        </div>

        {activeTab === 'upload' && (
          <form onSubmit={handleAnalyze} className="space-y-4">
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/50 rounded-2xl cursor-pointer transition text-center">
              <Upload className="w-10 h-10 text-indigo-500 mb-2" />
              <span className="text-sm font-bold text-slate-800">
                {file ? file.name : 'Select or drag your resume file'}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Supports PDF, DOC, and DOCX format (Max: 5 MB)
              </span>
              {user?.resumeUrl && !file && (
                <span className="mt-2 text-xs text-indigo-600 font-semibold bg-indigo-100/70 px-2.5 py-1 rounded-md">
                  Active Profile Resume Available ({user.resumeFileName || 'resume.pdf'})
                </span>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Analyzing with Gemini AI...' : 'Scan Resume with Gemini AI'}</span>
            </button>
          </form>
        )}

        {activeTab === 'text' && (
          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              rows="7"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume sections, skills, work experience and projects here..."
              className="w-full text-xs font-mono p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white resize-y"
            />
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Analyzing with Gemini AI...' : 'Analyze Pasted Resume Text'}</span>
            </button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {resumesHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No previous resume scans recorded yet.</p>
            ) : (
              resumesHistory.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setAnalysisResult(item.analysisResult)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.fileName}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()} at{' '}
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                    Score: {item.analysisResult?.score || 0}/100
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {analyzing && <Loading fullScreen text="Google Gemini AI is extracting text and analyzing ATS parameters..." />}

      {analysisResult && !analyzing && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div
                  className={`w-24 h-24 rounded-3xl border-2 flex flex-col items-center justify-center font-extrabold shadow-sm ${getScoreColor(
                    analysisResult.score
                  )}`}
                >
                  <span className="text-3xl leading-none">{analysisResult.score}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold mt-1 text-slate-400">
                    ATS Score
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">Resume Health Evaluation</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                  {analysisResult.detectedSkills?.length || 0} Skills Detected
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-xs font-semibold text-indigo-700">
                  Gemini Flash 1.5
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detected Technical Proficiencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysisResult.detectedSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Profile Strengths</span>
              </div>
              <ul className="space-y-2.5 pt-1">
                {(analysisResult.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Areas to Enhance</span>
              </div>
              <ul className="space-y-2.5 pt-1">
                {(analysisResult.weaknesses || []).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-amber-600 font-bold text-sm">
                <Target className="w-5 h-5" />
                <span>High-Demand Missing Skills</span>
              </div>
              <p className="text-xs text-slate-500">Adding projects involving these skills will boost recruiter outreach:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(analysisResult.missingSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-600 font-bold text-sm">
                <Zap className="w-5 h-5" />
                <span>Recommended ATS Keywords</span>
              </div>
              <p className="text-xs text-slate-500">Naturally weave these high-ranking terms into your bullet points:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(analysisResult.atsKeywords || []).map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-base">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Step-by-Step Improvement Recommendations</span>
            </div>
            <div className="space-y-3 pt-2">
              {(analysisResult.improvementSuggestions || []).map((sug, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
