import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedJobsAPI } from '../services/api';
import JobCard from '../components/common/JobCard';
import Loading from '../components/common/Loading';
import { Bookmark, Briefcase } from 'lucide-react';

const SavedJobsPage = () => {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await savedJobsAPI.getAll();
      setSavedList(res.data.data.savedJobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setSavedList((prev) => prev.filter((item) => (item.job?._id || item.job) !== jobId));
  };

  if (loading) {
    return <Loading fullScreen text="Loading your bookmarked jobs..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-sm text-slate-500 mt-1">
          Positions you have bookmarked for later review and application.
        </p>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved jobs yet</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any job card to save it for quick access later.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((item) =>
            item.job ? (
              <JobCard
                key={item._id}
                job={item.job}
                isInitiallySaved={true}
                onUnsave={handleUnsave}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
