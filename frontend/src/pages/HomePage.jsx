import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, companiesAPI } from '../services/api';
import SearchBar from '../components/common/SearchBar';
import JobCard from '../components/common/JobCard';
import CompanyCard from '../components/common/CompanyCard';
import Loading from '../components/common/Loading';
import {
  ShieldCheck,
  ArrowRight,
  Code2,
  Layers,
  Database,
  Cpu,
  Building2
} from 'lucide-react';

const categoryIcons = {
  'Software Engineering': Code2,
  'Frontend Development': Layers,
  'Backend Development': Database,
  'Data Science & AI': Cpu,
  'DevOps & Cloud': ShieldCheck
};

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, lateRes, catRes, compRes] = await Promise.all([
          jobsAPI.getFeatured(),
          jobsAPI.getLatest(),
          jobsAPI.getCategories(),
          companiesAPI.getAll({ limit: 16 })
        ]);

        setFeaturedJobs(featRes.data.data.jobs || []);
        setLatestJobs(lateRes.data.data.jobs || []);
        setCategories(catRes.data.data.categories || []);
        const compList = compRes.data.data.companies || [];
        setAllCompanies(compList);
        setTopCompanies(compList.slice(0, 4));

        if (isAuthenticated) {
          try {
            const recRes = await jobsAPI.getRecommended();
            setRecommendedJobs(recRes.data.data.jobs || []);
          } catch (err) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleHeroSearch = ({ keyword, location }) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const tickerCompanies = allCompanies.length > 0 ? allCompanies : [
    { name: 'TechNova Solutions', industry: 'Software Engineering', activeJobsCount: 8 },
    { name: 'CloudBridge Technologies', industry: 'Cloud & Frontend', activeJobsCount: 6 },
    { name: 'NextGen Digital', industry: 'Backend APIs', activeJobsCount: 7 },
    { name: 'CodeCraft Labs', industry: 'Full Stack', activeJobsCount: 5 },
    { name: 'InnoSoft Systems', industry: 'AI & Data Science', activeJobsCount: 6 },
    { name: 'DataSphere Analytics', industry: 'DevOps & Analytics', activeJobsCount: 5 },
    { name: 'PixelWave Technologies', industry: 'Mobile Apps', activeJobsCount: 4 },
    { name: 'Vertex Innovations', industry: 'Enterprise Java', activeJobsCount: 6 }
  ];

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-16 gradient-hero border-b border-purple-200/80 bg-gradient-to-b from-purple-100/50 via-purple-50/30 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleHeroSearch} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-purple-950">Trending Searches:</span>
            {['React', 'Fresher', 'Remote', 'Node.js', 'DevOps', 'Data Science', 'TechNova', 'Full-time'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?keyword=${tag}`)}
                className="bg-white/95 hover:bg-purple-100 text-purple-900 hover:text-purple-700 px-3.5 py-1.5 rounded-xl border border-purple-200/90 transition shadow-xs cursor-pointer font-medium"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-purple-800">
              <span className="w-10 h-0.5 bg-gradient-to-r from-transparent to-purple-400" />
              <span>Top Companies Actively Hiring</span>
              <span className="w-10 h-0.5 bg-gradient-to-l from-transparent to-purple-400" />
            </div>

            <div className="relative w-full overflow-hidden py-2">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#faf5ff] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#faf5ff] to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee flex items-center gap-4">
                {[...tickerCompanies, ...tickerCompanies].map((comp, idx) => (
                  <Link
                    key={idx}
                    to={comp._id ? `/companies/${comp._id}` : `/jobs?keyword=${encodeURIComponent(comp.name)}`}
                    className="flex items-center gap-3 bg-white/95 hover:bg-purple-50/90 px-4 py-2.5 rounded-2xl border border-purple-200/90 shadow-xs hover:shadow-md hover:border-purple-400 transition shrink-0 group cursor-pointer"
                  >
                    {comp.logo ? (
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-8 h-8 rounded-lg object-cover border border-purple-200 bg-white shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 ${
                        comp.logo ? 'hidden' : 'flex'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition leading-tight">
                        {comp.name}
                      </p>
                      <p className="text-[10px] text-purple-600 font-semibold">
                        {comp.activeJobsCount ? `${comp.activeJobsCount} Openings` : comp.industry || 'Hiring'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-purple-500/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-white text-slate-900 shadow-md text-center border border-purple-200">
              <span className="text-[11px] font-black uppercase tracking-widest text-purple-700">
                JobMate Campus
              </span>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
                TOP HIRING '26
              </h3>
              <span className="mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-300">
                Direct Recruiter Access
              </span>
            </div>

            <div className="lg:col-span-5 space-y-3 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Stand out to leading recruiters nationwide
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Connect with 15+ verified enterprises actively looking for freshers and experienced engineering talent on JobMate.
              </p>
              <div>
                <Link
                  to="/companies"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/30 transition cursor-pointer"
                >
                  <span>Explore Companies</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 overflow-hidden relative py-2">
              <div className="animate-marquee-slow flex flex-col gap-2.5">
                <div className="flex gap-2.5">
                  {tickerCompanies.slice(0, 6).map((c, i) => (
                    <Link
                      key={i}
                      to={c._id ? `/companies/${c._id}` : `/jobs?keyword=${encodeURIComponent(c.name)}`}
                      className="w-32 h-14 bg-white/95 rounded-xl p-2 flex items-center justify-center gap-2 shrink-0 shadow-sm border border-purple-200/70 hover:bg-white hover:scale-105 transition"
                    >
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-purple-600" />
                      )}
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {c.name.split(' ')[0]}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-2.5 pl-6">
                  {tickerCompanies.slice(6, 12).map((c, i) => (
                    <Link
                      key={i}
                      to={c._id ? `/companies/${c._id}` : `/jobs?keyword=${encodeURIComponent(c.name)}`}
                      className="w-32 h-14 bg-white/95 rounded-xl p-2 flex items-center justify-center gap-2 shrink-0 shadow-sm border border-purple-200/70 hover:bg-white hover:scale-105 transition"
                    >
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-purple-600" />
                      )}
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {c.name.split(' ')[0]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                Trending Disciplines
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Explore roles in the fastest growing tech disciplines</p>
          </div>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
          >
            Explore all disciplines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((cat, idx) => {
            const Icon = categoryIcons[cat.name] || Code2;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white hover:bg-gradient-to-b hover:from-purple-50/60 hover:to-white p-5 rounded-2xl border border-purple-200/90 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/15 transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-3.5 group-hover:text-purple-700 transition truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-purple-600 font-semibold mt-1">{cat.jobCount} open roles</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 rounded-3xl bg-gradient-to-b from-purple-100/40 via-purple-50/20 to-white/60 border border-purple-200/70 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-200/80 text-purple-900 border border-purple-300">
                Top Picks
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Featured Jobs</h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">Hand-picked openings from vetted partner enterprises</p>
          </div>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
          >
            View all {featuredJobs.length}+ featured jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading featured jobs..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {isAuthenticated && recommendedJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 rounded-3xl bg-gradient-to-r from-purple-100/50 via-fuchsia-50/30 to-purple-100/50 border border-purple-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-200 text-purple-900 border border-purple-300">
                  Tailored For You
                </span>
                <h2 className="text-2xl font-bold text-slate-900">Recommended Jobs</h2>
              </div>
              <p className="text-sm text-purple-700 font-medium mt-1">Based on your skills: {(user?.skills || []).slice(0, 4).join(', ') || 'your profile'}</p>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              See all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedJobs.slice(0, 4).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                Fresh Openings
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Openings</h2>
            <p className="text-sm text-slate-500 mt-1">Recently posted software and technology vacancies</p>
          </div>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
          >
            Explore all {latestJobs.length}+ jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 rounded-3xl bg-gradient-to-b from-purple-50/50 via-purple-50/20 to-transparent border border-purple-200/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                Enterprise Partners
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Top Hiring Companies</h2>
            <p className="text-sm text-slate-500 mt-1">Directly hiring from JobMate’s candidate pool</p>
          </div>
          <Link
            to="/companies"
            className="mt-3 sm:mt-0 text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition"
          >
            View all companies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCompanies.map((comp) => (
            <CompanyCard key={comp._id} company={comp} />
          ))}
        </div>
      </section>


    </div>
  );
};

export default HomePage;
