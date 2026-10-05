import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/common/JobCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import { SlidersHorizontal, Briefcase, ArrowUpDown } from 'lucide-react';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    workMode: searchParams.get('workMode') || '',
    experience: searchParams.get('experience') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page'), 10) || 1
  });

  useEffect(() => {
    const newParams = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k]) newParams[k] = filters[k];
    });
    setSearchParams(newParams, { replace: true });
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: filters.keyword,
        location: filters.location,
        category: filters.category,
        jobType: filters.jobType,
        workMode: filters.workMode,
        experience: filters.experience,
        sort: filters.sort,
        page: filters.page,
        limit: 9
      };
      const res = await jobsAPI.getAll(params);
      setJobs(res.data.data.jobs || []);
      setPagination(res.data.meta?.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBar = ({ keyword, location }) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
      location,
      page: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      jobType: '',
      workMode: '',
      experience: '',
      sort: 'latest',
      page: 1
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore <span className="gradient-text font-black">Tech Jobs</span>
          </h1>
          <p className="text-sm text-purple-700/80 mt-1">
            Discover verified software engineering openings across top technology companies and high-growth startups.
          </p>
        </div>

        <SearchBar
          onSearch={handleSearchBar}
          initialKeyword={filters.keyword}
          initialLocation={filters.location}
        />
      </div>

      <div className="flex items-start gap-8 pt-2">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-semibold text-purple-700 bg-purple-50"
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                Filters
              </button>

              <p className="text-xs font-semibold text-slate-600">
                {pagination ? (
                  <>
                    Showing <span className="text-purple-700 font-bold">{jobs.length}</span> of{' '}
                    <span className="text-purple-700 font-bold">{pagination.totalJobs}</span> verified jobs
                  </>
                ) : (
                  'Showing jobs'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                className="bg-purple-50/50 border border-purple-200 rounded-lg px-2.5 py-1 text-purple-900 font-medium focus:outline-none focus:border-purple-500"
              >
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loading text="Finding matching jobs..." />
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-purple-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No jobs match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find any job postings matching your current search parameters. Try clearing some filters or searching with different keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 gradient-brand text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-md shadow-purple-500/25 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <Pagination
            pagination={pagination}
            onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
          />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
